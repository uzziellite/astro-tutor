<script>
	import {clickOutside} from "@directives/click_outside.js"
	import {menuActive} from "@store/store.js"

	let menuStatus

	const readStatus = menuActive.subscribe(value => {
		menuStatus = value
	})

	const toggleMenu = () => {
		menuActive.update(value => value = !value)
	}

</script>

<section class={`fixed inset-y-0 right-0 z-50 flex ${menuStatus ? '' : 'hidden'}`} use:clickOutside on:outClick={toggleMenu}>
  <div class="w-screen max-w-sm">
    <div class="flex flex-col h-full divide-y divide-gray-400 bg-white dark:bg-gray-700">
      <div class="overflow-y-scroll">
        <header class="flex items-center justify-between h-16 pl-6">
          <span class="text-sm font-medium tracking-widest uppercase">
            Menu
          </span>

          <button
            aria-label="Close menu"
            class="w-16 h-16 border-l border-gray-200"
            type="button"
            on:click={toggleMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        <nav
          class="flex flex-col text-sm font-medium text-gray-200 border-t border-b border-gray-200 divide-y divide-gray-200"
        >
          <a href="/" class="px-6 py-3"> Home </a>
        </nav>
      </div>
    </div>
  </div>
</section>