<script>
	import axios from "axios"

	let email
	let password
	let login_error = ""
	let loading = false

	const login = async () => {

		localStorage.clearItem('authenticated')
		loading = true
		
		axios.post(`${import.meta.env.PUBLIC_INVITE_URL}api/login`,{
			email,
			password
		}).then((resp) => {
			//Login successful
			localStorage.setItem('authenticated',true)

			if(typeof window != 'undefined') window.location.href = '/'
		})
		.catch(() => {
			login_error = "Wrong credentials. Please try again"
			loading = false
		})

	}
</script>

<div class="grid place-content-center place-items-center">
	<div class="w-full max-w-md p-8 space-y-3 rounded-xl bg-gray-200 dark:bg-gray-900 dark:text-gray-100 shadow-md">
		<h1 class="text-2xl font-bold text-center">Login</h1>
		<form on:submit|preventDefault={login} class="space-y-6">
			<div class="space-y-1 text-sm">
				<label for="email" class="block dark:text-gray-400">Email</label>
				<input type="email" id="email" placeholder="someone@example.com" class="w-full px-4 py-3 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-indigo-400" bind:value={email} required autocomplete="email" autofocus>
			</div>
			<div class="space-y-1 text-sm">
				<label for="password" class="block dark:text-gray-400">Password</label>
				<input type="password" name="password" id="password" placeholder="Password" class="w-full px-4 py-3 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-indigo-400" bind:value={password} required autocomplete="current-password">
				<div class="flex justify-end text-xs dark:text-gray-400">
					<a rel="noopener noreferrer" href="/password-reset">Forgot Password?</a>
				</div>
			</div>
			<div class="text-xs mt-2">
				{login_error}
			</div>
			{#if !loading}
				<button class="block w-full p-3 text-center rounded-sm dark:text-gray-900 dark:bg-indigo-400">Sign in</button>
			{:else}
				<button class="block w-full p-3 text-center rounded-sm dark:text-gray-900 dark:bg-indigo-400">Please wait <span class="animate-ping">...</span></button>
			{/if}
		</form>
		<p class="text-xs text-center sm:px-6 dark:text-gray-400">Don't have an account?
			<a rel="noopener noreferrer" href="/register" class="underline dark:text-gray-100">Sign up</a>
		</p>
	</div>
</div>
