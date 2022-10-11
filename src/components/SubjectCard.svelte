<script>
	import {Directus} from "@directus/sdk"
	import {onMount} from "svelte"
	import {activeAssesmentTab} from "@store/store.js"

	let error
	let subjects
	let grade
	let curriculum
	let broadCategory
	let loading
	const directus = new Directus(import.meta.env.PUBLIC_CMS)

	//Call when mounted
	onMount(() => {
		const query = window.location.search
		const params = new URLSearchParams(query)
		curriculum = params.get("curriculum")
		grade = params.get("grade")
	})

	//Subsequent calls
	$: {
		activeAssesmentTab.subscribe(value => {
	  	const tabNames = [
				"Mathematics",
				"Humanities",
				"Sciences",
				"Social Studies",
				"Languages"
			]

			broadCategory = tabNames[value]
	  })

		loading = true
		error = false
		
		if(curriculum && grade){
			directus.items("tut_subjects").readByQuery({
				filter:{
					"_and":[
						{
							"status":{
								"_eq":"published"
							}
						},
						{
							"grade":{
								"slug":{
									"_eq":grade
								}
							}
						},
						{
							"grade":{
								"curriculum":{
									"slug":{
										"_eq":curriculum
									}
								}
							}
						},
						{
							"broad_category":{
								"name":{
									"_eq": broadCategory
								}
							}
						}
					]
				},
				limit:-1
			}).then(resp => {
				subjects = resp.data
				loading = false
			}).catch(err => {
				console.error = err
				error = err
				loading = false
			})
		}
	}
</script>

<div class={`grid place-content-center place-items-center ${error | loading ? 'h-[16rem]' : ''}`}>
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

{#if subjects && ! loading && subjects[0]}
	{#each subjects as {name,slug} }
		<a href={`/assesment/stages-description?curriculum=${curriculum}&grade=${grade}&subject=${slug}`} class="bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md">
		  <div class="flex items-start p-6">
		    <div class="ml-4">
		      <strong class="font-medium text-lg">
		        <span class="hover:underline text-gray-900 dark:text-white">
		          {name}
		        </span>
		      </strong>

		      <!--<p class="text-sm text-gray-700 line-clamp-2 dark:text-gray-100">
		        
		      </p>-->
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
		      	{name}
		      </span>
		    </strong>
		  </div>
		</a>
	{/each}
	{:else}
		{#if !loading}
			<p class="text-center text-red-600">
				Sorry, there are no subjects available at the moment
			</p>
		{/if}
{/if}
