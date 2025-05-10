import { expect } from 'vitest';
import { it } from 'vitest';

it('renders hello into the document', () => {
	document.body.innerHTML = '<h1>Hello, world!</h1>';
	expect(document.body).toHaveTextContent('Hello, world!');
});
