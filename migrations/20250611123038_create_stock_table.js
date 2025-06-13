exports.up = function (knex) {
  return knex.schema.createTable('stock', (table) => {
    table.uuid('id').primary();

    table.string('name').notNullable();
    table.integer('quantity').notNullable();
    table.decimal('price', 10, 2).notNullable().defaultTo(0.00);
    table.string('supplier').notNullable().defaultTo('Unknown Supplier');
    table.string('category').notNullable().defaultTo('General');
    table.string('location').notNullable().defaultTo('Warehouse');
    table.string('description').nullable().defaultTo('No description provided');
    table.string('image_url').nullable().defaultTo('...');
    table.string('barcode').unique().nullable();
    table.string('status').defaultTo('available'); 
    table.date('expiry_date').nullable();
    table.integer('stock_out').defaultTo(0); // total stock taken out today
    table.date('date').notNullable(); // day of transaction
    table.string('user_id').notNullable(); // associated user
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stock');
};