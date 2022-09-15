<script>
  import {Directus} from "@directus/sdk"

  export let skill
  export let price
  export let duration

  let email
  let phone
  let booking = false
  let message = ""
  let error = ""
  const directus = new Directus(import.meta.env.PUBLIC_CMS)

  const bookSkillSession = async () => {
    try{
      booking = true

      await directus.items('tut_skills_booking').createOne({
        email,
        phone,
        price,
        skill,
        duration
      })

      message = "Successfully booked. We shall contact you with further instructions. Please check your email address"

    }catch(err){
      console.error(err)
      error = err
      booking = false
    }
  }
</script>

<form on:submit|preventDefault={bookSkillSession} class="max-w-md mx-auto mt-8 mb-0 space-y-4">
  <div>
    <label for="email" class="sr-only">Email</label>

    <div class="relative">
      <input
        type="email"
        class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
        placeholder="Enter your email address"
        required
        bind:value={email}
      />

      <span class="absolute inset-y-0 inline-flex items-center right-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
          />
        </svg>
      </span>
    </div>
  </div>

  <div>
    <label for="password" class="sr-only">Phone Number</label>
    <div class="relative">
      <input
        type="text"
        class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
        placeholder="Enter your phone number"
        required
        bind:value={phone}
      />

      <span class="absolute inset-y-0 inline-flex items-center right-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </span>
    </div>
  </div>

  {#if !booking}
    <button type="submit" class="px-5 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg">
      Book Session
    </button>
  {:else}
    <button type="submit" class="px-5 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg cursor-progress">
      Booking <span class="animate-ping">...</span>
    </button>
  {/if}

  <div class="text-sm my-2 text-green-600">
    {message}
  </div>
  <div class="text-sm my-2 text-red-600">
    {error}
  </div>
</form>
