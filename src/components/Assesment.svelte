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
	import {onDestroy} from 'svelte'
	import {onMount} from "svelte"
	import axios from "axios"

	let error
	let answer
	let loading
	let isWrong
	let question
	let isCorrect
	let topicPath
	let completed
	let identifier
	let answerError
	let unsubscribe
	let answers = []
	let currentTimer
	let singleAnswer
	let answerLoading
	$:  answerBag = []
	let answeredCorrect = 0
	let questionIndex = 0
	$:  answerBagIndex = []
	let showExample = false
	let percentageScored = 0
	let answeredQuestions = 0
	let submissionError = false
	const directus = new Directus(import.meta.env.PUBLIC_CMS)

	unsubscribe = time.subscribe(value => {
		currentTimer = value
	})

	onMount(() => {
		const query = window.location.search
		const params = new URLSearchParams(query)
		identifier = params.get("identifier")
		topicPath = localStorage.getItem('topic_path')
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
			fields:['name,topic.name,tut_questions.answer_type,tut_questions.available_answers,tut_questions.notes,tut_questions.question,tut_questions.correct_answer,tut_questions.id'],
			deep:{
				"tut_questions":{
					"_sort":"date_created"
				}
			}
		}).then(resp => {
			loading = false
			question = resp.data
		}).catch(err => {
			console.error(err)
			error = err
			loading = false
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
				if(typeof window != 'undefined') error = "Missing identifier therefore no question loaded"
			}
		}
	}

	const updateQuestionIndex = () => {
		questionIndex += questionIndex
	}

	//Clear answer bags upon submission of answers
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

	//Clear answer bags upon submission of answers
	const chooseSingleAnswer = (ans,index) => {
		//Not answered
		if(answerBag.length < 1){
			answerBag.push(ans)
		}else{
			answerBag = []
			answerBag.push(ans)
		}
	}

	const verifyAnswer = () => {
		const timeTaken = currentTimer / 1000
		terminateTimer()

		if(singleAnswer){
			answerBag.push(singleAnswer)
		}

		if(! answerBag[0] ){
			submissionError = true
			error = "Please input an answer before attempting to submit"
		}else{
			//Load the answer
			const correct_answer = question[0].tut_questions[questionIndex].correct_answer
			//Begin Marking
			confirmAnswer(correct_answer,timeTaken)
		}
	}

	//Confirm student answer
	const confirmAnswer = (ans,time) => {
		//Remove any whitespaces
		const cleanedAns = ans.replace(/\s+/g, '')
		
		if(answerBag.length === 1){
		//For input and single select
			if(answerBag[0] == ans){
				isCorrect = true
				answeredCorrect += 1
				recordResult(true,time)
			}else{
				isWrong = true
				recordResult(false,time)
			}
		}else if(answerBag.length > 1){
			//For multiple select
			const sortedAnswers = answerBag.sort()
			const answerArr = cleanedAns.split(',').sort()

			if(sortedAnswers.length === answerArr.length && sortedAnswers.every((value, index) => value === answerArr[index])){
				isCorrect = true
				recordResult(true,time)
			}else{
				isWrong = true
				recordResult(false,time)
			}

		}else{
			//for fractions
		}
	}

	//Save what the student has scored in the database
	const saveScoreToDatabase = (correct,time) => {
		//User is authenticated
		if(localStorage.getItem('_lxc')){
			const id = question[0].tut_questions[questionIndex].id
			const lxc = localStorage.getItem('_lxc')
			
			axios.post(`${import.meta.env.PUBLIC_INVITE_URL}api/student-data`,{
				id,
				lxc,
				correct,
				time
			}).then(() => {
				console.log('Answer saved')
			}).catch(err => {
				console.error(err)
			})

		}else{
			window.location.href = '/login'
		}
	}

	//Record what the student scored
	const recordResult = (correct,time) => {
		//Save result to the database
		saveScoreToDatabase(correct,time)
		//Move to the next question
		if(questionIndex < question[0].tut_questions.length - 1){
			answeredQuestions += 1
			questionIndex += 1
			removeMarkingAlert(correct)
		}else{
			answeredQuestions += 1
			removeMarkingAlert(correct)
			completed = true
		}
	}

	const resetToDefault = () => {
		//Reset variables to default
		answerBag = []
		answerBagIndex = []
		error = null

		//Only reset when the student has not answered all the questions
		if(answeredQuestions < question[0].tut_questions.length){
			unsubscribe = time.subscribe(value => {
				currentTimer = value
			})
		}
	}

	//Give student four seconds break to breath
	const removeMarkingAlert = (correct) => {
		//Remove alert after 4 seconds
		setTimeout(() => {
			if(correct){
				isCorrect = null
			}else{
				isWrong = null
			}

			resetToDefault()
		},4000)
	}

	//Terminate timer
	const terminateTimer = () => {
		unsubscribe()
		unsubscribe = null
		currentTimer = 0
	}

	//Handle timer or reset to default
	const handleTimer = () => {
		showExample = ! showExample
		
		if(showExample){
			terminateTimer()
		}else{
			unsubscribe = time.subscribe(value => {
				currentTimer = value
			})
		}
	}

	//Restart submission if a new value has emerged
	const restartSubmission = () => {
		submissionError = ! submissionError

		unsubscribe = time.subscribe(value => {
			currentTimer = value
		})
	}

	//Determine Percentage scored
	$:{
		if(question){
			percentageScored = Math.floor(( answeredCorrect / question[0].tut_questions.length ) * 100 )
		}
	}

	onDestroy(() => {
    terminateTimer()
  })
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
	    	<a href={topicPath} class="block transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
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
		<a class="cursor-pointer hover:underline flex space-x-2 text-center text-sky-500" on:click|preventDefault={() => handleTimer()}>
			{showExample ? 'Back to question' : 'Learn with an example'}
			{#if showExample}
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
			{:else}
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
			{/if}
		</a>
	</div>
	<!-- Questions layout configuration -->
	<div class={`my-4 grid ${showExample ? '' : 'md:grid-cols-4'} gap-2`}>
		<!-- Questions and answers tab -->
		<div class={`${showExample ? '' : 'sm:col-span-3'} p-2 bg-gray-200 dark:bg-gray-900 shadow-md rounded-lg`}>
			{#if showExample}
				<!-- Show an example to the student -->
				<h2 class="text-xl sm:text-2xl capitalize text-center uppercase underline mb-4">
					Example
				</h2>
				<div class="grid place-items-center place-content-center">
					<div class="prose prose-lg dark:prose-invert sm:p-4">
						{@html question[0].tut_questions[questionIndex].notes}
					</div>
				</div>
			{:else}
				<!-- Show a question to the student -->
				<h2 class="text-xl sm:text-2xl capitalize text-center uppercase underline mb-4">
					Question
				</h2>
				<div class="prose prose-lg dark:prose-invert">
					{@html question[0].tut_questions[questionIndex].question}
				</div>

				<!-- Student selects answer(s) here -->
				{#if question[0].tut_questions[questionIndex].answer_type[0] === 'input'}
					<div class="my-2">
						<input type="text" class="p-2 bg-gray-200 dark:bg-gray-900 border border-current" bind:value={singleAnswer} placeholder="Type in your answer">
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
				{:else if question[0].tut_questions[questionIndex].answer_type[0] === 'select'}
					<div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 my-4">
						{#each question[0].tut_questions[questionIndex].available_answers as q,i}
							<button class={`bg-gray-200 dark:bg-gray-900 rounded p-2 border border-current cursor-pointer active:border-sky-600`} on:click={() => chooseSingleAnswer(q,i)}>
								{@html q}
							</button>
						{/each}
					</div>
				{/if}
				<!-- End Student answer selection -->
				
				<!-- Chosen Answer -->
				{#if answerBag[0]}
					<div class="mt-4 flex flex-col">
						<span class="text-sky-600">
							Chosen answer
						</span>
						{answerBag}
					</div>
				{/if}
				{#if singleAnswer}
					<div class="mt-4 flex flex-col">
						<span class="text-sky-600">
							Written Answer
						</span>
						{singleAnswer}
					</div>
				{/if}
				<!-- End chosen answers -->
				{#if !completed}
					<button class="mt-4 inline-block px-12 py-3 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded active:text-indigo-500 focus:outline-none focus:ring" on:click={() => verifyAnswer()}>
						{#if answerLoading}
							Submitting <span class="animate-ping">...</span>
						{:else}
							Submit
						{/if}
					</button>
				{/if}
			{/if}
		</div>

		<!-- Hide panel when showing example -->
		{#if !showExample}
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
							{formatTime(currentTimer)}
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
		{/if}
	</div>
	{#if completed}
		<div class="grid p-4 my-4 bg-gray-200 dark:bg-gray-900 rounded-md">
			<h2 class="text-green-600 text-2xl text-center">
				Congratulations
			</h2>
			<p class="text-lg mt-2">
				You have completed this module. You can check other modules to continue boosting your skills. Please take note that your performance report and recommendations will be available once you have completed an entire topic for your grade.
			</p>
			<a href={topicPath} class="mt-2 block underline">
        Back to all topics
      </a>
		</div>
	{/if}
{/if}

{#if submissionError}
	<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <!-- Heroicon name: outline/exclamation-triangle -->
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-red-600 uppercase" id="modal-title">
                	Errors detected!
                </h3>
                <div class="mt-2">
                  <p class="text-sm">
                  	{error}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button class="inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm" on:click={() => restartSubmission()}>
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Correct answer given -->
{#if isCorrect}
	<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <!-- Heroicon name: outline/check -->
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-green-600 uppercase" id="modal-title">
                	Awesome!
                </h3>
                <div class="mt-2">
                  <p class="text-sm">
                  	That was correct
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
{#if isWrong}
	<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <!-- Heroicon name: outline/exclamation-triangle -->
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-red-600 uppercase" id="modal-title">
                	Oooops, Ouch, Nooo!
                </h3>
                <div class="mt-2">
                  <p class="text-sm">
                  	You did not get that right. Make sure to check examples if you are not sure on how to solve the problem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
