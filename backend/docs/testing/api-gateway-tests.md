# API Gateway Testing Reference

This document provides reference payloads and configurations for testing API endpoints directly in the AWS Console.

## Accounts API

### POST /accounts (Merchant Sign-Up)

Test this endpoint in the API Gateway console using the following configuration:

#### Headers

```
Content-Type: application/json
```

#### Request Body

```json
{
  "userType": "merchant",
  "email": "nickthiru@gmail.com",
  "password": "Test1234!",
  "businessName": "Test Business",
  "registrationNumber": "12345",
  "yearOfRegistration": 2020,
  "businessType": "retail",
  "website": "https://example.com",
  "phone": "1234567890",
  "address": {
    "buildingNumber": "123",
    "street": "Test Street",
    "city": "Test City",
    "state": "Test State",
    "zip": "12345",
    "country": "United States"
  },
  "primaryContact": {
    "name": "Test Contact",
    "email": "contact@example.com",
    "phone": "1234567890"
  },
  "productCategories": ["Electronics", "Health & Wellness"]
}
```

#### Expected Response (Success)

```json
{
  "success": true,
  "message": "Merchant account created successfully",
  "merchantId": "unique-id",
  "verificationRequired": true
}
```

#### Common Validation Errors

1. Missing required fields:

   - All fields except `website` are required
   - All nested fields in `address` and `primaryContact` are required

2. Password validation:

   - Must be at least 8 characters
   - Must contain at least one lowercase letter
   - Must contain at least one uppercase letter
   - Must contain at least one number
   - Must contain at least one special character

3. Email validation:

   - Must be a valid email format

4. Product categories:
   - Must be an array with at least one item
   - Each item must be one of the allowed categories

### POST /accounts/resend-verification

#### Headers

```
Content-Type: application/json
```

#### Request Body

```json
{
  "email": "test@example.com",
  "userType": "merchant"
}
```

#### Expected Response

```json
{
  "success": true,
  "message": "Verification code resent successfully"
}
```

### POST /accounts/confirm-sign-up

#### Headers

```
Content-Type: application/json
```

#### Request Body

```json
{
  "email": "test@example.com",
  "code": "123456",
  "userType": "merchant"
}
```

#### Expected Response

```json
{
  "success": true,
  "message": "Email verified successfully",
  "merchantId": "unique-id"
}
```
