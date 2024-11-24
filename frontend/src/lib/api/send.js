// export default async function send(fetch, path, options) {
//   const url = `${process.env.REST_API_URL}${path}`;
//   console.log(`process.env.REST_API_URL: ${process.env.REST_API_URL}`);
//   console.log(`URL: ${url}`);
//   const headers = new Headers(options.headers);
//   headers.set('X-Stage', process.env.STAGE);


//   try {
//     const response = await fetch(url, { ...options, headers });
//     if (!response.ok) {
//       throw new Error(`API error: ${response.status} ${response.statusText}`);
//     }
//     return response.json();
//   } catch (error) {
//     console.error(`API error: ${error.message}`);
//     throw error;
//   }
// };

import backendOutputs from '../../../../backend/outputs.json';

const REST_API_URL = backendOutputs["BackendStackApiStackHttpStackA5B3EBBB"][`RestApiUrl${process.env.STAGE}`];
console.log(`REST_API_URL: ${REST_API_URL}`);

export default async function send(fetch, path, options) {
  const url = `${REST_API_URL}${path}`;
  console.log(`URL: ${url}`);

  if (!options.headers) {
    options.headers = new Headers();
  }

  options.headers.set('X-Stage', process.env.STAGE);

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`API error: ${error.message}`);
    throw error;
  }
};