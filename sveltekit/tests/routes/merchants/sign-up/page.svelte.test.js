// import { describe, test, expect } from 'vitest';
// import '@testing-library/jest-dom/vitest';
// import { render, screen } from '@testing-library/svelte';
// import Page from './+page.svelte';

// describe('/+page.svelte', () => {
// 	test('should render h1', () => {
// 		render(Page);
// 		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
// 	});
// });

import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 3 + 2 to equal 5', () => {
		expect(3 + 2).toBe(5);
	});
});
