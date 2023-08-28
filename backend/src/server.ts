import fastify from 'fastify';
import { randomUUID } from 'crypto';
import { knex } from './database';

const app = fastify();

app.get('/meals', async () => {
  const meals = await knex('meals')
    .select('*');

  return meals;
});

app.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP Server Daily Diet Running.');
});
