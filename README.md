# 📦 Stock Management WebSocket Backend

This backend service enables real-time stock CRUD operations using **WebSocket** with optional REST API support. Built with **Express**, **ws**, and **MySQL (via Knex)**, it supports soft deletes, user-specific stocks, filtering, searching, and stock out history logging with dashboard summaries.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- WebSocket (`ws`)
- MySQL
- Knex.js
- UUID

---

## 📁 Folder Structure

```
├── server.js              # Main WebSocket + Express server
├── stockManager.js        # Knex-based stock controller
├── migrations/            # DB schema files (Knex)
└── README.md              # This file
```

---

## 📦 Features

- ✅ Real-time stock CRUD via WebSocket
- ✅ Soft delete mechanism
- ✅ Stock out history logging
- ✅ Daily/Weekly/Monthly summary dashboard
- ✅ Filter and search by stock name/user/date
- ✅ REST API for basic reads

---

## 🧪 Testing with Postman

### REST Endpoint

#### `GET /stock`

> Retrieve all active (non-deleted) stocks.

- **URL:** `http://localhost:3480/stock`
- **Method:** `GET`

---

## 🔄 WebSocket Usage

**WebSocket URL:** `ws://localhost:3480`

### 🔌 On Connect
```json
{
  "type": "init",
  "data": [ ...stocks ]
}
```

---

## 🧾 Supported WebSocket Messages

### ➕ `create`
Create a new stock item.
```json
{
  "type": "create",
  "data": {
    "name": "Apple",
    "quantity": 100,
    "user_id": "user123",
    "date": "2025-06-11"
  }
}
```

---

### ✏️ `update`
Update stock by ID.
```json
{
  "type": "update",
  "data": {
    "id": "uuid",
    "name": "Banana",
    "quantity": 150
  }
}
```

---

### ➖ `stock_out`
Mark stock out and log history.
```json
{
  "type": "stock_out",
  "data": {
    "id": "uuid",
    "amount": 5,
    "date": "2025-06-11",
    "user_id": "user123"
  }
}
```

---

### ❌ `delete`
Soft delete a stock.
```json
{
  "type": "delete",
  "data": { "id": "uuid" }
}
```

---

### 📖 `read`
Read all stock with optional filters.
```json
{
  "type": "read",
  "data": {
    "search": "apple",
    "user_id": "user123"
  }
}
```

---

### 📊 `dashboard_summary`
Get summarized stock-out data.
```json
{
  "type": "dashboard_summary",
  "data": { "range": "daily" | "weekly" | "monthly" }
}
```

**Example response:**
```json
{
  "type": "dashboard_summary",
  "data": [
    { "date": "2025-06-10", "total": 20 },
    { "date": "2025-06-09", "total": 12 }
  ]
}
```

---

## 🧼 Soft Delete Behavior

- When `delete` is called, the `deleted_at` timestamp is set.
- All read operations exclude deleted records by default.

---

## 🛠️ Run Locally

```bash
npm install
npx knex migrate:latest
node server.js
```

---

## 📡 Tools for Testing

- [Postman](https://www.postman.com/)
- [WebSocket Echo Client](https://www.websocket.org/echo.html)
- [Insomnia](https://insomnia.rest/)

---

## 📧 Contact

Built by [Your Name]  
📧 Email: your.email@example.com
