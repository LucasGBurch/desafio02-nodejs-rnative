import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'crypto';

export async function mealsRoutes(app: FastifyInstance) {
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