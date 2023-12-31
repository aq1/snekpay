// @ts-ignore: lib has no types
import bitcoin from 'bitcore-lib'
import { prisma } from '$lib/db'
import { type Invoice, InvoiceStatus, Prisma } from '@prisma/client'
import { z } from 'zod'
import axiom from '$lib/logs'


export default function generateAddress(xpub: string) {
	const i = Math.floor(Math.random() * 2 * 31)
	const hdPublicKey = bitcoin.HDPublicKey(xpub)
	const orderPublicKey = hdPublicKey.deriveChild(`m/0/${i}`)
	const pubkey = bitcoin.PublicKey(orderPublicKey.publicKey)
	const address = bitcoin.Address.fromPublicKey(pubkey)
	return {
		address: address.toString(),
		index: i
	}
}


const API_URL = 'https://blkhub.net'

const TXSchema = z.array(
	z.object({
		txid: z.string().min(1),
		vout: z.array(
			z.object({
				scriptpubkey_address: z.string().min(1),
				value: z.number().gt(0)
			})
		).nonempty(),
		status: z.object({
			confirmed: z.boolean(),
			block_time: z.number().gt(0)
		})
	})
)

async function sendWebhook(invoice: Invoice, tryN = 0) {
	if (!invoice.webhook) {
		return
	}

	if (tryN > 10) {
		return
	}

	try {
		const response = await fetch(invoice.webhook, {
			method: 'post',
			body: JSON.stringify(invoice),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		if (!response.ok) {
			throw new Error(await response.text())
		}
	} catch (err) {
		axiom.ingest('snekpay', [{ lvl: 'warn', msg: `Failed to send webhook ${err}` }])

		setTimeout(() => {
			sendWebhook(invoice, tryN + 1)
		}, 5000)

	}
}

async function processStaledInvoice(invoice: Invoice) {
	const updatedInvoice = await prisma.invoice.update({
		where: {
			id: invoice.id
		},
		data: {
			status: InvoiceStatus.STALED
		}
	})

	await sendWebhook(updatedInvoice)
}

async function processInvoice(invoice: Invoice) {
	const now = new Date()

	if (invoice.expiredAt < now) {
		return await processStaledInvoice(invoice)
	}

	const res = await fetch(`${API_URL}/api/address/${invoice.address}/txs`)
	if (!res.ok) {
		return
	}

	const parsed = TXSchema.safeParse(await res.json())
	if (!parsed.success) {
		return
	}

	for (const tx of parsed.data) {
		if (!tx.status.confirmed) {
			continue
		}
		for (const out of tx.vout) {
			if (out.scriptpubkey_address === invoice.address) {
				const txDate = new Date(tx.status.block_time * 1000)
				const txValue = new Prisma.Decimal(out.value).div(10 ** 8)

				if (txDate < invoice.createdAt || txValue < invoice.amount) {
					continue
				}

				axiom.ingest(
					'snekpay',
					[{
						lvl: 'info',
						msg: `Found TX`,
						invoiceId: invoice.id,
						tx: tx
					}]
				)

				const updatedInvoice = await prisma.invoice.update({
					where: {
						id: invoice.id
					},
					data: {
						status: InvoiceStatus.PAYED,
						txId: tx.txid,
						payedAt: txDate
					}
				})

				await sendWebhook(updatedInvoice)
				return
			}
		}
	}
}

export async function checkTransactions() {
	axiom.ingest('Checking transactions', {msg: 'check', lvl: 'info'})
	const invoices = await prisma.invoice.findMany({
		where: {
			status: InvoiceStatus.CREATED
		}
	})

	for (const invoice of invoices) {
		await processInvoice(invoice)
	}
}