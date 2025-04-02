const request = require("supertest");
const { apiUrl } = require("#tests/api/config");
const { validMerchantData } = require("./fixtures");

describe("POST /merchants/account/signup", () => {
  beforeEach(async () => {
    // Clean up test data if needed
    // For example, remove test users from Cognito

    console.log("API URL:", apiUrl);
  });

  afterEach(async () => {
    // Additional cleanup if needed
  });

  test("successfully creates a merchant account", async () => {
    const response = await request(apiUrl)
      .post("/merchants/account/signup")
      .send(validMerchantData)
      .expect(201)
      .expect("Content-Type", /json/);

    // Verify response structure
    expect(response.body).toHaveProperty(
      "message",
      "Merchant registered. Needs to submit OTP to complete sign-up"
    );
    expect(response.body).toHaveProperty("userConfirmed");
    expect(response.body.userConfirmed).toBe(false);
    expect(response.body).toHaveProperty("merchantId");
    expect(response.body).toHaveProperty("codeDeliveryDetails");
    expect(response.body.codeDeliveryDetails).toHaveProperty("Destination");
    // expect(response.body.codeDeliveryDetails.Destination).toBe(
    //   validMerchantData.email
    // );
    expect(response.body.codeDeliveryDetails).toHaveProperty("DeliveryMedium");
    expect(response.body.codeDeliveryDetails.DeliveryMedium).toBe("EMAIL");

    // Verify Cognito user was created (requires AWS SDK mock or real integration)
    // This would be implemented based on your testing strategy
  });

  // test("returns 400 for missing required fields", async () => {
  //   const invalidData = { ...validMerchantData };
  //   delete invalidData.businessName;

  //   const response = await request(apiUrl)
  //     .post("/merchants/account/signup")
  //     .send(invalidData)
  //     .expect(400)
  //     .expect("Content-Type", /json/);

  //   expect(response.body).toHaveProperty("error");
  //   expect(response.body.error).toMatch(/businessName.*required/i);
  // });

  // test("returns 400 for invalid email format", async () => {
  //   const invalidData = {
  //     ...validMerchantData,
  //     email: "invalid-email",
  //   };

  //   const response = await request(apiUrl)
  //     .post("/merchants/account/signup")
  //     .send(invalidData)
  //     .expect(400)
  //     .expect("Content-Type", /json/);

  //   expect(response.body).toHaveProperty("error");
  //   expect(response.body.error).toMatch(/email.*invalid/i);
  // });

  // test("returns 400 for weak password", async () => {
  //   const invalidData = {
  //     ...validMerchantData,
  //     password: "weak",
  //   };

  //   const response = await request(apiUrl)
  //     .post("/merchants/account/signup")
  //     .send(invalidData)
  //     .expect(400)
  //     .expect("Content-Type", /json/);

  //   expect(response.body).toHaveProperty("error");
  //   expect(response.body.error).toMatch(/password.*requirements/i);
  // });
});
