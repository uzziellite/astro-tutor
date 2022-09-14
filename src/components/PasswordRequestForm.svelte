<script>
	import {Directus} from "@directus/sdk"

	const directus = new Directus(import.meta.env.PUBLIC_CMS)

	let email = ""
	let requesting = false
	let requested = false
	let error = ""
	let message = ""

	const requestPasswordReset = async () => {
		error = ""
		message = ""

		await directus.auth.password.request(
	    email,
	    //import.meta.env.PUBLIC_WEBAPP
	  ).then(() => {
	    
      message = "If you are registered with us, an email has already been sent to you with further instructions"

	  }).catch((err) => {
	    
       error = "Sorry, we do not recognize your account"

	  })
	}
</script>

<div class="w-full max-w-md p-8 space-y-3 rounded-xl bg-gray-200 dark:bg-gray-900 dark:text-gray-100 shadow-md">
	<h1 class="text-2xl font-bold text-center">
		Request New Password
	</h1>
	<form on:submit|preventDefault={requestPasswordReset} class="space-y-6">
		<div class="space-y-1 text-sm">
			<label for="email" class="block dark:text-gray-400">
				Email address
			</label>
			<input type="email" id="email" placeholder="someone@example.com" class="w-full px-4 py-3 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-indigo-400" bind:value={email} required autofocus>
		</div>
		{#if !requesting}
			<button class="block w-full p-3 text-center rounded-sm dark:text-gray-900 dark:bg-indigo-400">
				Request
			</button>
		{:else}
			<button class="block w-full p-3 text-center rounded-sm dark:text-gray-900 dark:bg-indigo-400">
				Requesting <span class="animate-ping">...</span>
			</button>
		{/if}
		{#if error.length > 0}
			<div class="text-sm text-red-600">
				{error}
			</div>
		{:else}
			<div class="text-sm text-green-600">
				{message}
			</div>
		{/if}
	</form>
</div>
