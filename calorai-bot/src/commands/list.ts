import { Context } from 'telegraf'
import { mealService } from '../services/meals'

export const listCommand = async (ctx: Context) => {
  const userId = ctx.from!.id.toString()

  try {
    const meals = await mealService.getTodaysMeals(userId)

    if (meals.length === 0) {
      await ctx.reply('No meals logged today. Use /log to add one!')
      return
    }

    const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0)
    const list = meals
      .map((m, i) =>
        `${i + 1}. ${m.meal_name}` +
        `${m.calories ? ` - ${m.calories} kcal` : ''}` +
        `\n    ID: ${m.id.slice(0, 8)}`
      )
      .join('\n\n')

    await ctx.reply(
      `Today's meals:\n\n${list}\n\n` +
      `Total calories: ${totalCalories} kcal`
    )
  } catch (error) {
    await ctx.reply('Could not fetch meals. Please try again.')
  }
}