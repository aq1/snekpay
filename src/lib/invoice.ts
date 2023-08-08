import { env } from '$env/dynamic/private';

import { prisma } from '$lib/db'
import QRCode from 'qrcode'

export async function generateQR(address: string, amount: string) {
	try {
		return await QRCode.toString(`bitcoin:${address}?amount=${amount}`, { type: 'svg' })
	} catch (e) {
		console.error(e)
	}
}

export function getInvoiceUrl(id: string) {
	return `${env.ORIGIN}/i/${id}`
}

export function getQRUrl(id: string) {
	return `${env.ORIGIN}/qr/${id}`
}

export default async function getInvoiceData(id: string) {
	const data = await prisma.invoice.findUnique({
		where: {
			id
		}
	})

	if (data === null) {
		return null
	}

	return {
		...data,
		qr: getQRUrl(data.id),
		url: getInvoiceUrl(data.id)
	}
}
