const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const KSUID = require("ksuid");
// const multipart = require('parse-multipart-data');
// const { Buffer } = require('node:buffer');

/** @typedef {import('#types/deal-entity').DealEntity} DealItem */

// Api object provides internal API-related helper functionality
// such as standardized success and error responses
const Api = require("#src/api/_index.js");

// Import the deal schema for validation
const { schema } = require("./schema.js");

// Initialize AWS clients
const s3Client = new S3Client();
const ddbClient = new DynamoDBClient();


exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { merchantId } = event.pathParameters;

  // Parse the environment variables containing stage-specific resource names
  const ddbTableName = process.env.DDB_TABLE_NAME;
  const s3BucketName = process.env.S3_BUCKET_NAME;

  // Parse and validate the multipart form data
  let createDealFormData;
  try {
    createDealFormData = Api.parseAndValidateFormData(event, schema);
  } catch (error) {
    return Api.error(400, error.message);
  }

  // Generate a unique ID for the deal
  const dealId = KSUID.randomSync(new Date()).string;

  // Upload logo to S3
  let logoS3Key = "";
  const logoUploadResult = await uploadLogoToS3(createDealFormData, dealId, s3BucketName);
  if (!logoUploadResult.success) {
    return Api.error(500, logoUploadResult.error);
  } else {
    logoS3Key = logoUploadResult.logoS3Key
  }

  // Prepare and save deal to DynamoDB
  const saveDealResult = await saveDealToDynamoDB(deal, dealId, merchantId, logoS3Key, ddbTableName);
  if (!saveDealResult.success) {
    return Api.error(500, saveDealResult.error);
  }

  // Return success response
  const successResponse = Api.success({
    message: "Deal successfully created",
    dealId: dealId,
  });
  console.log(`Success Response: ${JSON.stringify(successResponse, null, 2)}`);
  return successResponse;
};



/**
 * Upload the deal logo to S3
 * @param {Object} deal - The deal data
 * @param {string} dealId - The unique deal ID
 * @param {string} s3BucketName - The S3 bucket name
 * @returns {Object} Upload result
 */
async function uploadLogoToS3(deal, dealId, s3BucketName) {

  const logoS3Key = `merchants/${deal.merchantId}/deals/DEAL#${dealId}/logo/${deal.logo.filename}`;

  try {
    console.log(`(+) Uploading logo to Bucket: ${s3BucketName}`);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3BucketName,
        Key: logoS3Key,
        Body: deal.logo.data,
        ContentType: deal.logo.contentType,
      })
    );
    return { success: true, logoS3Key: logoS3Key };
  } catch (error) {
    console.error("S3 Error:", error);
    return { success: false, error: error.message };
  }
}


/**
 * Save the deal to DynamoDB
 * @param {Object} deal - The deal data
 * @param {string} dealId - The unique deal ID
 * @param {string} logoS3Key - The S3 key for the deal logo
 * @param {string} dbTableName - The DynamoDB table name
 * @returns {Object} Save result
 */
async function saveDealToDynamoDB(deal, dealId, merchantId, logoS3Key, ddbTableName) {
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
    MerchantId: merchantId,
    LogoKey: logoS3Key,
    CreatedAt: new Date().toISOString(),
  };
  console.log("dealItem: " + JSON.stringify(dealItem, null, 2));

  try {
    console.log("(+) Saving deal to DynamoDB...")
    await ddbClient.send(
      new PutItemCommand({
        TableName: ddbTableName,
        Item: marshall(dealItem),
      })
    );
    return { success: true };
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return { success: false, error: "Error saving deal: " + error.message };
  }
}