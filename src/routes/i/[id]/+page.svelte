<script lang='ts'>
	import { page } from '$app/stores'

	export let data
</script>


<svelte:head>
	<title>Snek Pay - {data.invoice.amount || 0} BTC</title>
	<meta content='{data.invoice.amount}BTC to {data.invoice.address}' name='description' />
	<meta content='Snek Pay' property='og:site_name' />
	<meta content='Snek Pay' property='og:title' />
	<meta content='Snek Pay' name='twitter:title' />
	<meta content='{data.invoice.amount}BTC to {data.invoice.address}' property='og:description' />
	<meta content='{data.invoice.amount}BTC to {data.invoice.address}' name='twitter:description' />
	<meta content='summary_large_image' name='twitter:card' />
	<meta content='{$page.url.origin}' property='og:url' />
	<meta content='{$page.url.origin}' name='twitter:url' />
	<meta content='{$page.url.origin}/og-index.png' property='og:image' />
	<meta content='{$page.url.origin}/og-index.png' name='twitter:image' />
</svelte:head>

{#if data.invoice.id}
	<div class='flex h-screen justify-center items-center'>
		<div
			class='text-center min-w-fit text-xs sm:text-base break-all w-fit flex flex-col gap-10 rounded-2xl bg-white p-5 shadow-black shadow-card'>
			<div>
				<span class='text-xl'>🐍 SnekPay</span>
			</div>
			<div class='flex flex-col gap-5'>
				{#if data.invoice.status === 'CREATED'}
					<span>Awaiting <span class='font-bold'>{data.invoice.amount}</span> BTC to</span>
					<div class='border-2 p-2 border-black shadow-card'>
						{data.invoice.address}
					</div>
					<div class='flex justify-center h-52 max-h-52'>
						<img src='{data.invoice.qr}' alt='{data.invoice.address}'>
					</div>
					<div class='text-gray-500'>Expiration
						time: {data.invoice.expiredAt.toLocaleDateString()} {data.invoice.expiredAt.toLocaleTimeString()}
					</div>
				{:else if data.invoice.status === 'STALED'}
					<span>Sorry, payment time limit reached</span>
					<div class='text-gray-500'>Expiration
						time: {data.invoice.expiredAt.toLocaleDateString()} {data.invoice.expiredAt.toLocaleTimeString()}
					</div>
				{:else if data.invoice.status === 'PAYED'}
					<span>Payment received. Thank you!</span>
					{#if data.invoice.txId}
						<span class='text-pink-600'><a
							href='https://www.blockchain.com/explorer/transactions/btc/{data.invoice.txId}'>
							Your transaction in blockchain
						</a></span>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}
