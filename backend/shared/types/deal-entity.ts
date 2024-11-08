/**
 * Represents a Deal entity as stored in the database.
 */
export type DealEntity = {
  /**
   * Unique identifier for the deal.
   */
  PK: string;
  /**
   * Sort key for the deal.
   */
  SK: string;
  /**
   * Type of entity (always "Deal" for deals).
   */
  EntityType: string;
  /**
   * Unique ID for the deal.
   */
  Id: string;
  /**
   * Title of the deal.
   */
  Title: string;
  /**
   * Original price of the deal.
   */
  OriginalPrice: number;
  /**
   * Discount amount for the deal.
   */
  Discount: number;
  /**
   * Category of the deal.
   */
  Category: string;
  /**
   * Expiration date of the deal.
   */
  Expiration: string;
  /**
   * Merchant ID associated with the deal.
   */
  MerchantId: string;
  /**
   * Logo key for the deal.
   */
  LogoKey: string;
  /**
   * Timestamp when the deal was created.
   */
  CreatedAt: string;
};
