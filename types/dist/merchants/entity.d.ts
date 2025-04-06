export type Merchant = {
    /**
     * - Merchant ID
     */
    id: string;
    /**
     * - Business name
     */
    businessName: string;
    /**
     * - Business registration number
     */
    registrationNumber: string;
    /**
     * - Year of business registration
     */
    yearOfRegistration: number;
    /**
     * - Type of business
     */
    businessType: string;
    /**
     * - Contact email
     */
    email: string;
    /**
     * - Contact phone
     */
    phone: string;
    /**
     * - Business address
     */
    address: string;
    /**
     * - Business city
     */
    city: string;
    /**
     * - Business state/province
     */
    state: string;
    /**
     * - Business country
     */
    country: string;
    /**
     * - Business postal code
     */
    postalCode: string;
    /**
     * - Account status
     */
    status: string;
    /**
     * - Business website (optional)
     */
    website?: string | undefined;
};
export type SignInResponse = {
    /**
     * - Whether sign-in was successful
     */
    success: boolean;
    /**
     * - Merchant ID
     */
    merchantId: string;
    /**
     * - Auth token
     */
    token: string;
    /**
     * - Response message
     */
    message: string;
};
