import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const meals = await knex('meals').select('*')

    return { meals }
  })

  app.get('/:id', async (request) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    return { meal }
  })

  app.get('/summary', async () => {
    const meals = await knex('meals').select('*')

    const totalMeals = meals.length
    const dietMeals = meals.filter(meal => meal.isInDiet).length
    const notDietMeals = meals.filter(meal => !meal.isInDiet).length

    // Array com 0 e 1 se está ou não na dieta
    const mealsDietHistory = meals.map(meal => meal.isInDiet)

    let count = 0
    let bestSequence = 0
    for (const index in mealsDietHistory) {
      if (mealsDietHistory[index]) {
        count++
      } else {
        count = 0
      }

      // Atualizador de melhor sequência:
      if (bestSequence < count) {
        bestSequence = count
      }
      // console.log(mealsDietHistory[index])
    }
    // console.log(bestSequence)

    return {
      totalMeals,
      dietMeals,
      notDietMeals,
      bestSequence,
    }
  })

  app.post('/', async (request, reply) => {
    // { title, description, isInDiet }

    const createTransactionBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      isInDiet: z.boolean(),
    })

    const { title, description, isInDiet } = createTransactionBodySchema.parse(request.body)

    await knex('meals')
      .insert({
        id: randomUUID(),
        title,
        description,
        isInDiet,
      })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const updateTransactionBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      isInDiet: z.boolean(),
    })

    const { title, description, isInDiet } = updateTransactionBodySchema.parse(request.body)

    await knex('meals')
      .where('id', id)
      .update({
        title,
        description,
        isInDiet,
      })

      return reply.status(204).send()
  })

  app.delete('/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    await knex('meals')
      .where('id', id)
      .del()

    return reply.status(204).send()
  })
}