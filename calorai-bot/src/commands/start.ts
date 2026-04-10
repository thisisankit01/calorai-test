import { Context } from 'telegraf'

export const startCommand = async (ctx: Context) => {
  await ctx.reply(
    `Welcome to CalorAI Health Bot! 🥗\n\n` +
    `Here's what I can do:\n\n` +
    `/log - Log a meal\n` +
    `/list - View today's meals\n` +
    `/edit - Edit a logged meal\n` +
    `/delete - Delete a logged meal\n\n` +
    `Let's start tracking your health!`
  )
}