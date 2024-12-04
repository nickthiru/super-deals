import { error } from '@sveltejs/kit';
import { categories } from './categories';

// /** @type {import('./$types').PageLoad} */
// export function load({ params }) {
//   if (params.slug === 'hello-world') {
//     return {
//       title: 'Hello world!',
//       content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
//     };
//   }
//   error(404, 'Not found');
// }

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  console.log("Inside 'public/+page.js load()");

  return {
    categories,
  }
}