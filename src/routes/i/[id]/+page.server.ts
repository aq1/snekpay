import getInvoiceData from '$lib/invoice'
import type { RequestEvent } from '@sveltejs/kit'

export async function load({ params }: RequestEvent) {
	const invoice = await getInvoiceData(params.id || '')

	return {
		invoice: {
			...invoice,
			amount: invoice?.amount.toString()
		}
	}
}
