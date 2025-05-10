// import { describe, it, expect } from 'vitest';
// import { load } from '../../../../src/routes/accounts/sign-up/[user_type]/+page.server.js';

// describe('/birthdays - load', () => {
// 	it('returns a fixture of two items', () => {
// 		const result = load();

// 		expect(result.birthdays).toEqual([
// 			{ name: 'Hercules', dob: '1994-02-02' },
// 			{ name: 'Athena', dob: '1989-01-01' }
// 		]);
// 	});
// });

import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 4 + 2 to equal 6', () => {
		expect(4 + 2).toBe(6);
	});
});
