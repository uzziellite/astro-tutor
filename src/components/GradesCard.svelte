<script>
	//import {activeAssesmentTab} from "@store/store.js"
	import {Directus} from "@directus/sdk"
	import {onMount} from "svelte"

	const directus = new Directus(import.meta.env.PUBLIC_CMS)

	//Since activeAssesmentTab returns an array index 
	//We need to know what it represents
	//To load the data accordingly
	//const codeInterpreter = ['Mathematics','Humanities','']

	let loading
	let error
	let active
	let grades
	let curriculum

	const loadGrades = async () => {
		loading = true
		await directus.items('tut_grades').readByQuery({
			filter:{
				"_and": [
					{
						"status":{
							"_eq":"published"
						}
					},
					{
						"curriculum":{
							"slug":{
								"_eq": curriculum
							}
						}
					}
				]
			},
			sort:"sorter"
		}).then(resp => {
			grades = resp.data
			loading = false
		}).catch(err => {
			console.error(err)
			error = err
			loading = false
		})
	}

	onMount(() => {
		curriculum = window.location.search.substr(12)
		loadGrades()
	})


	//Find current active tab and load data
	/*$: {
		
		activeAssesmentTab.subscribe(value => active = value )

	}*/
</script>

<div class={`grid place-content-center place-items-center ${error | loading ? 'h-[20rem]' : ''}`}>
	{#if loading}
			<svg class="animate-spin -ml-1 mr-3 h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
	      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
	      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	    </svg>
	    <span class="text-lg">Loading data</span>
	{:else}
		{#if error}
			<div class="text-red-600 text-lg">
				{error}		
			</div>
		{/if}
	{/if}
</div>

{#if grades}
	{#each grades as {grade,description,slug} }
		<a href={`/assesment/select-subject?curriculum=${curriculum}&grade=${slug}`} class="bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md">
		  <div class="flex items-start p-6">
		    <!--<div class="block shrink-0 hidden sm:flex">
		      <img
		        alt="Speaker"
		        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
		        class="object-cover rounded-lg h-14 w-14"
		      />
		    </div>-->
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
		    <strong
		      class="-mr-[2px] -mb-[2px] inline-flex items-center gap-1 rounded-tl-xl rounded-br-xl bg-green-600 py-1.5 px-3 text-white"
		    >
		      <svg
		        xmlns="http://www.w3.org/2000/svg"
		        class="w-4 h-4"
		        fill="none"
		        viewBox="0 0 24 24"
		        stroke="currentColor"
		        stroke-width="2"
		      >
		        <path
		          stroke-linecap="round"
		          stroke-linejoin="round"
		          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
		        />
		      </svg>

		      <span class="text-[10px] font-medium sm:text-xs">
		      	{grade}
		      </span>
		    </strong>
		  </div>
		</a>
	{/each}
{/if}
