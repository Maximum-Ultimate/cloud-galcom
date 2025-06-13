const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const stockManager = require('./stockManager');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

// Optional REST route
app.get('/stock', async (req, res) => {
    const data = await stockManager.read();
    res.json(data);
});

// WebSocket
wss.on('connection', async (ws) => {
    const stocks = await stockManager.read();
    ws.send(JSON.stringify({ type: 'init', data: stocks }));

    ws.on('message', async (message) => {
    try {
        const { type, data } = JSON.parse(message);
        let result;

        switch (type) {
            case 'create':
                data.id = uuidv4();
                result = await stockManager.create(data);
                broadcast({ type: 'created', data: result });

                // Refresh stock after creation
                const stocksAfterCreate = await stockManager.read();
                broadcast({ type: 'init', data: stocksAfterCreate });
                break;

            case 'update':
                result = await stockManager.update(data.id, data);
                if (result) {
                    broadcast({ type: 'updated', data: result });

                    const stocksAfterUpdate = await stockManager.read();
                    broadcast({ type: 'init', data: stocksAfterUpdate });
                }
                break;

            case 'stock_out':
                result = await stockManager.stockOut(data.id, data.amount, data.date, data.user_id);
                if (result) {
                    broadcast({ type: 'stock_out', data: result });

                    const stocksAfterOut = await stockManager.read();
                    broadcast({ type: 'init', data: stocksAfterOut });
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Not enough stock or item not found' }));
                }
                break;

            case 'delete':
                await stockManager.softDelete(data.id);
                broadcast({ type: 'deleted', data: { id: data.id } });

                const stocksAfterDelete = await stockManager.read();
                broadcast({ type: 'init', data: stocksAfterDelete });
                break;

            case 'read':
                const all = await stockManager.read(data || {});
                ws.send(JSON.stringify({ type: 'stock', data: all }));
                break;

            case 'dashboard_summary':
                const summary = await stockManager.stockOutSummary(data.range);
                ws.send(JSON.stringify({ type: 'dashboard_summary', data: summary }));
                break;

            default:
                ws.send(JSON.stringify({ error: 'Unknown type' }));
        }
    } catch (e) {
        ws.send(JSON.stringify({ error: 'Bad request' }));
    }
});
});

function broadcast(data) {
    const msg = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
}

const PORT = 3480;
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});