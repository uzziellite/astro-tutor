<script lang="ts">
let name = import.meta.env.PUBLIC_NAME
</script>

<footer class="bg-gray-200 dark:bg-gray-900">
	<div class="container grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 gap-x-2 mx-auto">
		<div class="mx-4">
			<h2 class="text-yellow-dark font-black mt-4 text-xl">
				About Us
			</h2>
			<div class="text-sm">
				We are located at
				Utawala Bypass,<br/>
				Casamoko Plaza<br>
				3<sup>rd</sup> floor<br>
				Nairobi, Kenya
			</div>
		</div>
		<div class="flex flex-col mx-4">
			<h2 class="font-black mt-4 text-xl">
				Contact Us
			</h2>
			<span class="flex flex-row space-x-4 mt-4">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
				<a href="tel:+254704386039" class="text-sm">0704 386 039</a>
			</span>
		</div>
		<div class="flex flex-col mx-4">
			<h2 class="text-yellow-dark font-black mt-4 text-xl">
				Quick Links
			</h2>
		    <a href="/blog" class="text-sm">
		    	Our Blog
		    </a>
		    <a href="/assesment" class="text-sm">
		    	Take Assesments
		    </a>
		    <a href="/find-tutor" class="text-sm">
		    	Find Tutor
		    </a>
		    <a href="/become-tutor" class="text-sm">
		    	Become Tutor
		    </a>
		</div>
		<div class="bg-transparent mx-4">
			<h2 class="font-black mt-4 text-xl">
				Connect with us
			</h2>
			<div class="flex flex-row my-6 space-x-2">
				<a href="https://facebook.com/traceafricasmart" target="_blank">
					<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><path d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"/><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"/></svg>
				</a>
				<a href="https://twitter.com/africa_trace" target="_blank">
					<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><linearGradient id="_osn9zIN2f6RhTsY8WhY4a" x1="10.341" x2="40.798" y1="8.312" y2="38.769" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2aa4f4"/><stop offset="1" stop-color="#007ad9"/></linearGradient><path d="M46.105,11.02c-1.551,0.687-3.219,1.145-4.979,1.362c1.789-1.062,3.166-2.756,3.812-4.758	c-1.674,0.981-3.529,1.702-5.502,2.082C37.86,8.036,35.612,7,33.122,7c-4.783,0-8.661,3.843-8.661,8.582	c0,0.671,0.079,1.324,0.226,1.958c-7.196-0.361-13.579-3.782-17.849-8.974c-0.75,1.269-1.172,2.754-1.172,4.322	c0,2.979,1.525,5.602,3.851,7.147c-1.42-0.043-2.756-0.438-3.926-1.072c0,0.026,0,0.064,0,0.101c0,4.163,2.986,7.63,6.944,8.419	c-0.723,0.198-1.488,0.308-2.276,0.308c-0.559,0-1.104-0.063-1.632-0.158c1.102,3.402,4.299,5.889,8.087,5.963	c-2.964,2.298-6.697,3.674-10.756,3.674c-0.701,0-1.387-0.04-2.065-0.122C7.73,39.577,12.283,41,17.171,41	c15.927,0,24.641-13.079,24.641-24.426c0-0.372-0.012-0.742-0.029-1.108C43.483,14.265,44.948,12.751,46.105,11.02"/></svg>
				</a>
				<a href="https://www.linkedin.com/in/trace-africa-smart-480363221/" target="_blank">
					<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><path d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"/><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"/></svg>
				</a>
			</div>
		</div>
	</div>
	<div class="mt-12 text-center py-4 text-sm">
			&copy; { new Date().getFullYear() } {name}
		</div>
</footer>