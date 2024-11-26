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

  // Send the request and return the response
  return await fetch(url, options);
}