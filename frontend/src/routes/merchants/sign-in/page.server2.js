import { fail, redirect } from '@sveltejs/kit';

import schema from './schema.js';

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log('Received Form Data:', data); // Log the form data

    // Validate form data
    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      return fail(400, {
        errors: validationResult.error.flatten().fieldErrors
      });
    }

    // Mock response
    const mockResponse = {
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve({
        accessToken: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
        expiresIn: 3600,
        merchantId: 'mocked-merchant-id',
      })
    };

    const responseBody = await mockResponse.json();
    console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

    if (responseBody.accessToken) {
      cookies.set('accessToken', responseBody.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      cookies.set('refreshToken', responseBody.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      cookies.set('expiresIn', responseBody.expiresIn, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      cookies.set('merchantId', responseBody.merchantId, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    redirect(303, `/merchants/${responseBody.merchantId}`);
  }
};