<script>
	import {onMount} from "svelte"
	import {Directus} from "@directus/sdk"
	import axios from "axios"

	let error
	let grade
	let topics
	let subject
	let loading
	let curriculum
	const directus = new Directus(import.meta.env.PUBLIC_CMS)

	onMount(() => {
		const query = window.location.search
		const params = new URLSearchParams(query)
		const path = `${window.location.pathname}${window.location.search}`
		localStorage.removeItem('topic_path')
		subject = params.get("subject")
		grade = params.get("grade")
		curriculum = params.get("curriculum")
		localStorage.setItem('topic_path',path)
	})

	$: {
		if(curriculum && grade && subject){
			loading = true
			directus.items('tut_topics').readByQuery({
				filter:{
					"_and":[
						{
							"status":{
								"_eq":"published"
							}
						},
						{
							"subject":{
								"slug":{
									"_eq":subject
								}
							}
						},
						{
							"subject":{
								"grade":{
									"slug":{
										"_eq":grade
									}
								}
							}
						},
						{
							"subject":{
								"grade":{
									"curriculum":{
										"slug":{
											"_eq":curriculum
										}
									}
								}
							}
						}
					]
				},
				limit:-1,
				fields:['name,tut_sub_topics.name,tut_sub_topics.id'],
				sort:"date_created",
				deep:{
					"tut_sub_topics":{
						"_sort":"date_created"
					}
				}
			}).then(resp => {
				topics = resp.data
				loading = false
			}).catch(err => {
				console.error(err)
				error = err
				loading = false
			})
		}
	}

	const determineProgress = () => {
		axios.get().then().catch()
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

{#if topics && ! loading && topics[0]}
	<div class="grid sm:grid-cols-2 gap-4 sm:mb-12">
		{#each topics as {name,tut_sub_topics} }
			<div class="mt-2 bg-gray-200 dark:bg-gray-900 p-4 rounded-md shadow-md">
				<h2 class="text-sky-600 uppercase">
					{name} <span class="text-black dark:text-white text-xs ml-4">
						<!--TODO Make progress dynamic-->
						Progress 0%
					</span>
				</h2>
				{#each tut_sub_topics as {name,id}, count}
					<a class="block mt-2 hover:underline" href={`/assesment/topical?identifier=${id}`}>
						{count + 1} {name}
					</a>
				{/each}
			</div>
		{/each}
	</div>
{:else}
	{#if ! loading}
		<p class="text-center text-red-600 my-[16rem]">
			Sorry, there are no topics for the subject available for this grade at the moment. We will be adding them soon
		</p>
	{/if}
{/if}
