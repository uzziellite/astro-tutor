<script lang="ts">
import {clickOutside} from "@directives/click_outside.js"

let navbarOpen = false
let loggedIn = false
const name = import.meta.env.PUBLIC_NAME

if(localStorage.getItem('auth_token')){
  loggedIn = true
}


</script>

<!--Header items loaded here-->
<header class="top-0 fixed z-50 w-full">
  <nav class="w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-gray-200 dark:bg-gray-900 shadow-md">
    <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
      <div class="w-full relative flex justify-between space-x-2 lg:w-auto lg:static lg:block lg:justify-start">
        <a
          class="text-xl lg:hidden xl:flex leading-relaxed inline-block mr-1 py-2 whitespace-nowrap uppercase flex"
          href="/">
          <svg class="w-auto h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
          <p class="ml-2 mt-2">
            {name}
          </p>
        </a>
        <button class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button" on:click={() => (navbarOpen = ! navbarOpen)} name="Mobile Navigation Menu" use:clickOutside on:outclick={() => (navbarOpen = false)}>
          <span class="hidden">Application Menu</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
      <div class={`lg:flex flex-grow items-center ${navbarOpen ? '' : 'hidden'}`}>
        <ul class="flex flex-col lg:flex-row list-none lg:ml-auto lg:space-x-8">
          <li class="flex items-center">
            <a
              class="px-1 py-2 flex items-center text-sm uppercase transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              href="/assesment">
              Self Learning
            </a>
          </li>
          <li class="flex items-center">
            <a
              class="px-1 py-2 flex items-center text-sm uppercase transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              href="/find-tutor">
              Find Tutor
            </a>
          </li>
          <li class="flex items-center">
            <a
              class="px-1 py-2 flex items-center text-sm uppercase transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              href="/become-tutor">
              Become Tutor
            </a>
          </li>
          <li class="flex items-center">
            <a
              class="px-1 py-2 flex items-center text-sm uppercase transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              href="/online-tutoring">
              Online Tutoring
            </a>
          </li>
          {#if !loggedIn}
            <li class="flex items-center">
              <a
                class="px-1 py-2 flex items-center text-sm uppercase font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                href="/login">
                Login
              </a>
            </li>
            <li class="my-2 lg:my-0">
              <a class="inline-block px-4 py-3 text-sm font-medium transition border border-current rounded hover:scale-110 hover:shadow-xl active:text-indigo-500 focus:outline-none focus:ring" href="/register">
                Register
              </a>
            </li>
          {:else}
            <li class="my-2 lg:my-0">
              <a class="inline-block px-4 py-3 text-sm font-medium transition border border-current rounded hover:scale-110 hover:shadow-xl active:text-indigo-500 focus:outline-none focus:ring" href="/logout">
                Logout
              </a>
            </li>
          {/if}
        </ul>
      </div>
    </div>
  </nav>
</header>
