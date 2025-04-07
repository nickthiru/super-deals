export type MerchantSignUpData = {
    /**
     * - The name of the merchant's business
     */
    businessName: string;
    /**
     * - Merchant email address
     */
    email: string;
    /**
     * - Merchant password
     */
    password: string;
    /**
     * - Business registration number
     */
    registrationNumber: string;
    /**
     * - Year the business was registered
     */
    yearOfRegistration: number;
    /**
     * - Type of business (e.g., 'retail', 'wholesale')
     */
    businessType: string;
    /**
     * - Optional business website
     */
    website?: string | undefined;
    /**
     * - Business phone number
     */
    phone: string;
    /**
     * - Business address
     */
    address: MerchantAddress;
    /**
     * - Primary contact information
     */
    primaryContact: MerchantPrimaryContact;
    /**
     * - Categories of products the merchant sells
     */
    productCategories: string[];
};
export type MerchantAddress = {
    /**
     * - Building number
     */
    buildingNumber: string;
    /**
     * - Street name
     */
    street: string;
    /**
     * - City
     */
    city: string;
    /**
     * - State or province
     */
    state: string;
    /**
     * - ZIP or postal code
     */
    zip: string;
    /**
     * - Country
     */
    country: string;
};
export type MerchantPrimaryContact = {
    /**
     * - Contact person's name
     */
    name: string;
    /**
     * - Contact person's email
     */
    email: string;
    /**
     * - Contact person's phone number
     */
    phone: string;
};
export type MerchantSignUpResponse = {
    /**
     * - Merchant ID
     */
    id: string;
    /**
     * - Merchant email
     */
    email: string;
    /**
     * - Account status
     */
    status: string;
    /**
     * - Response message
     */
    message: string;
    /**
     * - Verification code (only in development mode)
     */
    verificationCode?: string | undefined;
};
export type Step1FormData = {
    /**
     * - Business name
     */
    businessName: string;
    /**
     * - Email address
     */
    email: string;
    /**
     * - Password
     */
    password: string;
    /**
     * - Password confirmation
     */
    confirmPassword: string;
    /**
     * - Current form step
     */
    currentStep: string;
};
export type Step2FormData = {
    /**
     * - Business registration number
     */
    registrationNumber: string;
    /**
     * - Year of registration
     */
    yearOfRegistration: string;
    /**
     * - Type of business
     */
    businessType: string;
    /**
     * - Optional business website
     */
    website?: string | undefined;
    /**
     * - Current form step
     */
    currentStep: string;
};
export type Step3FormData = {
    /**
     * - Business phone
     */
    phone: string;
    /**
     * - Building number
     */
    buildingNumber: string;
    /**
     * - Street name
     */
    street: string;
    /**
     * - City
     */
    city: string;
    /**
     * - State or province
     */
    state: string;
    /**
     * - ZIP or postal code
     */
    zip: string;
    /**
     * - Country
     */
    country: string;
    /**
     * - Primary contact name
     */
    primaryContactName: string;
    /**
     * - Primary contact email
     */
    primaryContactEmail: string;
    /**
     * - Primary contact phone
     */
    primaryContactPhone: string;
    /**
     * - Product categories
     */
    productCategories: string[];
    /**
     * - Terms and conditions acceptance
     */
    acceptTerms: boolean;
    /**
     * - Current form step
     */
    currentStep: string;
};
