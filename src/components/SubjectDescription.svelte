<script>
	import {onMount} from "svelte"

	let subject
	let query

	onMount(() => {
		query = window.location.search
		const params = new URLSearchParams(query)
		subject = params.get("subject").split('-').join(' ')
	})
</script>

<section class="container mx-auto px-4 py-6 my-36">
	<h1 class="text-3xl sm:text-4xl font-black sm:text-center text-sky-600">
		Learning Stages
	</h1>
	<p class="mt-4 text-lg text-center">
		Thank you for choosing your subject of choice. Please go through the information below to decide how you want to learn
	</p>
	<div class="flex flex-wrap -m-4 mt-2">
    <div class="p-4 sm:w-1/2 w-full">
      <div class="h-full bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-md">
      	<h2 class="font-extrabold text-center text-xl">
      		Revise course work
      	</h2>
      	<p class="text-gray-800 dark:text-white mt-2">
      		Our personalized revision for <span class="capitalize">{subject}</span> comes with enough examples and problem description to help you grasp the subject. The beauty of it is that you study at your own pace on your own time.
      	</p>
				<a class="inline-block px-8 py-3 text-sm font-medium text-white bg-indigo-600 rounded transition hover:scale-110 hover:shadow-xl active:bg-indigo-500 focus:outline-none focus:ring mt-4" href={`/assesment/select-topic${query}&revision=true`}>
				  Start Revision
				</a>
      </div>
    </div>
    <div class="p-4 sm:w-1/2 w-full">
      <div class="h-full bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-md">
      	<h2 class="font-extrabold text-center text-xl">
      		Take Assesment
      	</h2>
      	<p class="text-gray-800 dark:text-white mt-2">
      		Check your level of understanding in <span class="capitalize">{subject}</span>. It will help you confirm the level of subject mastery. There are three levels of assesment but if you manage to score above 80% on the first assesment, you can proceed to the next phase without further assesment. The assesment is categorized in accordance to term work classification
      	</p>
				<a class="inline-block px-8 py-3 text-sm font-medium text-white bg-indigo-600 rounded transition hover:scale-110 hover:shadow-xl active:bg-indigo-500 focus:outline-none focus:ring mt-4" href={`/assesment/select-semester${query}&assesment=true`}>
				  Start Assesment
				</a>
      </div>
    </div>
  </div>
</section>
