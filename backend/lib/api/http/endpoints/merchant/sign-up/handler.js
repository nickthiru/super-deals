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
const validateData = require("#src/utils/validateData.js");


// Initialize AWS clients
// const s3Client = new S3Client();
// const ddbClient = new DynamoDBClient();


exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const stage = event.headers['X-Stage'] || 'dev';

  // Parse the environment variables containing stage-specific resource names
  // const ddbTableNames = JSON.parse(process.env.DDB_TABLE_NAMES);
  // const s3BucketNames = JSON.parse(process.env.S3_BUCKET_NAMES);

  // const dbTableName = ddbTableNames[stage];
  // const s3BucketName = s3BucketNames[stage];

  // Parse and validate the multipart form data
  const signUpFormData = Api.parseMultipartFormData(event);
  const validationResult = await validateData(schema, signUpFormData);
  if (!validationResult.success) {
    return Api.error(400, validationResult.error, validationResult.details);
  }

  // Return success response
  const successResponse = Api.success({
    message: "User successfully created",
    userId: userId,
  });
  console.log(`Success Response: ${JSON.stringify(successResponse, null, 2)}`);
  return successResponse;
};
