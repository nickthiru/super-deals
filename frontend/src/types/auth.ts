/**
 * Represents a merchant user in the application.
 */
export type MerchantUser = {
  /**
   * Unique identifier for the user from Cognito.
   */
  sub: string;
  /**
   * Email address of the merchant.
   */
  email: string;
  /**
   * Business name of the merchant.
   */
  businessName: string;
  /**
   * Email verification status.
   */
  email_verified: boolean;
  /**
   * Type of user (always "merchant" for merchants).
   */
  userType: 'merchant';
  /**
   * Timestamp when the user was created.
   */
  createdAt: string;
  /**
   * Timestamp when the user was last updated.
   */
  updatedAt: string;
};

/**
 * Represents a customer user in the application.
 */
export type CustomerUser = {
  /**
   * Unique identifier for the user from Cognito.
   */
  sub: string;
  /**
   * Email address of the customer.
   */
  email: string;
  /**
   * First name of the customer.
   */
  firstName: string;
  /**
   * Last name of the customer.
   */
  lastName: string;
  /**
   * Email verification status.
   */
  email_verified: boolean;
  /**
   * Type of user (always "customer" for customers).
   */
  userType: 'customer';
  /**
   * Timestamp when the user was created.
   */
  createdAt: string;
  /**
   * Timestamp when the user was last updated.
   */
  updatedAt: string;
};

/**
 * Union type for all user types in the application.
 */
export type User = MerchantUser | CustomerUser;

/**
 * Shape of the merchant sign-up form.
 */
export type MerchantSignUpForm = {
  /**
   * Email address for the merchant account.
   */
  email: string;
  /**
   * Password for the merchant account.
   */
  password: string;
  /**
   * Password confirmation for validation.
   */
  confirmPassword: string;
  /**
   * Business name for the merchant.
   */
  businessName: string;
};

/**
 * Shape of the customer sign-up form.
 */
export type CustomerSignUpForm = {
  /**
   * Email address for the customer account.
   */
  email: string;
  /**
   * Password for the customer account.
   */
  password: string;
  /**
   * Password confirmation for validation.
   */
  confirmPassword: string;
  /**
   * First name of the customer.
   */
  firstName: string;
  /**
   * Last name of the customer.
   */
  lastName: string;
};

/**
 * Shape of the sign-in form (same for both merchants and customers).
 */
export type SignInForm = {
  /**
   * Email address for authentication.
   */
  email: string;
  /**
   * Password for authentication.
   */
  password: string;
};
