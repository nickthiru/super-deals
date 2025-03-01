import { error } from '@sveltejs/kit';
import { categories } from './categories';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	console.log("Inside 'public/+page.js load()");

	return {
		categories
	};
}
