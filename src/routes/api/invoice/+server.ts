import { json, type RequestEvent } from '@sveltejs/kit'
import { prisma } from '$lib/db'
import generateAddress from '$lib/btc'
import { z } from 'zod'
import getInvoiceData from '$lib/invoice'
import { Prisma } from '@prisma/client'

const inputSchema = z.object({
	xpub: z.string().min(1),
	webhook: z.string(),
	amount: z.string().nonempty().transform((val,  ctx) => {
		const newVal = new Prisma.Decimal(val)
		if (newVal.lte(0)) {
			ctx.addIssue({
				code: z.ZodIssueCode.too_small,
				minimum: 0,
				inclusive: false,
				type: 'string',
				message: 'Amount must be greater than zero',
			})
		}
		return newVal
	})
})

export async function POST({ request }: RequestEvent) {
	let data, address, index

	try {
		data = await request.json()
	} catch (e) {
		console.log(e)
		return json({ _errors: ['Bad request body'] }, { status: 400 })
	}

	const result = inputSchema.safeParse(data)

	if (!result.success) {
		return json(result.error, { status: 400 })
	}

	try {
		const res = generateAddress(result.data.xpub)
		address = res.address
		index = res.index
	} catch {
		return json({ _errors: ['Invalid xpub key'] }, { status: 400 })
	}

	let invoice
	try {
		invoice = await prisma.invoice.create({
			data: {
				address,
				index,
				webhook: result.data.webhook,
				expiredAt: new Date((new Date()).getTime() + 180 * 60000),
				amount: result.data.amount
			}
		})
	} catch {
		return json({ _errors: ['Failed to create invoice'] }, { status: 400 })
	}

	return json(await getInvoiceData(invoice.id), { status: 201 })
}
