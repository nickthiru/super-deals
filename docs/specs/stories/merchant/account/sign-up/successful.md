# Merchant sign up

Merchants can sign up for a pre-verified merchant account

## Scenario: Successful sign up

    Visits merchant sign up page

    Fills in merchant details

    Submits merchant details

    Is shown a message asking them to check their email for a verification code

      Code is only valid for 24 hours?

    Receives welcome email with verification code and unique URL to the "confirm email" page

    Verifies email

      The page should display "verifying. please hold on"-type of message or something similar

      The page server needs to read the two values from the path parameter and pass it to amplify's confirmSignUp api

      Based on the result, the page should then update the display something similar to "your email has been verified. please click on the 'sign in' button below to sign in", or an error message if the verification failed

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
  - registrationNumber (mutable)
  - yearOfRegistration (mutable)
  - website (mutable)
  - address (mutable)
  - phone (mutable)
  - primaryContact (mutable)
  - productCategories (mutable)
- Removal policy: RETAIN
- Lambda Triggers:
  - Custom Message: Customizes email templates based on user type

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

### API Gateway

**Method**: POST  
**Path**: /accounts
**Headers**:  
Content-Type: application/json

**Files**:

- Construct: `backend/lib/api/http/endpoints/accounts/post/construct.js`
- Schema: `backend/lib/api/http/endpoints/accounts/post/schema.js`
- OpenAPI: `docs/api/resources/accounts.yml`

**Path Parameters**:

userType: string; required; User type (merchant)

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

**Integration**: API Gateway Lambda Proxy  
**Lambda Function**: Accounts_Merchants_SignUp  
**Request Validation**: Body (using API Gateway Model and RequestValidator)  
**Authorization**: None (Public endpoint)

### Lambda

**Name**: Accounts_Merchants_SignUp  
**Runtime**: Node.js 20.x  
**Handler**: handler  
**Files**:

- Construct: `backend/lib/lambda/accounts/post/construct.js`
- Handler: `backend/src/lambda/accounts/post/handler.js`

**Environment Variables**:

- USER_POOL_ID: Cognito User Pool ID
- USER_POOL_CLIENT_ID: Cognito User Pool Client ID

**IAM Permissions**:

- cognito-idp:SignUp (Allow)
- cognito-idp:AdminAddUserToGroup (Allow on User Pool ARN)

### Custom Email Templates

**Implementation**: Custom Message Lambda

**Trigger**: /accounts/sign-up

**Files**:

- Handler: `backend/src/lambda/auth/custom-message/handler.js`
- Construct: `backend/lib/lambda/auth/custom-message/construct.js`
- Configuration: `backend/lib/auth/user-pool/stack.js`

**Features**:

- Different email templates for merchants and customers
- HTML-formatted emails with styling
- Custom subject lines based on user type
- Merchant-specific messaging and branding
- Support for verification emails and password reset emails
- Responsive design for mobile devices

## Frontend

### Routes:

- `/merchants/sign-up`: Multi-step merchant registration form
- `/auth/verification-sent`: Verification email confirmation page
- `/auth/confirm-sign-up`: Code verification page

### Sign-up Page

**Files**:

- Component: `sveltekit/src/routes/merchants/sign-up/+page.svelte`
- Server Actions: `sveltekit/src/routes/merchants/sign-up/+page.server.js`
- Validation Schema: `sveltekit/src/routes/merchants/sign-up/schema.js`

**Features**:

- Multi-step form with 3 steps:
  - Step 1: Account Information (business name, email, password)
  - Step 2: Business Information (registration number, year, business type, website)
  - Step 3: Contact Information (address, phone, primary contact, product categories)
- Client-side validation using Svelte 5 runes
- Server-side validation using Zod schemas
- Progress indicator showing current step
- Form state persistence between steps using cookies
- Responsive design using Tailwind CSS
- Error handling and feedback

**Implementation**:

- Uses Svelte 5 runes for reactivity:
  - `$state()` for reactive variables
  - `$derived()` for computed values
  - `$effect()` for side effects
- Follows universal component format (no separate script/style sections)
- Implements progressive enhancement with server-side form handling
- Uses Tailwind CSS for styling
- Communicates with backend API through merchant service

### Verification Sent Page

**Files**:

- Component: `sveltekit/src/routes/auth/verification-sent/+page.svelte`
- Server Load: `sveltekit/src/routes/auth/verification-sent/+page.server.js`

**Features**:

- Confirmation that account was created successfully
- Instructions to check email for verification code
- Countdown timer for code expiration (5 minutes)
- Buttons to:
  - Enter verification code
  - Resend verification code
  - Go to sign-in
- Adapts messaging based on user type (merchant or customer)
- Secure access (redirects if no pending confirmation)

**Implementation**:

- Uses Svelte 5 runes for reactivity
- Loads email and user type data from cookies
- Implements countdown timer with cleanup on component unmount
- Uses Tailwind CSS for responsive design
- Provides clear user guidance on next steps

### API Integration

**Files**:

- Service: `sveltekit/src/lib/services/api/merchantService.js`

**Features**:

- Handles API communication between frontend and backend
- Supports both real API and mock API for development
- Standardized error handling
- Type definitions using JSDoc

**Implementation**:

- `signUp()` function sends merchant data to backend API
- Handles success and error responses
- Returns standardized response format
- Supports development with mock data

### Validation Schema

**Files**:

- Frontend: `sveltekit/src/routes/merchants/sign-up/schema.js`
- Backend: `backend/lib/api/http/endpoints/merchants/account/sign-up/schema.js`

**Features**:

- Step-specific validation schemas
- Comprehensive field validation
- Custom error messages
- Type safety

**Implementation**:

- Frontend: Uses Zod for form validation with three schemas:
  - `step1Schema`: Validates account information
  - `step2Schema`: Validates business information
  - `step3Schema`: Validates contact information
- Backend: Uses "JSON schema draft 4" to generate Schema for API Gateway validation

## Integration Points

1. **Frontend to Backend**:

   - SvelteKit form submits to page server action
   - Server action calls merchant service API
   - API Gateway validates request using schema
   - Lambda processes request and creates Cognito user

2. **Email Verification Flow**:

   - Cognito triggers custom message Lambda
   - Custom email sent based on user type
   - User redirected to verification sent page
   - User enters code on confirm sign-up page

3. **Post-Verification**:
   - User status changes from UNCONFIRMED to CONFIRMED
   - User can sign in with verified credentials
   - User receives follow-up instructions for document verification
