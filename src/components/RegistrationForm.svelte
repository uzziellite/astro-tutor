<script>
	import axios from "axios"

	let email
	let password
	let confirm_password
	let first_name
	let last_name
	let phone_number
	let location
	let address
	let registering = false
	let registered = false
	let message = ""
	let error = ""
	let error_bag = {}

	//Ensure passwords match
	$: {

		if(password !== confirm_password){
			error_bag.password = "Passwords do not match!"
		}else{
			delete error_bag.password
		}
	}

	//TODO
	//Verify email and phone numbers

	const register = async () => {
		registering = true
		message = ""
		error = ""

		axios.post(`${import.meta.env.PUBLIC_INVITE_URL}api/client`,{
			email,
			password,
			first_name,
			last_name,
			phone_number,
			location,
			address
		}).then((resp) => {
			
			message = resp.data.message
			
			registering = false
			
			registered = true

		}).catch((err) => {
			registering = false
			error = "Unable to register your account at the moment"
		})
	}
</script>

<div class="w-full p-8 space-y-3 rounded-xl bg-gray-200 dark:bg-gray-900 dark:text-gray-100 shadow-md">
	<h1 class="text-2xl font-bold text-center">
		Register
	</h1>
	<form on:submit|preventDefault={register}>
		<div class="grid sm:grid-cols-2 gap-2">
			<div class="space-y-1 text-sm">
				<label for="first_name" class="block dark:text-gray-400">First name</label>
				<input type="text" id="first_name" placeholder="Someone" class="w-full px-4 py-3 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-indigo-400" bind:value={first_name} required autofocus>
				{#if error_bag.first_name}
					<div class="text-xs text-red-600">
						{error_bag.first_name}
					</div>
				{/if}
			</div>
			<div class="space-y-1 text-sm">
				<label for="last_name" class="block dark:text-gray-400">Last name</label>
				<input type="text" id="last_name" placeholder="Unknown" class="w-full px-4 py-3 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-indigo-400" bind:value={last_name} required>
				{#if error_bag.last_name}
					<div class="text-xs text-red-600">
						{error_bag.last_name}
					</div>
				{/if}
			</div>
			<div class="space-y-1 text-sm">
				<label for="email" class="block dark:text-gray-400">Email</label>
				<input type="email" id="" placeholder="someone@example.com" class="w-full px-4 py-3 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-indigo-400" bind:value={email} required>
				{#if error_bag.email}
					<div class="text-xs text-red-600">
						{error_bag.email}
					</div>
				{/if}
			</div>
			<div class="space-y-1 text-sm">
				<label for="phone" class="block dark:text-gray-400">Phone Number</label>
				<input type="text" id="phone" placeholder="0712345678" class="w-full px-4 py-3 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-indigo-400" bind:value={phone_number} required>
				{#if error_bag.phone_number}
					<div class="text-xs text-red-600">
						{error_bag.phone_number}
					</div>
				{/if}
			</div>
			<div class="space-y-1 text-sm">
				<label for="location" class="block dark:text-gray-400">Location</label>
				<select id="location" class="w-full px-4 py-3 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-indigo-400" bind:value={location} required>
					<option>Nairobi</option>
					<option>Mombasa</option>
					<option>Kisumu</option>
				</select>
				{#if error_bag.location}
					<div class="text-xs text-red-600">
						{error_bag.location}
					</div>
				{/if}
			</div>
			<div class="space-y-1 text-sm">
				<label for="address" class="block dark:text-gray-400">Address</label>
				<input type="text" id="address" placeholder="Westlands Nairobi, Gables Apartments" class="w-full px-4 py-3 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-indigo-400" bind:value={address} autocomplete="address" required>
				{#if error_bag.address}
					<div class="text-xs text-red-600">
						{error_bag.address}
					</div>
				{/if}
			</div>
			<div class="space-y-1 text-sm">
				<label for="password" class="block dark:text-gray-400">Password</label>
				<input type="password" id="password" placeholder="Password" class="w-full px-4 py-3 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-indigo-400" bind:value={password} autocomplete="new-password" required>
				{#if error_bag.password}
					<div class="text-xs text-red-600">
						{error_bag.password}
					</div>
				{/if}
			</div>
			<div class="space-y-1 text-sm">
				<label for="confirm_password" class="block dark:text-gray-400">Confirm Password</label>
				<input type="password" id="confirm_password" placeholder="Confirm Password" class="w-full px-4 py-3 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-indigo-400" bind:value={confirm_password} autocomplete="new-password" required>
				{#if error_bag.password}
					<div class="text-xs text-red-600">
						{error_bag.password}
					</div>
				{/if}
			</div>
		</div>
		{#if !registering}
			<button class="block w-full p-3 text-center rounded-sm dark:text-gray-900 dark:bg-indigo-400">
				Register
			</button>
		{:else}
			<button class="block w-full p-3 text-center rounded-sm dark:text-gray-900 dark:bg-indigo-400">
				Please wait <span class="animate-ping">...</span>
			</button>
		{/if}
		{#if registered}
			<div class="text-sm text-green-600 text-center">
				{message}
			</div>
		{/if}
		{#if !registering}
			<div class="text-sm text-red-600 text-center">
				{error}
			</div>
		{/if}
	</form>
	<p class="text-xs text-center sm:px-6 dark:text-gray-400">Have an account?
		<a rel="noopener noreferrer" href="/login" class="underline dark:text-gray-100">Sign In</a>
	</p>
</div>
