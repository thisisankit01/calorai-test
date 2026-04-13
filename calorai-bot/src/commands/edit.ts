import { Context } from 'telegraf'
import { mealService } from '../services/meals'

const waitingForId = new Map<number, 'id' | 'details'>()
const selectedMealId = new Map<number, string>()

export const editCommand = async (ctx: Context) => {
  const userId = ctx.from!.id

  try {
    const meals = await mealService.getRecentMeals(userId.toString())

    if (meals.length === 0) {
      await ctx.reply('No meals found to edit.')
      return
    }

    const list = meals
      .map((m, i) =>
        `${i + 1}. ${m.meal_name}` +
        `${m.calories ? ` - ${m.calories} kcal` : ''}` +
        `\n    ID: ${m.id.slice(0, 8)}`
      )
      .join('\n\n')

    waitingForId.set(userId, 'id')
    await ctx.reply(
      `Which meal do you want to edit?\n\nReply with the ID:\n\n${list}`
    )
  } catch (error) {
    await ctx.reply('Could not fetch meals. Please try again.')
  }
}

export const handleEditInput = async (ctx: Context): Promise<boolean> => {
  const userId = ctx.from!.id
  const state = waitingForId.get(userId)
  if (!state) return false

  const text = (ctx.message as any).text
  if (text.startsWith('/')) {
    waitingForId.delete(userId)
    selectedMealId.delete(userId)
    return false
  }

  if (state === 'id') {
    const shortId = text.trim()
    const meals = await mealService.getRecentMeals(userId.toString())
    const meal = meals.find((m) => m.id.startsWith(shortId))

    if (!meal) {
      await ctx.reply('Meal not found. Please try again with a valid ID.')
      return true
    }

    selectedMealId.set(userId, meal.id)
    waitingForId.set(userId, 'details')
    await ctx.reply(
      `Editing: ${meal.meal_name}\n\n` +
      `Send new details like:\nChicken Rice 500\n\n` +
      `Or just the name:\nChicken Rice`
    )
    return true
  }

  if (state === 'details') {
    const parts = text.trim().split(' ')
    const lastPart = parseInt(parts[parts.length - 1])
    const calories = isNaN(lastPart) ? null : lastPart
    const meal_name = calories === null
      ? text.trim()
      : parts.slice(0, -1).join(' ')

    const mealId = selectedMealId.get(userId)!

    try {
      await mealService.updateMeal(mealId, { meal_name, calories,  telegram_username: ctx.from!.username || null })
      await ctx.reply(
        `Updated successfully!\n\n` +
        `Meal: ${meal_name}\n` +
        `Calories: ${calories ? `${calories} kcal` : 'not specified'}`
      )
    } catch (error) {
      await ctx.reply('Could not update. Please try again.')
    }

    waitingForId.delete(userId)
    selectedMealId.delete(userId)
    return true
  }

  return false
}