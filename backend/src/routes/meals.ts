import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'crypto';

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const meals = await knex('meals').select('*');

    return { meals };
  });

  app.get('/:id', async (request) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getMealsParamsSchema.parse(request.params);

    const meal = await knex('meals').where('id', id).first();

    return { meal };
  });

  app.post('/', async (request, reply) => {
    // { title, description, isInDiet }

    const createTransactionBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      isInDiet: z.boolean(),
    });

    const { title, description, isInDiet } = createTransactionBodySchema.parse(request.body);

    await knex('meals')
      .insert({
        id: randomUUID(),
        title,
        description,
        isInDiet,
      });

    return reply.status(201).send();
  });
}