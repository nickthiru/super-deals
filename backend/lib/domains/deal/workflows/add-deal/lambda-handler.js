const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const KSUID = require("ksuid");
const multipart = require('parse-multipart-data');
const { Buffer } = require('node:buffer');
/** @typedef {import('#shared/types/deal').Deal} DealItem */

// Api object provides internal API-related helper functionality
// such as standardized success and error responses
const Api = require("#src/utils/api/_service.js");

// Import the deal schema for validation
const getDealSchema = require("#schemas/deal.schema.js");

// Initialize AWS clients
const s3Client = new S3Client();
const ddbClient = new DynamoDBClient();

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // Parse and validate the multipart form data
  const deal = parseMultipartFormData(event);
  const validationResult = await validateDealData(deal);
  if (!validationResult.success) {
    return Api.error(400, validationResult.error, validationResult.details);
  }

  // Generate a unique ID for the deal
  const dealId = KSUID.randomSync(new Date()).string;

  // Upload logo to S3
  const logoUploadResult = await uploadLogoToS3(deal, dealId);
  if (!logoUploadResult.success) {
    return Api.error(500, logoUploadResult.error);
  }

  // Prepare and save deal to DynamoDB
  const saveDealResult = await saveDealToDynamoDB(deal, dealId, logoUploadResult.logoS3Key);
  if (!saveDealResult.success) {
    return Api.error(500, saveDealResult.error);
  }

  // Return success response
  return Api.success({
    message: "Deal added successfully",
    dealId: dealId,
  });
};

/**
 * Parse multipart form data from the event
 * @param {Object} event - The Lambda event object
 * @returns {Object} The parsed deal data
 */
function parseMultipartFormData(event) {
  const decodedBody = Buffer.from(event.body, 'base64');
  const boundary = event.headers["content-type"].split("boundary=")[1];
  const parts = multipart.parse(decodedBody, boundary);

  const deal = {};
  for (let part of parts) {
    if (part.filename) {
      deal.logo = {
        filename: part.filename,
        contentType: part.type,
        data: part.data
      };
    } else {
      deal[part.name] = part.data.toString();
    }
  }
  return deal;
}

/**
 * Validate the deal data against the schema
 * @param {Object} deal - The deal data to validate
 * @returns {Object} Validation result
 */
async function validateDealData(deal) {
  const dealSchema = getDealSchema();
  try {
    await dealSchema.parseAsync(deal);
    return { success: true };
  } catch (error) {
    console.error("Validation Error:", error);
    if (error.errors && error.errors.length > 0) {
      // Return detailed error messages from the schema
      return {
        success: false,
        error: "Validation failed",
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      };
    }
    // Fallback for unexpected error structure
    return { success: false, error: "Invalid deal data: " + error.message };
  }
}

/**
 * Upload the deal logo to S3
 * @param {Object} deal - The deal data
 * @param {string} dealId - The unique deal ID
 * @returns {Object} Upload result
 */
async function uploadLogoToS3(deal, dealId) {
  const logoS3Key = `merchants/${deal.merchantId}/deals/${dealId}/logos/${deal.logo.filename}`;
  try {
    console.log("(+) Uploading logo to Bucket...")
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: logoS3Key,
        Body: deal.logo.data,
        ContentType: deal.logo.contentType,
      })
    );
    return { success: true, logoS3Key };
  } catch (error) {
    console.error("S3 Error:", error);
    return { success: false, error: "Error uploading logo: " + error.message };
  }
}

/**
 * Save the deal to DynamoDB
 * @param {Object} deal - The deal data
 * @param {string} dealId - The unique deal ID
 * @param {string} logoS3Key - The S3 key for the deal logo
 * @returns {Object} Save result
 */
async function saveDealToDynamoDB(deal, dealId, logoS3Key) {
  /** @type {DealItem} */
  const dealItem = {
    PK: `DEAL#${dealId}`,
    SK: `DEAL#${dealId}`,
    EntityType: "Deal",
    Id: dealId,
    Title: deal.title,
    OriginalPrice: parseFloat(deal.originalPrice),
    Discount: parseFloat(deal.discount),
    Category: deal.category,
    Expiration: deal.expiration,
    MerchantId: deal.merchantId,
    LogoKey: logoS3Key,
    CreatedAt: new Date().toISOString(),
  };
  console.log("dealItem: " + JSON.stringify(dealItem, null, 2));

  try {
    console.log("(+) Saving deal to DynamoDB...")
    await ddbClient.send(
      new PutItemCommand({
        TableName: process.env.DDB_TABLE_NAME,
        Item: marshall(dealItem),
      })
    );
    return { success: true };
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return { success: false, error: "Error saving deal: " + error.message };
  }
}