<script>
	import { page } from '$app/stores'
</script>


<div class='w-screen h-screen flex justify-center items-center'>
	<div class='bg-white p-10 rounded-2xl shadow-black shadow-card flex flex-col gap-3 justify-center items-center'>
		<div class='text-2xl'><span>🐍 </span><span>{$page.status}</span></div>
		<div class='text-xl'>{$page.error?.message}</div>
	</div>
</div>
