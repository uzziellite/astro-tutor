<script>
	import {Directus} from "@directus/sdk"

	const directus = new Directus(import.meta.env.PUBLIC_CMS)
	let data
	let loading = false
	let error

	loading = true

	const load = async () =>  {
		await directus.items('tut_tutors').readByQuery({
			filter:{
				"status":{
					"_eq":"published"
				}
			},
			sort:'-times_hired',
			limit:4
		}).then(resp => {
			data = resp.data
		}).catch(err => {
			console.error(error)
			loading = false
			error = "Unable to load top tutors at the moment"
		})

	}

	load()
</script>

{#if data}
	{#each data as {first_name,last_name} }
		<div class="flex flex-col justify-center m-8 text-center p-2 shadow-md bg-gray-100 dark:bg-gray-900">
			<img alt="" class="self-center flex-shrink-0 w-20 h-20 mb-4 bg-center bg-cover rounded-full dark:bg-gray-500" src="/images/girl-writing.avif">
			<p class="text-xl font-semibold leading-tight">
				{first_name} {last_name}
			</p>
			<p class="dark:text-gray-400">
				Tutor
			</p>
		</div>
	{/each}
{/if}
