<script>
  import { onMount} from 'svelte'
  import {Directus} from '@directus/sdk'

  // Check if the user is logged in and eliminate the last portion
  //of the form
  const directus = new Directus(import.meta.env.PUBLIC_CMS)

  let step = 0
  const minDate = new Date().toJSON().substr(0,10)
  let submitting = false

  //Hold form data for verification
  let data = {
    kids:{
      kids_count: 0
    },
    meeting_preference: "Online",
    tutor_gender: "Any",
    specific_goals: "Improve grades",
    curriculum: "British",
    level:{},
    subjects:{},
    user:{},
    schedule:{
      days:{},
      lesson:{}
    }
  }

  const loadUserData = async () => {
    let data
    
    try{

      data = await directus.users.me.read({
        fields:['first_name,last_name,phone_number,email,address,location']
      })


    }catch(err){
      console.error(err.response.errors[0].message)
    }

    return data
  }

  //curriculum of choice if any
  onMount(async () => {
    const curriculum = window.location.search.substr(12)
    
    if(curriculum.length > 0){
      switch(curriculum){
        case "american":
          data.curriculum = "American"
          break;
        case "british":
          data.curriculum = "British"
          break;
        case "igcse":
          data.curriculum = "IGCSE"
          break;
        case "8-4-4":
          data.curriculum = "8-4-4"
          break;
        default:
          data.curriculum = "CBC"
      }
    }

    const info = await loadUserData()
    
    data.user.email = info.email
    data.user.first_name = info.first_name
    data.user.last_name = info.last_name
    data.user.phone = info.phone_number
    data.user.address = info.address
    data.user.county = info.location

    console.log(info)
  })

  //Scroll to the top when step changes
  $: {
    console.log(`Currently doing step: ${step + 1}`)
    if (typeof window !== 'undefined') {
      window.scrollTo(0,100)
    }
  }

  //Step details information
  const step_details = [
    {
      "message": "Please provide the information that will help us to understand what kind of a tutor you need",
      "title": "Preliminary information"
    },
    {
      "message": "Please provide your location details",
      "title": "Address details"
    },
    {
      "message": "Help us to understand your intended lesson schedule",
      "title": "Lesson schedule"
    }
  ]

  let error_bag = {}

  //Verify the data and setup form logic
  $: {
    if(step === 1){
      
      error_bag = {}

      if(!data.who){
        step = 0
        error_bag.who = "This lesson is meant for who?"
      }

      if(Object.entries(data.level).length < 1){
        step = 0
        error_bag.level = "What level is this for"
      }

      if(Object.entries(data.subjects).length < 1){
        if(data.level.nursery || data.level.lower_primary || data.level.junior_secondary || data.level.upper_primary || data.level.senior_secondary){
          step = 0
          error_bag.subject = "Please select subjects or nursery school level"
        }
      }
    }

    if(step === 2){

      error_bag = {}
      
      if(!data.user.first_name){
        step = 1
        error_bag.first_name = "Please enter your first name"
      }

      if(!data.user.last_name){
        step = 1
        error_bag.last_name = "Please enter your last name"
      }

      if(!data.user.email){
        step = 1
        error_bag.email = "Please enter your email address"
      }else{
        //Add Regex to verify email

      }


      if(!data.user.phone){
        step = 1
        error_bag.phone = "Please enter your phone number"
      }else{
        //TODO
        //Enter regex code to filter phone numbers
      }

      if(!data.user.address){
        step = 1
        error_bag.address = "Please select your address"
      }
    }
  }

  //Submit form data
  const requestTutor = async () => {
    //Verify the last step before submission
    if(step === 2){
      //step = 2
      error_bag = {}

      if(Object.entries(data.schedule.days).length < 1){
        error_bag.days = "Please select at least a day of the week to hold lessons"
      }

      if(!data.schedule.lesson.starting_date){
        error_bag.starting_date = "Please select a date when the lessons should start"
      }

      if(!data.schedule.lesson.starting_time){
        error_bag.starting_time = "Please select a time when the lessons should start"
      }
    }

    //Begin submission
    if(Object.entries(error_bag).length === 0){
      try{

        submitting = true

        await directus.items('tut_tutor_requests').createOne({
          who_needs_tutor: data.who,
          owner: data.user,
          curriculum: data.curriculum,
          meeting_preference: data.meeting_preference,
          tutor_gender: data.tutor_gender,
          specific_goals: data.specific_goals,
          lesson_duration: data.schedule.lesson.duration,
          lesson_hours_per_day: data.schedule.lesson.hours_per_day,
          lesson_starting_date: data.schedule.lesson.starting_date,
          lesson_starting_time: data.schedule.lesson.starting_time,
          lesson_days: data.schedule.days,
          number_of_children_to_teach: data.kids.kids_count,
          level: data.level,
          subjects: data.subjects
        })

        step = 3
      }catch(err){
        submitting = false
        error_bag.submission_error = err
        console.error(err)
      }
    }
  }

</script>

<div class="container mx-auto p-4">
	<h1 class="text-3xl sm:text-4xl font-black sm:text-center">
		Find a tutor
	</h1>
	<p class="mt-4 text-lg text-center">
		We have qualified tutors who are willing and able to teach with zeal
	</p>
  <h2 class="sr-only">Steps</h2>
  <div
    class="after:w-full after:h-1 after:mt-4 after:block after:rounded-lg after:bg-gray-200"
  >
    <ol class="text-sm font-medium text-gray-500 grid grid-cols-3">
      <li class="relative text-left">

        {#if step > 0}
          <span
            class="bg-blue-600 left-0 -bottom-[1.75rem] absolute rounded-full text-white"
          >
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        {/if}

        <span class="hidden sm:block"> Details </span>

        <svg
          class="w-6 h-6 ml-0 sm:hidden"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
          />
        </svg>
      </li>

      <li class="relative text-center">

        {#if step > 1}
          <span
            class="bg-blue-600 left-1/2 -translate-x-1/2 -bottom-[1.75rem] absolute rounded-full text-white"
          >
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        {/if}

        <span class="hidden sm:block"> Address </span>

        <svg
          class="w-6 h-6 mx-auto sm:hidden"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </li>

      <li class="relative text-right">
        {#if step > 2}
          <span
            class="bg-blue-600 right-0 -bottom-[1.75rem] absolute rounded-full text-white"
          >
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        {/if}

        <span class="hidden sm:block"> Schedule </span>

        <svg
          class="w-6 h-6 ml-auto sm:hidden"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </li>
    </ol>
  </div>
</div>
{#if step < 3}
  <section class="container mx-auto p-4">
  	<div class="mt-10 sm:mt-0">
  	  <div class="md:grid md:grid-cols-3 md:gap-6">
  	    <div class="md:col-span-1">
  	      <div class="px-4">
            <!-- Make it dynamic depending on active form being filled-->
  	        <h3 class="text-lg font-medium leading-6">
  	        	{ step_details[step].title }
  	        </h3>
  	        <p class="mt-1 text-sm">
  	        	{ step_details[step].message }
  	        </p>
  	      </div>
  	    </div>
  	    <div class="mt-5 md:col-span-2 md:mt-0">
  	      <form on:submit|preventDefault>
  	        <div class="overflow-hidden shadow-lg sm:rounded-md bg-gray-100 dark:bg-gray-900">
  	          <div class="space-y-6 px-4 py-5 sm:p-6">
                {#if step === 0}
    	            <fieldset>
    	              <legend class="sr-only">Who needs tutoring?</legend>
    	              <div class="text-sm font-bold" aria-hidden="true">Who needs tutoring?</div>
    	              <div class="mt-4 space-y-4">
    	                <div class="flex items-start">
    	                  <div class="flex h-5 items-center">
    	                    <input id="kids" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.who} value="kids">
    	                  </div>
    	                  <div class="ml-3 text-sm">
    	                    <label for="kids" class="font-medium">My Kid(s)</label>
    	                    <p class="text-gray-600">
                           My children need to be tutored
                          </p>
    	                  </div>
    	                </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="self" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.who} value="self">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="self" class="font-medium">My self</label>
                          <p class="text-gray-600">
                           I am the one in need of tutoring 
                          </p>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="else" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.who} value="another">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="else" class="font-medium">Someone Else</label>
                          <p class="text-gray-600">
                           I need a tutor for someone else
                          </p>
                        </div>
                      </div>
    	              </div>
                    {#if error_bag.who}
                      <div class="flex items-start text-red-500 text-xs">
                        {error_bag.who}
                      </div>
                    {/if}
    	            </fieldset>
                  {#if data.who == 'kids'}
                    <fieldset>
                      <legend class="sr-only">How many Kids need lessons?</legend>
                      <div class="text-sm font-bold" aria-hidden="true">How many kids need lessons?</div>
                      <div class="mt-4 space-y-4">
                        <input id="kids_count" type="range" class="h-4 w-full rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" min="0" max="6" bind:value={data.kids.kids_count}>
                      </div>
                      <div class="text-center text-lg">
                        {data.kids.kids_count}
                      </div>
                    </fieldset>
                  {/if}
                  {#if data.who == 'self' || data.who == 'another'}
                    <fieldset>
                      <legend class="sr-only">What level is this for?</legend>
                      <div class="text-sm font-bold" aria-hidden="true">What level is this for?</div>
                      <div class="mt-4 grid grid-cols-2 gap-6">
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.lower_primary}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="" class="font-medium">Lower Primary</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.junior_secondary}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="" class="font-medium">Junior Secondary</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.exams_prep}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="" class="font-medium">Exams Prep</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.language}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="" class="font-medium">Language(s)</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.adult_learning}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="" class="font-medium">Adult Learning</label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.upper_primary}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="" class="font-medium">Upper Primary</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.senior_secondary}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="" class="font-medium">Senior Secondary</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.tertiary}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="" class="font-medium">Tertiary</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.skills}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="" class="font-medium">Skills</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.other}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="" class="font-medium">Other</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    {#if error_bag.level}
                      <div class="flex items-start text-red-500 text-xs">
                        {error_bag.level}
                      </div>
                    {/if}
                  {/if}
                  {#if data.who == 'kids'}
                    <fieldset>
                      <legend class="sr-only">What level is this for?</legend>
                      <div class="text-sm font-bold" aria-hidden="true">What level is this for?</div>
                      <div class="mt-4 grid grid-cols-2 gap-6">
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="nursery" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.nursery}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="nursery" class="font-medium">Nursery</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="upperP" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.upper_primary}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="upperP" class="font-medium">Upper Primary</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="seniorS" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.senior_secondary}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="seniorS" class="font-medium">Senior Secondary</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="adultL" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.adult_learning}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="adultL" class="font-medium">Adult Learning</label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="lowerP" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.lower_primary}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="lowerP" class="font-medium">Lower Primary</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="juniorS" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.junior_secondary}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="juniorS" class="font-medium">Junior Secondary</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="tertiary" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.level.tertiary}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="tertiary" class="font-medium">Tertiary</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    {#if error_bag.level}
                      <div class="flex items-start text-red-500 text-xs">
                        {error_bag.level}
                      </div>
                    {/if}
                  {/if}
                  {#if data.level.nursery}
                    <fieldset>
                      <legend class="sr-only">Which nursery school level?</legend>
                      <div class="text-sm font-bold" aria-hidden="true">Which nursery school level?</div>
                      <div class="mt-4 space-y-4">
                        <div class="flex items-start">
                          <div class="flex h-5 items-center">
                            <input id="preN" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.pre_nursery}>
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="preN" class="font-medium">Pre Nursery</label>
                          </div>
                        </div>
                        <div class="flex items-start">
                          <div class="flex h-5 items-center">
                            <input id="n1" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.nursery_1}>
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="n1" class="font-medium">Nursery 1</label>
                          </div>
                        </div>
                        <div class="flex items-start">
                          <div class="flex h-5 items-center">
                            <input id="n2" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.nursery_2}>
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="n2" class="font-medium">Nursery 2</label>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  {/if}
                  {#if data.level.lower_primary}
                    <fieldset>
                      <legend class="sr-only">Lower Primary subjects?</legend>
                      <div class="text-sm font-bold" aria-hidden="true">Lower Primary Subjects?</div>
                      <div class="mt-4 grid grid-cols-2 gap-6">
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="lpMath" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.lower_primary_mathematics}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="lpMath" class="font-medium">Mathematics</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="lpBasicScience"  type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.lower_primary_basic_sciences}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="lpBasicScience" class="font-medium">Basic Sciences</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="lpQuantitative"  type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.lower_primary_quantitative}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="lpQuantitative" class="font-medium">Quantitative</label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="lpEnglish" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.lower_primary_english}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="lpEnglish" class="font-medium">English</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="lpVerbal" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.lower_primary_verbal}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="lpVerbal" class="font-medium">Verbal</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="lpOther" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.lower_primary_other}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="lpOther" class="font-medium">Other</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  {/if}
                  {#if data.level.upper_primary}
                    <fieldset>
                      <legend class="sr-only">Upper primary subjects?</legend>
                      <div class="text-sm font-bold" aria-hidden="true">Upper Primary subjects?</div>
                      <div class="mt-4 grid grid-cols-2 gap-6">
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="upMathematics" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.upper_primary_mathematics}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="upMathematics" class="font-medium">Mathematics</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="upBasicSciences" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.upper_primary_basic_sciences}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="upBasicSciences" class="font-medium">Basic Sciences</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="upQuantitative" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.upper_primary_quantitative}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="upQuantitative" class="font-medium">Quantitative</label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="upEnglish" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.upper_primary_english}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="upEnglish" class="font-medium">English</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="upVerbal" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.upper_primary_verbal}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="upVerbal" class="font-medium">Verbal</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="upOther" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.upper_primary_other}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="upOther" class="font-medium">Other</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  {/if}
                  {#if data.level.junior_secondary}
                    <fieldset>
                      <legend class="sr-only">Junior Secondary subjects?</legend>
                      <div class="text-sm font-bold" aria-hidden="true">Junior Secondary subjects?</div>
                      <div class="mt-4 grid grid-cols-2 gap-6">
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="jMath" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.junior_secondary_mathematics}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="jMath" class="font-medium">Mathematics</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="jbsc" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.junior_secondary_basic_sciences}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="jbsc" class="font-medium">Basic Sciences</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="jbiz" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.junior_secondary_business_studies}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="jbiz" class="font-medium">Business Studies</label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="jother" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.junior_secondary_other}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="jother" class="font-medium">Other</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="jeng" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.junior_secondary_english}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="jeng" class="font-medium">English Language</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="jtech" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.junior_secondary_technology}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="jtech" class="font-medium">Technology</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  {/if}
                  {#if data.level.senior_secondary}
                    <fieldset>
                      <legend class="sr-only">Senior Sec, which subjects?</legend>
                      <div class="text-sm font-bold" aria-hidden="true">Senior Sec, which subjects?</div>
                      <div class="mt-4 grid grid-cols-2 gap-6">
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="smath" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_mathematics}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="smath" class="font-medium">Mathematics</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sict" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_ict}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sict" class="font-medium">ICT</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sphy" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_physics}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sphy" class="font-medium">Physics</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sagric" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_agriculture}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sagric" class="font-medium">Agriculture</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="secon" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_economics}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="secon" class="font-medium">Economics</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sacnt" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_accounting}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sacnt" class="font-medium">Accounting</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sgava" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_government}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sgava" class="font-medium">Government</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="shisto" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_history}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="shisto" class="font-medium">History</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sdini" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_religious_studies}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sdini" class="font-medium">Religious Studies</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sstats" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_statistics}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sstats" class="font-medium">Statistics</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="smziki" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_music}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="smziki" class="font-medium">Music</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sngoso" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_english}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sngoso" class="font-medium">English Language</label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="slit" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_literature}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="slit" class="font-medium">English Literature</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="schem" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_chemistry}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="schem" class="font-medium">Chemistry</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sbio" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_biology}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sbio" class="font-medium">Biology</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sgeo" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_geography}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sgeo" class="font-medium">Geography</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="scom" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_commerce}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="scom" class="font-medium">Commerce</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sart" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_fine_art}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sart" class="font-medium">Fine Art</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="svce" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_civic_education}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="svce" class="font-medium">Civic Education</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sbiz" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_business_studies}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sbiz" class="font-medium">Business Studies</label>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="flex h-5 items-center">
                              <input id="sother" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.subjects.senior_secondary_other}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="sother" class="font-medium">Other</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  {/if}
                  {#if error_bag.subject}
                    <div class="flex items-start text-red-500 text-xs">
                      {error_bag.subject}
                    </div>
                  {/if}
                  <fieldset>
                    <legend class="sr-only">Curriculum of choice?</legend>
                    <div class="text-sm font-bold" aria-hidden="true">Curriculum of choice?</div>
                    <div class="mt-4 space-y-4">
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="cbc" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.curriculum} value="CBC">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="cbc" class="font-medium">CBC</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="8-4-4" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.curriculum} value="8-4-4">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="8-4-4" class="font-medium">8-4-4</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="american" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.curriculum} value="American">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="american" class="font-medium">American</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="british" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.curriculum} value="British">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="british" class="font-medium">British</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="igcse" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.curriculum} value="IGCSE">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="igcse" class="font-medium">IGCSE</label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend class="sr-only">What are your specific goals?</legend>
                    <div class="text-sm font-bold" aria-hidden="true">What are your specific goals?</div>
                    <div class="mt-4 space-y-4">
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <select id="specific_goals" class="rounded border-gray-600 focus:ring-indigo-500 w-full text-sm dark:bg-gray-900" bind:value={data.specific_goals}>
                            <option>Help with assignments and school work</option>
                            <option>Improve phonic, reading and writing</option>
                            <option>Entrance exam preparation</option>
                            <option>Prepare for school tests and exams</option>
                            <option>Improve grades</option>
                            <option>Home schooling</option>
                            <option>Special needs support</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend class="sr-only">Tutor gender preference?</legend>
                    <div class="text-sm font-bold" aria-hidden="true">Tutor gender preference?</div>
                    <div class="mt-4 space-y-4">
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="male" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.tutor_gender} value="Male">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="male" class="font-medium">Male</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="female" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.tutor_gender} value="Female">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="female" class="font-medium">Female</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="any" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.tutor_gender} value="Any">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="any" class="font-medium">Any Gender</label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend class="sr-only">Meeting preference?</legend>
                    <div class="text-sm font-bold" aria-hidden="true">Meeting preference?</div>
                    <div class="mt-4 space-y-4">
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="online" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.meeting_preference} value="Online">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="online" class="font-medium">Online</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="in_person" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.meeting_preference} value="In Person">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="in_person" class="font-medium">In person</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="not_sure" type="radio" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:group={data.meeting_preference} value="Not Sure">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="not_sure" class="font-medium">Not sure</label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                {/if}
                {#if step === 1}
                  <fieldset>
                    <legend class="sr-only">Personal Details</legend>
                    <div class="text-sm font-bold" aria-hidden="true">Personal Details</div>
                    <div class="mt-4 grid sm:grid-cols-2 gap-4">
                      <div class="mb-2">
                        <label class="text-sm">First Name</label>
                        <input id="pfn" type="text" class="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 w-full text-sm dark:bg-gray-900" placeholder="Jaime" bind:value={data.user.first_name}>
                        {#if error_bag.first_name}
                          <p class="mt-2 text-xs text-red-500">
                            {error_bag.first_name}
                          </p>
                        {/if}
                      </div>
                      <div class="mb-2">
                        <label class="text-sm">Last name</label>
                        <input id="pln" type="text" class="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 w-full text-sm dark:bg-gray-900" placeholder="Wamanyala" bind:value={data.user.last_name}>
                        {#if error_bag.last_name}
                          <p class="mt-2 text-xs text-red-500">
                            {error_bag.last_name}
                          </p>
                        {/if}
                      </div>
                      <div class="mb-2">
                        <label class="text-sm">Email Address</label>
                        <input id="peml" type="email" class="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 w-full text-sm dark:bg-gray-900" placeholder="someone@example.com" bind:value={data.user.email}>
                        {#if error_bag.email}
                          <p class="mt-2 text-xs text-red-500">
                            {error_bag.email}
                          </p>
                        {/if}
                      </div>
                      <div class="mb-2">
                        <label class="text-sm">Phone Number</label>
                        <input id="pphn" type="text" class="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 w-full text-sm dark:bg-gray-900" placeholder="0712345678" bind:value={data.user.phone}>
                        {#if error_bag.phone}
                          <p class="mt-2 text-xs text-red-500">
                            {error_bag.phone}
                          </p>
                        {/if}
                      </div>
                      <div class="mb-2">
                        <label class="text-sm">County of Residence</label>
                        <select id="prsd" class="rounded border-gray-600 focus:ring-indigo-500 w-full text-sm dark:bg-gray-900" bind:value={data.user.county}>
                          <option>Nairobi</option>
                          <option>Mombasa</option>
                          <option>Kisumu</option>
                          <option>Nakuru</option>
                          <option>Eldoret</option>
                          <option>Kericho</option>
                        </select>
                      </div>
                      <div class="mb-2">
                        <label class="text-sm">Address</label>
                        <input id="padd" type="text" class="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 w-full text-sm dark:bg-gray-900" placeholder="Westlands, Brookside, Gables Apartment House Number XYZs" bind:value={data.user.address}>
                        {#if error_bag.address}
                          <p class="mt-2 text-xs text-red-500">
                            {error_bag.address}
                          </p>
                        {/if}
                      </div>
                    </div>
                    <div class="mb-2">
                      <label class="text-sm">How did you know about us</label>
                      <select id="padvert" class="rounded border-gray-600 focus:ring-indigo-500 w-full text-sm dark:bg-gray-900" bind:value={data.user.ad_method}>
                        <option>Google</option>
                        <option>Online Ad</option>
                        <option>Referral</option>
                        <option>Facebook</option>
                        <option>Linkedin</option>
                        <option>Blog Post</option>
                      </select>
                    </div>
                  </fieldset>
                {/if}
                {#if step === 2}
                  <fieldset>
                    <legend class="sr-only">Days of the week to hold lessons</legend>
                    <div class="text-sm font-bold" aria-hidden="true">Days of the week to hold lessons</div>
                    <div class="mt-4 grid sm:grid-cols-2 gap-4">
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="mon" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.schedule.days.monday}>
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="mon" class="font-medium">Monday</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="tue" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.schedule.days.tuesday}>
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="tue" class="font-medium">Tuesday</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="wed" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.schedule.days.wednesday}>
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="wed" class="font-medium">Wednesday</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="thu" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.schedule.days.thursday}>
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="thu" class="font-medium">Thursday</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="fri" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.schedule.days.friday}>
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="fri" class="font-medium">Friday</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="sat" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.schedule.days.saturday}>
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="sat" class="font-medium">Saturday</label>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex h-5 items-center">
                          <input id="sun" type="checkbox" class="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500" bind:checked={data.schedule.days.sunday}>
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="sun" class="font-medium">Sunday</label>
                        </div>
                      </div>
                    </div>
                    {#if error_bag.days}
                      <p class="mt-2 text-xs text-red-500">
                        {error_bag.days}
                      </p>
                    {/if}
                  </fieldset>
                  <fieldset>
                    <legend class="sr-only">Lesson Schedule</legend>
                    <div class="text-sm font-bold" aria-hidden="true">Lesson Schedule</div>
                    <div class="mt-4 grid sm:grid-cols-2 gap-4">
                      <div class="mb-2">
                        <label class="text-sm">Starting Date</label>
                        <input id="lsstart" type="date" class="rounded border-gray-600 focus:ring-indigo-500 w-full text-sm dark:bg-gray-900" bind:value={data.schedule.lesson.starting_date} min={minDate}>
                        {#if error_bag.starting_date}
                          <p class="mt-2 text-xs text-red-500">
                            {error_bag.starting_date}
                          </p>
                        {/if}
                      </div>
                      <div class="mb-2">
                        <label class="text-sm">Duration</label>
                        <select id="lsdd" class="rounded border-gray-600 focus:ring-indigo-500 w-full text-sm dark:bg-gray-900" bind:value={data.schedule.lesson.duration}>
                          <option>One Week</option>
                          <option>Two Weeks</option>
                          <option>Three Weeks</option>
                          <option>One Month</option>
                          <option>More than one Month</option>
                        </select>
                      </div>
                      <div class="mb-2">
                        <label class="text-sm">Hours per day</label>
                        <select id="lshrs" class="rounded border-gray-600 focus:ring-indigo-500 w-full text-sm dark:bg-gray-900" bind:value={data.schedule.lesson.hours_per_day}>
                          <option>One hour</option>
                          <option>One hour thirty minutes</option>
                          <option>Two hours</option>
                          <option>Three hours</option>
                          <option>Four hours</option>
                          <option>Five hours</option>
                          <option>Six hours</option>
                          <option>Seven hours</option>
                          <option>Eight hours</option>
                        </select>
                      </div>
                      <div class="mb-2">
                        <label class="text-sm">Starting time</label>
                        <input type="time" class="w-full rounded border-gray-600 focus:ring-indigo-500 text-sm dark:bg-gray-900" bind:value={data.schedule.lesson.starting_time}>
                        {#if error_bag.starting_time}
                          <p class="mt-2 text-xs text-red-500">
                            {error_bag.starting_time}
                          </p>
                        {/if}
                      </div>
                    </div>
                  </fieldset>
                {/if}
  	          </div>
  	          <div class="px-4 py-3 text-right sm:px-6">
                {#if step > 0 && !submitting}
    	            <button on:click={() => step--} class="inline-flex justify-center rounded-md border border-white py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Previous</button>
                {/if}

                {#if step < 2}
                  <button on:click={() => step++} class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Next</button>
                {/if}

                {#if step === 2}
                  {#if !submitting}
                    <button on:click={requestTutor} class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Submit</button>
                  {:else}
                    <button disabled class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-progress">Submitting <span class="animate-pulse">...</span></button>
                  {/if}
                  
                {/if}
  	          </div>
  	        </div>
  	      </form>
  	    </div>
  	  </div>
  	</div>
  </section>
{:else}
  <section class="container mx-auto p-4 my-6">
    <p class="text-lg font-semibold text-center">
      Your request has been received and is being processed. We will contact you soon.
    </p>
  </section>
{/if}
