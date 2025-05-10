// import { describe, it, expect } from 'vitest';
// import { render, screen } from '@testing-library/svelte';
// import Page from '../../../../src/routes/merchants/sign-up/+page.svelte';

// describe('/birthdays', () => {
// 	const birthdays = [
// 		{ name: 'Hercules', dob: '1994-02-02' },
// 		{ name: 'Athena', dob: '1989-01-01' }
// 	];

// 	it('displays all the birthdays passed to it', () => {
// 		render(Page, { data: { birthdays } });
// 		expect(screen.queryByText('Hercules')).toBeVisible();
// 		expect(screen.queryByText('Athena')).toBeVisible();
// 	});
// });

import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 2 + 2 to equal 4', () => {
		expect(2 + 2).toBe(4);
	});
});
