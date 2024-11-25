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
    console.log(`Response Status: ${response.status}`);
    console.log(`Response StatusText: ${response.statusText}`);

    const responseBody = await response.json();
    console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return responseBody;

  } catch (error) {
    console.error(`API error: ${error.message}`);
    throw error;
  }
};