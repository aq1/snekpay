<script lang='ts'>
	export let data
</script>


<svelte:head>
	<title>Snek Pay - {data.invoice.amount || 0} BTC</title>
</svelte:head>

{#if data.invoice.id}
	<div class='flex h-screen justify-center items-center bg-pink-300'>
		<div
			class='text-center min-w-fit text-xs sm:text-base break-all w-fit flex flex-col gap-10 rounded-2xl bg-white p-5 shadow-black shadow-card'>
			<div>
				<span class='text-xl'>🐍 SnekPay</span>
			</div>
			<div class='flex flex-col gap-5'>
				<span>Awaiting <span class='font-bold'>{data.invoice.amount}</span> BTC to</span>
				<div class='border-2 p-2 border-black shadow-card'>
					{data.invoice.address}
				</div>
			</div>
			<div class='flex justify-center h-52 max-h-52'>
				<img src='{data.invoice.qr}' alt='{data.invoice.address}'>
			</div>
		</div>
	</div>
{/if}
