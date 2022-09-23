import { writable } from 'svelte/store'

export const loggedIn = writable(0)
export const menuActive = writable(false)
export const activeAssesmentTab = writable(0)