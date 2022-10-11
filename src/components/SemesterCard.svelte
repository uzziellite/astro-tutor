<script>
	import {onMount} from "svelte"
	import {Directus} from "@directus/sdk"

	let query
	let subject
	let semesters
	let grade
	const directus = new Directus(import.meta.env.PUBLIC_CMS)

	const loadSemesters = () => {
		directus.items('tut_semesters').readByQuery({
			filter:{
				"_and":[
					{
						"status":{
							"_eq":"published"
						}
					}
				]
			}
		}).then(resp => {
			semesters = resp.data
		}).catch(error => {
			console.error(error)
		})
	}

	onMount(() => {
		query = window.location.search
		const params = new URLSearchParams(query)
		subject = params.get("subject").split('-').join(' ')
		//loadSemesters()
	})
</script>

{#if semesters}
	{#each semesters as {grade,description,slug} }
		<a href={`/assesment/select-subject?curriculum=${curriculum}&grade=${slug}`} class="bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md">
		  <div class="flex items-start p-6">
		    <div class="ml-4">
		      <strong class="font-medium text-lg">
		        <span class="hover:underline text-gray-900 dark:text-white">
		          {grade}
		        </span>
		      </strong>

		      <p class="text-sm text-gray-700 line-clamp-2 dark:text-gray-100">
		        {description}
		      </p>
		    </div>
		  </div>

		  <div class="flex justify-end">
		    <strong class="-mr-[2px] -mb-[2px] inline-flex items-center gap-1 rounded-tl-xl rounded-br-xl bg-green-600 py-1.5 px-3 text-white">
		      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
		      </svg>
		      <span class="text-[10px] font-medium sm:text-xs">
		      	{grade}
		      </span>
		    </strong>
		  </div>
		</a>
	{/each}
{/if}
