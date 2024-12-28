import adapter from "@sveltejs/adapter-auto";
// import { readFileSync } from "fs";
// import { join } from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = join(__filename, '..');

// const backendOutputs = JSON.parse(readFileSync(join(__dirname, "../backend/outputs.json")));

// console.log(`backendOutputs: ${JSON.stringify(backendOutputs, null, 2)}`);
// console.log(`STAGE: ${process.env.STAGE}`);
// console.log(`REST_API_URL: ${backendOutputs["BackendStackApiStackHttpStackA5B3EBBB"][`RestApiUrl${process.env.STAGE}`]}`);


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// env: {
	// 	STAGE: process.env.STAGE,
	// 	REST_API_URL: backendOutputs["BackendStackApiStackHttpStackA5B3EBBB"][`RestApiUrl${process.env.STAGE}`],
	// },
	kit: {
		adapter: adapter(),
		alias: {
			'$sv-types': './.svelte-kit/types',
			'$unit-tests': './src/tests',
			'$playwright-tests': './tests',
			'$schemas': './src/schemas',
			'$types': './src/types',
			'$store': './src/store',
		}
	},
};

export default config;