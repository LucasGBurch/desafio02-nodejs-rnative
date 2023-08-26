import { Knex } from "knex";

// Para criar a tabela com esta função:
// npm run knex -- migrate:latest
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary();
    table.text('title').notNullable();
    table.text('description').notNullable;
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.boolean('isInDiet').notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}

