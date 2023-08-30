import fastify from 'fastify';
import { knex } from './database';
import { env } from './env';
import { mealsRoutes } from './routes/meals';

const app = fastify();

app.register(mealsRoutes);

app.listen({
  port: env.PORT,
}).then(() => {
  console.log('HTTP Server Daily Diet Running.');
});
