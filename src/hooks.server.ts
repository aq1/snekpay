import { checkTransactions } from '$lib/btc'
import cron from 'node-cron'

cron.schedule('*/2 * * * *', checkTransactions)
