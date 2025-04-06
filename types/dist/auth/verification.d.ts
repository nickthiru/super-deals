export type VerificationResponse = {
    /**
     * - Whether verification was successful
     */
    success: boolean;
    /**
     * - Response message
     */
    message: string;
};
export type ResendVerificationResponse = {
    /**
     * - Whether resend was successful
     */
    success: boolean;
    /**
     * - Response message
     */
    message: string;
};
export type VerificationFormData = {
    /**
     * - User email address
     */
    email: string;
    /**
     * - Verification code
     */
    code: string;
    /**
     * - Type of user (e.g., 'merchant', 'consumer')
     */
    userType: string;
};
