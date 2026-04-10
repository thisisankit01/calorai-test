import { Context } from 'telegraf'
import { mealService } from '../services/meals'

const waitingForId = new Map<number, boolean>()

export const deleteCommand = async (ctx: Context) => {
  const userId = ctx.from!.id

  try {
    const meals = await mealService.getRecentMeals(userId.toString())

    if (meals.length === 0) {
      await ctx.reply('No meals found to delete.')
      return
    }

    const list = meals
      .map((m, i) =>
        `${i + 1}. ${m.meal_name}` +
        `${m.calories ? ` - ${m.calories} kcal` : ''}` +
        `\n    ID: ${m.id.slice(0, 8)}`
      )
      .join('\n\n')

    waitingForId.set(userId, true)
    await ctx.reply(
      `Which meal do you want to delete?\n\nReply with the ID:\n\n${list}`
    )
  } catch (error) {
    await ctx.reply('Could not fetch meals. Please try again.')
  }
}

export const handleDeleteInput = async (ctx: Context): Promise<boolean> => {
  const userId = ctx.from!.id
  if (!waitingForId.get(userId)) return false

  const text = (ctx.message as any).text
  if (text.startsWith('/')) {
    waitingForId.delete(userId)
    return false
  }

  const shortId = text.trim()
  const meals = await mealService.getRecentMeals(userId.toString())
  const meal = meals.find((m) => m.id.startsWith(shortId))

  if (!meal) {
    await ctx.reply('Meal not found. Please try again with a valid ID.')
    return true
  }

  try {
    await mealService.deleteMeal(meal.id)
    await ctx.reply(`Deleted successfully: ${meal.meal_name}`)
  } catch (error) {
    await ctx.reply('Could not delete. Please try again.')
  }

  waitingForId.delete(userId)
  return true
}