// frontend/src/routes/+page.js
import { redirect } from '@sveltejs/kit';

export function load() {
  return redirect(301, '/public');
}