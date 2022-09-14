<script>
import {Directus} from "@directus/sdk"
import axios from "axios"

const url = import.meta.env.PUBLIC_CMS
const tutor_invite_url = `${import.meta.env.PUBLIC_INVITE_URL}api/tutor-invite`
const directus = new Directus(url)
const tutors = directus.items('tut_tutors')

let email = ""
let tsc_no = ""
let subject = ""
let curriculum = ""
let location = ""
let hours = ""
let error = ""
let email_error = ""
let message = ""
let sent = false

const registerTutor = async () => {
  await tutors.createOne({
    "tsc_no": tsc_no,
    "subject": subject,
    "curriculum": curriculum,
    "location": location,
    "hours": hours
  }).catch((err) => {
    error = err
  })

  axios.post(tutor_invite_url,{
    email:email
  }).then((resp) => {

    sent = true
    message = resp.data.message

  }).catch((err) => {

    console.error(err)
    email_error = err

  })
}

</script>
<form on:submit|preventDefault={registerTutor} class="p-8 mt-6 mb-0 rounded-lg shadow-2xl grid sm:grid-cols-2 gap-2 dark:bg-gray-900">

  <div class="mb-1">
    <label for="email" class="text-sm font-medium">Email</label>
		<input
      type="email"
      id="email"
      class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm dark:text-white dark:bg-gray-900"
      placeholder="someone@example.com"
      bind:value={email}
      required
    />
  </div>
  <div class="mb-1">
    <label for="tsc" class="text-sm font-medium">TSC Number</label>
		<input
      type="text"
      id="tsc"
      class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm dark:text-white dark:bg-gray-900"
      placeholder="TSC Number"
      bind:value={tsc_no}
      required
    />
  </div>
  <div class="mb-1">
    <label for="subject" class="text-sm font-medium">Subject of specialization <span class="text-xs"> (CTRL + Click Selects Multiple)</span></label>
		<select
      id="subject"
      class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm dark:text-white dark:bg-gray-900"
      placeholder="Specialization subject"
      bind:value={subject}
      required
      multiple
    >
      <option>Mathematics</option>
      <option>English</option>
      <option>Kiswahili</option>
      <option>Physics</option>
      <option>Chemistry</option>
    </select>
  </div>
  <div class="mb-1">
    <label for="curriculum" class="text-sm font-medium">Curriculum of choice <span class="text-xs"> (CTRL + Click Selects Multiple)</span></label>
		<select
      id="curriculum"
      class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm dark:text-white dark:bg-gray-900"
      bind:value={curriculum}
      required
      multiple
    >
    	<option>8-4-4 | CBC</option>
    	<option>British</option>
    	<option>American</option>
  	</select>
  </div>
  <div class="mb-1">
    <label for="location" class="text-sm font-medium">Location</label>
		<select
      id="location"
      class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm dark:text-white dark:bg-gray-900"
      bind:value={location}
      required
    >
    	<option>Nairobi</option>
    </select>
  </div>
  <div class="mb-1">
    <label for="hours" class="text-sm font-medium">Hours available for teaching</label>
		<input
      type="number"
      id="hours"
      class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm dark:text-white dark:bg-gray-900"
      placeholder="1"
      min="1"
      max="5"
      bind:value={hours}
      required
    />
  </div>

  <button type="submit" class="block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg">
    Register
  </button>
</form>

{#if error.length > 0}
  <div class="p-2 shadow-md mt-4 text-center text-rose-600">
    {error}    
  </div>
{/if}

{#if sent === true}
  <div class="p-2 shadow-md bg-gray-200 mt-4 text-center">
    {message}
  </div>
{/if}

{#if email_error.length > 0}
  <div class="p-2 shadow-md bg-gray-200 mt-4 text-center text-rose-600">
    Unable to send invitation email. Please contact support to gain access to your account
  </div>
{/if}
