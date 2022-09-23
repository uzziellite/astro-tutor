<script lang="ts">
  import {menuActive} from "@store/store.js"

  let navbarOpen
  let name = import.meta.env.PUBLIC_NAME

  const readStatus = menuActive.subscribe(value => {
    navbarOpen = value
  })

  const toggleMenu = () => {
    menuActive.update(value => value = ! value)
  }
</script>

<!--Header items loaded here-->
<header class="top-0 fixed z-50 w-full">
  <nav class={`w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-gray-200 dark:bg-gray-900 ${navbarOpen ? '' : 'shadow-md'}`}>
    <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
      <div class="w-full relative flex justify-between space-x-2 w-auto static block justify-start">
        <a
          class="text-xl lg:hidden xl:flex font-bold leading-relaxed inline-block mr-1 py-2 whitespace-nowrap uppercase flex"
          href="/">
          <svg class="w-auto h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
          <p class="text-xs ml-2 mt-2">
            {name}
          </p>
        </a>
      </div>
      <div class={`flex flex-grow items-center`}>
        <ul class="flex flex-row list-none ml-auto space-x-8">
          <button class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block outline-none focus:outline-none" type="button" on:click={toggleMenu} name="Mobile Navigation Menu">
            <span class="hidden">Application Menu</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </ul>
      </div>
    </div>
  </nav>
</header>
