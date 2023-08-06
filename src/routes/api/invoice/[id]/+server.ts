import type { RequestEvent } from '@sveltejs/kit'
import { error, json } from '@sveltejs/kit'
import { z } from 'zod'
import getInvoiceData from '$lib/invoice'
import { Prisma } from '@prisma/client'

const inputSchema = z.object({
	id: z.string().min(1)
})

const outputSchema = z.object({
	id: z.string(),
	index: z.number().gte(0),
	status: z.string(),
	txId: z.string(),
	createdAt: z.date(),
	expiredAt: z.date(),
	payedAt: z.date().nullable(),
	address: z.string(),
	amount: z.instanceof(Prisma.Decimal),
	qr: z.string(),
	url: z.string()
})

export async function GET({ params }: RequestEvent) {
	const result = inputSchema.safeParse(params)

	if (!result.success) {
		return json(result.error.format(), { status: 400 })
	}

	const data = await getInvoiceData(result.data.id)

	if (!data) {
		throw error(404)
	}

	const outputResult = outputSchema.safeParse(data)

	if (outputResult.success) {
		return json(outputResult.data)
	} else {
		return json(outputResult.error.format(), { status: 400 })
	}
}
