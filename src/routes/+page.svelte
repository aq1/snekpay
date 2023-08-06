<script>
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>Snek Pay</title>
</svelte:head>

<div class='w-full flex flex-col justify-center items-center py-10 px-5 break-all'>
	<div class='bg-white shadow-black shadow-card p-5 rounded-xl'>
		Do you want to accept bitcoin but don't want to deploy your own node? 🐍
	</div>

	<div class='w-1 h-10 bg-black mt-1'></div>

	<div class='bg-white shadow-black shadow-card p-5 rounded-xl'>
		<span class='font-mono'>
			curl -X POST -H 'Content-Type: application/json' \<br>
			-d \<br>
			'{'{'}"xpub": "Your XPUB key",<br>
				"amount": "0.1234",<br>
				"webhook": "http://localhost:8000"{'}'}' \<br>
			{$page.url.origin}/api/invoice<br>
		</span><br>
		<span class='text-gray-500'>Webhook is optional</span>
	</div>

	<div class='w-1 h-10 bg-black mt-1'></div>

	<div class='bg-white shadow-black shadow-card p-5 rounded-xl'>
		<span class='font-bold'>Response and webhook format:</span><br>
		<span>
			{'{'}<br>
			<span class='pl-2 text-gray-500'>// ID of your invoice</span><br>
			<span class='pl-2'>"id": "clkztt8em0000i4aoxt9zr90u",</span><br>
			<span class='pl-2 text-gray-500'>// User friendly invoice page</span><br>
			<span class='pl-2'>"url": "{$page.url.origin}/i/clkztt8em0000i4aoxt9zr90u"</span><br>
			<span class='pl-2 text-gray-500'>// Generated SVG to quickly open bitcoin wallet</span><br>
			<span class='pl-2'>"qr": "{$page.url.origin}/qr/clkztt8em0000i4aoxt9zr90u",</span><br>
			<span class='pl-2 text-gray-500'>// Automatically generated address from your wallet</span><br>
			<span class='pl-2'>"address": "1P8qs285ZZuYshK6zfFaYMhMT7JGFSVd1t",</span><br>
			<span class='pl-2 text-gray-500'>//Decimal as string. In BTC</span><br>
			<span class='pl-2'>"amount": "0.1234",</span><br>
			<span class='pl-2 text-gray-500'>// Status could be CREATED, STALED, PAYED</span><br>
			<span class='pl-2'>"status": "CREATED",</span><br>
			<span class='pl-2 text-gray-500'>// ID of transaction in bitcoin blockchain</span><br>
			<span class='pl-2'>"txId": "",</span><br>
			<span class='pl-2'>"createdAt": "{new Date().toISOString()}",</span><br>
			<span class='pl-2 text-gray-500'>// When will invoice expire</span><br>
			<span class='pl-2'>"expiredAt": "{new Date((new Date()).getTime() + 5 * 60 * 60000).toISOString()}",</span><br>
			<span class='pl-2 text-gray-500'>// Datetime of transaction in blockchain</span><br>
			<span class='pl-2'>"payedAt": null,</span><br>
			<span class='pl-2 text-gray-500'>// Index of address derivation.</span><br>
			<span class='pl-2 text-gray-500'>// Using this you can verify that address belongs to your wallet</span><br>
			<span class='pl-2'>"index": 42,</span><br>
			{'}'}
		</span>
	</div>

	<div class='w-1 h-10 bg-black mt-1'></div>

	<div class='bg-white shadow-black shadow-card p-5 rounded-xl'>
		<span class='font-bold'>And just wait for webhook request from our server<br>
			when address receives requested amount</span><br><br>
		<span>Or you can periodically check for status:</span><br>
		<span class='font-mono'>curl {$page.url.origin}/api/invoice/clkztt8em0000i4aoxt9zr90u</span><br>
	</div>
</div>
