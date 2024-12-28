import { writable } from 'svelte/store';

const authToken = writable(null);

export default authToken;