# Merchant sign up

Merchants can sign up for a pre-verified merchant account

## Scenario: Successful sign up

    Visits merchant sign up page

    Fills in merchant details

    Submits merchant details

    Receives welcome email with verification code and unique URL to the "confirm email" page

    Verifies email

    Is successfully signed up

    Receives email with follow-up instructions to complete document verification

## Backend

### Cognito

User Pool:

- Self-signup: Enabled (but restricted to Consumer group via pre-signup Lambda)
- Password policy:
  - Minimum length: 8
  - Require lowercase: Yes
  - Require uppercase: Yes
  - Require digits: Yes
  - Require symbols: Yes
- Sign-in attributes: Email
- Auto-verify: Email
- Keep original attributes: Email
- Case-sensitive sign-in: No
- User verification:
  - Email subject: "Verify you email"
  - Email body: "Thanks for signing up to our awesome app! Your verification code is {####}. This code is valid for 24 hours."
  - Email style: CODE
- Account recovery: Email only
- Standard attributes:
  - Email (required, immutable)
- Custom attributes:
  - businessName (mutable)
  - userGroup (immutable)
- Removal policy: RETAIN

User Pool Client:

- Generate secret: Yes
- Auth flows:
  - User password
  - Admin user password
- Access token validity: 8 hours
- OAuth:
  - Flows: Authorization code grant
  - Scopes: OPENID, EMAIL, PROFILE
  - Callback URLs: ["http://localhost:5173"]
- Prevent user existence errors: Yes

User Groups:

- Merchants: For merchant accounts

Sign-up Flow:

- Merchant submits sign-up form
- Lambda creates Cognito user with attributes:
  - email
  - custom:businessName
  - custom:userGroup
- User is added to "Merchants" group
- Email verification is required before account activation

### API Gateway

**Method**: POST  
**Path**: /merchant/accounts  
**Headers**:  
Content-Type: application/json

**Request Body**:

```json
{
  "email": string; required; Email address of the merchant,
  "password": string; required; Password for the account,
  "businessName": string; required; Name of the business,
  "registrationNumber": string; required; Business registration number,
  "yearOfRegistration": number; required; Year of business registration,
  "website": string; optional; Website URL,
  "address": {
    "buildingNumber": string; required; Building number,
    "street": string; required; Street,
    "city": string; required; City,
    "state": string; required; State,
    "zip": string; required; Zip,
    "country": string; required; Country
  },
  "phone": string; required; Business phone number,
  "primaryContact": {
    "name": string; required; Contact person name,
    "email": string; required; Contact person email,
    "phone": string; required; Contact person phone
  },
  "productCategories": string[]; required; List of product categories from predefined options: Electronics | Clothing | Home & Kitchen | Beauty & Personal Care | Books | Toys & Games | Sports & Outdoors | Automotive | Health & Wellness | Food & Grocery | Jewelry | Office Supplies
}
```

**Responses**:

- 200 OK:
  ```json
  {
    "success": true,
    "message": string; required; "Account registered. Complete sign-up with OTP",
    "username": string; required; Email address used for registration
  }
  ```
- 400 Bad Request:
  ```json
  {
    "success": false,
    "error": string; required; Error message describing the validation failure
  }
  ```

**Integration**: AWS Lambda Proxy  
**Lambda Function**: Merchant Sign-Up Lambda  
**Request Validation**: Body  
**Authorization**: None (Public endpoint)

### Lambda

Name: MerchantSignUpLambda  
Runtime: Node.js 20.x  
Handler: handler  
Entry: src/lambda/merchant/accounts/sign-up/handler.js

Environment Variables:

- USER_POOL_ID: Cognito User Pool ID
- USER_POOL_CLIENT_ID: Cognito User Pool Client ID

IAM Permissions:

- cognito-idp:SignUp (Allow)
- cognito-idp:AdminAddUserToGroup (Allow on User Pool ARN)

Function Logic:

1. Receives merchant sign-up data from API Gateway
2. Creates Cognito user with SignUpCommand
3. Sets required attributes:
   - email
   - custom:businessName
   - custom:userGroup
4. Adds user to "Merchants" group with AdminAddUserToGroupCommand
5. Returns success response with username and message

## Frontend

### Route:

    merchants/accounts/sign-up

### Page:

    Need a sign up form with the following merchant details to be obtained:

      {
        MerchantId: {
          description: "Merchant ID using KSUID",
          type: string,
          required: true
        },
        BusinessName: {
          description: "Name of business",
          type: string,
          required: true
        },
        RegistrationNumber: {
          description: "Business registration number",
          type: string,
          required: true
        },
        YearOfRegistration: {
          description: "Year of business registration",
          type: number,
          required: true
        },
        Email: {
          description: "Email",
          type: string,
          required: true
        },
        Website: {
          description: "Website URL",
          type: string,
          required: false
        },
        Address: {
          BuildingNumber: {
            description: "Building number",
            type: string,
            required: true
          },
          Street: {
            description: "Street",
            type: string,
            required: true
          },
          City: {
            description: "City",
            type: string,
            required: true
          },
          State: {
            description: "State",
            type: string,
            required: true
          },
          Zip: {
            description: "Zip",
            type: string,
            required: true
          },
          Country: {
            description: "Country",
            type: string,
            required: true
          }
        },
        Phone: {
          description: "Phone",
          type: string,
          required: true
        },
        PrimaryContact: {
          Name: {
            description: "Name",
            type: string,
            required: true
          },
          Email: {
            description: "Email",
            type: string,
            required: true
          },
          Phone: {
            description: "Phone",
            type: string,
            required: true
          }
        },
        ProductCategories: {
          description: "Product categories",
          type: string[
            'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Personal Care', 'Books', 'Toys & Games', 'Sports & Outdoors', 'Automotive', 'Health & Wellness', 'Food & Grocery', 'Jewelry', 'Office Supplies'
          ],
          required: true
        },
        Status: {
          description: "Status",
          type: string,
          required: true
        }
      }

    Browser validation

### Page Server:

    Path: sveltekit/src/routes/merchants/sign-up/+page.server.js

    Actions:
      default: Sign up form submission
        - Multi-step form with server-side validation
        - Step 1: Account Information validation
        - Step 2: Business Information validation
        - Step 3: Contact Information validation and API submission

    Validation Schema:
      Path: sveltekit/src/routes/merchants/sign-up/schema.js
      - step1Schema: Validates business name, email, password with Zod
      - step2Schema: Validates registration number, year, business type
      - step3Schema: Validates contact details, address, product categories
      - Custom refinements for password matching and terms acceptance

    API Integration:
      - Calls merchantService.signUp() with combined form data
      - Handles success/error responses
      - Redirects to confirmation page on success
      - Returns validation errors to client on failure

### State Management

- Cookies (secure) to store form data between steps:
  - signup_businessName
  - signup_email
  - signup_password
  - signup_registrationNumber
  - signup_yearOfRegistration
  - signup_businessType
  - signup_website
- Cookie maxAge: 30 minutes
- Cookie path: '/'
- httpOnly: false (to allow client-side access)

### Route:

    auth/confirm-sign-up

### Page:

    Need a "confirm sign up" form with the following info:

      {
        verificationCode: {
          description: "Verification code sent to email",
          type: string,
          required: true
        },
      }

    Browser validation

### Page Server:

    Actions:
      default: Sign up form submission
        - Multi-step form with server-side validation
        - Step 1: Account Information validation
        - Step 2: Business Information validation
        - Step 3: Contact Information validation and API submission

    Validation Schema:
      Path: sveltekit/src/routes/merchants/sign-up/schema.js
      - step1Schema: Validates business name, email, password with Zod
      - step2Schema: Validates registration number, year, business type
      - step3Schema: Validates contact details, address, product categories
      - Custom refinements for password matching and terms acceptance

    API Integration:
      - Calls merchantService.signUp() with combined form data
      - Handles success/error responses
      - Redirects to confirmation page on success
      - Returns validation errors to client on failure

### State Management

- Cookies (secure) to store form data between steps:
  - signup_businessName
  - signup_email
  - signup_password
  - signup_registrationNumber
  - signup_yearOfRegistration
  - signup_businessType
  - signup_website
- Cookie maxAge: 30 minutes
- Cookie path: '/'
- httpOnly: false (to allow client-side access)

## Notes

- This is a pre-verified account opening workflow. The user still hast to complete document verification to be able to sell products.
