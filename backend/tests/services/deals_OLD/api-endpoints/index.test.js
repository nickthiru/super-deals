// backend/tests/api/add-deal.test.js
const request = require('supertest');
const fs = require('fs');
const path = require('path');

// Read the base URL from backend/outputs.json
const outputsPath = path.resolve(__dirname, '../../../../outputs.json');
const outputs = JSON.parse(fs.readFileSync(outputsPath, 'utf-8'));
const baseUrl = outputs.BackendStackApiStackHttpStackA5B3EBBB.RestApiEndpoint0551178A;

// Define the endpoint
const endpoint = 'merchant/deals';

describe('Deal API Endpoints', () => {
  it('should validate form data for adding a deal', async () => {
    const response = await request(baseUrl)
      .post(endpoint)
      .field('merchantId', 'Nike007')
      .field('title', 'Test Deal')
      .field('originalPrice', 100)
      .field('discount', 50)
      .attach('logo', path.resolve(__dirname, '../data/deal-logo.png'))
      .field('category', 'foodDrink')
      .field('expiration', '2024-12-31');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Deal successfully created');
    expect(response.body).toHaveProperty('dealId');
  });

  it('should fail validation when all fields are empty', async () => {
    const response = await request(baseUrl)
      .post(endpoint)
      .field('merchantId', '')
      .field('title', '')
      .field('originalPrice', '')
      .field('discount', '')
      .attach('logo', '')
      .field('category', '')
      .field('expiration', '');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');

    const errors = response.body.errors;
    expect(errors).toHaveProperty('merchantId', expect.arrayContaining(['Merchant ID is required']));
    expect(errors).toHaveProperty('title', expect.arrayContaining(['Title is required']));
    expect(errors).toHaveProperty('originalPrice', expect.arrayContaining(['Original Price is required']));
    expect(errors).toHaveProperty('discount', expect.arrayContaining(['Discount is required']));
    expect(errors).toHaveProperty('logo', expect.arrayContaining(['Filename is required']));
    expect(errors).toHaveProperty('category', expect.arrayContaining(['Category is required']));
    expect(errors).toHaveProperty('expiration', expect.arrayContaining(['Expiration is required']));
  });
});