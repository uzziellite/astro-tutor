<svelte:head>
	<script>
		MathJax = {
		  tex: {
		    inlineMath: [['$', '$'], ['\\(', '\\)']]
		  },
		  svg: {
		    fontCache: 'global'
		  }
		}
	</script>
	<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
	<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</svelte:head>

<script>
	import { formatTime } from "@directives/utils.js"
	import {Directus} from "@directus/sdk"
	import {time} from "@store/store.js"
	import { onDestroy } from 'svelte'
	import {onMount} from "svelte"

	let error
	let answer
	let loading
	let question
	$:  answerBag = []
	let identifier
	let answerError
	let answers = []
	let answerLoading
	$:  answerBagIndex = []
	let questionIndex = 0
	let showExample = false
	let percentageScored = 0
	let answeredQuestions = 0
	const directus = new Directus(import.meta.env.PUBLIC_CMS)

	onMount(() => {
		const query = window.location.search
		const params = new URLSearchParams(query)
		identifier = params.get("identifier")
	})

	const loadQuestions = () => {
		loading = true
		directus.items('tut_sub_topics').readByQuery({
			filter:{
				"_and":[
					{
						"status":{
							"_eq":"published"
						}
					},
					{
						"id":{
							"_eq":identifier
						}
					}
				]
			},
			fields:['name,topic.name,tut_questions.answer_type,tut_questions.available_answers,tut_questions.notes,tut_questions.question,tut_questions.id']
		}).then(resp => {
			loading = false
			question = resp.data
		}).catch(err => {
			console.error(err)
			error = err
			loading = false
		})
	}

	const revealAnswer = (id) => {
		answerLoading = true
		directus.items('tut_sub_topics').readByQuery({
			filter:{
				"_and":[
					{
						"status":{
							"_eq":"published"
						}
					},
					{
						"tut_questions":{
							"id":{
								"_eq":id
							}
						}
					}
				]
			},
			fields:['tut_questions.correct_answer']
		}).then(resp => {
			answer = resp.data[0].tut_questions[0].correct_answer
			answerLoading = false
		}).catch(err => {
			console.error(err)
			answerError = err
			answerLoading = false
		})
	}

	$:{
		if(identifier && identifier.length >= 36){
			error = null
			loadQuestions()
		}else{
			if(identifier && identifier.length < 36){
				error = "Incorrect identifier."
			}else{
				error = "Missing identifier therefore no question loaded"
			}
		}
	}

	const updateQuestionIndex = () => {
		questionIndex += questionIndex
	}

	const chooseMultipleAnswer = (ans,index) => {
		//Not answered
		if(! answerBagIndex.includes(index)){
			answerBagIndex.push(index)
			answerBag.push(ans)
		}else{
			//Remove from answers
			const abi = answerBagIndex.indexOf(index)
			answerBagIndex.splice(abi,1)
			answerBag.splice(abi,1)
		}

	}

	const verifyAnswer = () => {

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

<!-- Header Portion of the app goes here -->
{#if question}
	<!-- Topic -->
	<h2 class="text-sky-600 text-2xl uppercase text-center">
		{question[0].topic.name}
	</h2>
	<!-- Breadcrumb to show Grade and current topic -->
	<nav aria-label="Breadcrumb" class="hidden sm:block">
	  <ol role="list" class="mt-4 flex items-center gap-1 text-sm text-gray-500">
	    <li>
	      <a href="/assesment" class="block transition-colors hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-200">
	        <span class="sr-only">Home</span>
	        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
	      </a>
	    </li>
	    <li>
	      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
	    </li>
	    <li>
	    	<a class="block transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
	        {question[0].topic.name}
	      </a>
	    </li>
	    <li>
	      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
	    </li>
	    <li>
	    	<a class="block transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
	        {question[0].name}
	      </a>
	    </li>
	  </ol>
	</nav>
	<!-- Learn with an example -->
	<div class="my-2 grid place-items-center">
		<a class="cursor-pointer hover:underline flex space-x-2 text-center text-sky-500" on:click|preventDefault={() => showExample = ! showExample}>
			{showExample ? 'Back to question' : 'Learn with an example'}
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
		</a>
	</div>
	<!-- Questions layout configuration -->
	<div class="my-4 grid md:grid-cols-4 gap-2">
		<!-- Questions and answers tab -->
		<div class="sm:col-span-3 p-2 bg-gray-200 dark:bg-gray-900 shadow-md rounded-lg">
			{#if showExample}
				<!-- Show an example to the student -->
				<h2 class="text-lg sm:text-2xl capitalize">
					Example
				</h2>
				<div class="prose prose-lg dark:prose-invert">
					{@html question[0].tut_questions[questionIndex].notes}
				</div>
			{:else}
				<!-- Show a question to the student -->
				<h2 class="text-lg sm:text-2xl capitalize">
					Question
				</h2>
				<div class="prose prose-lg dark:prose-invert">
					{@html question[0].tut_questions[questionIndex].question}
				</div>
				<!-- Student selects answer(s) here -->
				{#if question[0].tut_questions[questionIndex].answer_type[0] === 'input'}
					<div class="grid my-2">
						<input type="text" class="p-2 bg-gray-200 dark:bg-gray-900 border border-current">
					</div>
				{:else if question[0].tut_questions[questionIndex].answer_type[0] === 'fraction'}
					<div class="grid my-2">
						<input type="text">&frasl;<input type="text">
					</div>
				{:else if question[0].tut_questions[questionIndex].answer_type[0] === 'select_multiple'}
					<div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 my-4">
						{#each question[0].tut_questions[questionIndex].available_answers as q,i}
							<div class={`bg-gray-200 dark:bg-gray-900 rounded p-2 border border-current cursor-pointer`} on:click={() => chooseMultipleAnswer(q,i)}>
								{@html q}
							</div>
						{/each}
					</div>
				{/if}
				<button class="mt-4 inline-block px-12 py-3 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded active:text-indigo-500 focus:outline-none focus:ring" on:click={() => submitAnswer()}>
				  Submit
				</button>
			{/if}
		</div>
		<!-- Question assesment criteria -->
		<div class="p-2 bg-gray-200 dark:bg-gray-900 shadow-md rounded-lg">
			<div class="grid sm:place-items-center sm:place-content-center">
				<!-- Total Questions -->
				<div class="my-2">
					<h2 class="text-sky-600 text-lg text-center">
						Total Questions
					</h2>
					<p class="text-center font-black uppercase text-2xl">
						{question[0].tut_questions.length}
					</p>
				</div>
				<!-- Answered Questions -->
				<div class="my-2">
					<h2 class="text-sky-600 text-lg text-center">
						Answered Questions
					</h2>
					<p class="text-center font-black uppercase text-2xl">
						{answeredQuestions}
					</p>
				</div>
				<!-- Time lapsed -->
				<div class="my-2">
					<h2 class="text-sky-600 text-lg text-center">
						Time lapsed
					</h2>
					<p class="text-center font-black uppercase text-2xl">
						{formatTime($time)}
					</p>
				</div>
				<!-- Score -->
				<div class="my-2">
					<h2 class="text-sky-600 text-lg text-center">
						Smart Score
					</h2>
					<p class="text-center font-black uppercase text-2xl">
						{percentageScored}%
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}
