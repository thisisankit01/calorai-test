import { bot } from './bot'
import { startCommand } from './commands/start'
import { logCommand, handleLogInput } from './commands/log'
import { listCommand } from './commands/list'
import { editCommand, handleEditInput } from './commands/edit'
import { deleteCommand, handleDeleteInput } from './commands/delete'

bot.start(startCommand)
bot.command('log', logCommand)
bot.command('list', listCommand)
bot.command('edit', editCommand)
bot.command('delete', deleteCommand)

bot.on('text', async (ctx) => {
  const handled =
    (await handleLogInput(ctx)) ||
    (await handleEditInput(ctx)) ||
    (await handleDeleteInput(ctx))

  if (!handled) return
})

bot.launch()
console.log('CalorAI bot is running...')

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))