/**
 * Represents the shape of the form that the merchant uses to add a deal. This schema for frontend validation.
 */
export type DealFormSchema = {
	/**
	 * Merchant ID associated with the deal.
	 */
	merchantId: string;
	/**
	 * Title of the deal.
	 */
	title: string;
	/**
	 * Original price of the deal.
	 */
	originalPrice: number;
	/**
	 * Discount amount for the deal.
	 */
	discount: number;
	/**
	 * Logo file for the deal.
	 */
	logo: File;
	/**
	 * Category of the deal.
	 */
	category:
		| 'foodDrink'
		| 'bathroom'
		| 'jewelery'
		| 'sports'
		| 'tech'
		| 'auto'
		| 'entertainment'
		| 'travel';
	/**
	 * Expiration date of the deal.
	 */
	expiration: string;
};
