import { Telegraf } from 'telegraf'
import * as dotenv from 'dotenv'

dotenv.config()

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is missing in .env')
}

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)