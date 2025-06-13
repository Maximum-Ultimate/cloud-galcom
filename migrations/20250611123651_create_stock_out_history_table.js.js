exports.up = function(knex) {
  return knex.schema.createTable('stock_out_history', (table) => {
    table.increments('id').primary();
    table.uuid('stock_id').notNullable();
    table.string('user_id').notNullable();
    table.integer('amount').notNullable();
    table.date('date').notNullable(); // Date of stock out
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('stock_id').references('id').inTable('stock').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('stock_out_history');
};