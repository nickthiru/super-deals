import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  // if (params.slug === 'hello-world') {
  //   return {
  //     title: 'Hello world!',
  //     content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
  //   };
  // }

  return {
    brandId: params.brand_id,
    dealId: params.deal_id,
  };

  // error(404, 'Not found');
}
