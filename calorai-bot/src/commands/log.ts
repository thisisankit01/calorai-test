import { Context } from 'telegraf'
import { mealService } from '../services/meals'

const waitingForMeal = new Set<number>()

export const logCommand = async (ctx: Context) => {
  const userId = ctx.from!.id
  waitingForMeal.add(userId)
  await ctx.reply(
    'What did you eat? Send me the meal name and calories like this:\n\nChicken Rice 450\n\nOr just the name if you don\'t know calories:\n\nChicken Rice'
  )
}

export const handleLogInput = async (ctx: Context) => {
  const userId = ctx.from!.id
  if (!waitingForMeal.has(userId)) return false

  const text = (ctx.message as any).text
  if (text.startsWith('/')) {
    waitingForMeal.delete(userId)
    return false
  }

  const parts = text.trim().split(' ')
  const lastPart = parseInt(parts[parts.length - 1])
  const calories = isNaN(lastPart) ? null : lastPart
  const meal_name = calories === null
    ? text.trim()
    : parts.slice(0, -1).join(' ')

  try {
    await mealService.logMeal({
      user_id: userId.toString(),
      telegram_username: ctx.from!.username || null,
      meal_name,
      calories,
    })
    await ctx.reply(
      `Logged successfully!\n\n` +
      `Meal: ${meal_name}\n` +
      `Calories: ${calories ? `${calories} kcal` : 'not specified'}`
    )
  } catch (error) {
    await ctx.reply('Something went wrong. Please try again.')
  }

  waitingForMeal.delete(userId)
  return true
}