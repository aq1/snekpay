import getInvoiceData, { generateQR } from '$lib/invoice'
import type { RequestEvent } from '@sveltejs/kit'
import { z } from 'zod'

const inputSchema = z.object({
	id: z.string().min(1)
})

export async function GET({ params, setHeaders }: RequestEvent) {
	const result = inputSchema.safeParse(params)

	if (!result.success) {
		return new Response(null, { status: 400 })
	}

	const invoice = await getInvoiceData(result.data.id)

	if (!invoice) {
		return new Response(null, { status: 400 })
	}

	setHeaders({
		'Content-Type': 'image/svg+xml'
	})

	return new Response(await generateQR(invoice.address, invoice.amount.toString()))
}
