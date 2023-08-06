import getInvoiceData from '$lib/invoice'
import { type RequestEvent, error } from '@sveltejs/kit'

export async function load({ params }: RequestEvent) {
	const invoice = await getInvoiceData(params.id || '')

	if (!invoice) {
		throw error(404, 'Invoice not found')
	}

	return {
		invoice: {
			...invoice,
			amount: invoice?.amount.toString()
		}
	}
}
