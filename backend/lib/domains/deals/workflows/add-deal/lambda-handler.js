const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const KSUID = require("ksuid");
const multipart = require('parse-multipart-data');
const { Buffer } = require('node:buffer');
/** @typedef {import('#shared/types/deal').DealItem} DealItem */

const Api = require("#src/utils/api/service.js");
const getDealSchema = require("#schemas/deal.schema.js").default;

const s3Client = new S3Client();
const ddbClient = new DynamoDBClient();


exports.handler = async (event) => {
  // console.log("Inside 'lib/domain/deals/workflow/add-deal/lambda-handler.js'");
  // console.log("process.env: \n" + JSON.stringify(process.env, null, 2));
  console.log("event: \n" + JSON.stringify(event, null, 2));

  // Decode Base64 Event Body
  let decodedBody = atob(event.body);

  // Get boundary
  const contentType = event.headers["content-type"];
  const boundaryStartIdx = contentType.indexOf("=") + 1;
  const boundary = contentType.slice(boundaryStartIdx);

  // Parse multipart form data
  const parts = multipart.parse(Buffer.from(decodedBody), boundary);

  // Extract deal data from parts
  const deal = {};
  for (let part of parts) {
    if (part.filename) {
      // Handle file upload (logo)
      deal.logo = {
        filename: part.filename,
        contentType: part.type,
        data: part.data
      };
    } else {
      // Handle other form fields
      deal[part.name] = part.data.toString();
    }
  }

  // Validate the deal data
  const dealSchema = getDealSchema();
  try {
    await dealSchema.parseAsync(deal);
  } catch (error) {
    console.error("Validation Error:", error);
    return Api.error(400, "Invalid deal data: " + error.message);
  }

  // Generate a new KSUID for the deal
  const ksuid = KSUID.randomSync(new Date());
  const dealId = ksuid.string;

  // Upload logo to S3
  const logoS3Key = `merchants/${deal.merchantId}/deals/${dealId}/logos/${deal.logo.filename}`;
  try {
    console.log("(+) Saving to Bucket...")
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: logoS3Key,
        Body: deal.logo.data,
        ContentType: deal.logo.contentType,
      })
    );
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return Api.error(500, "Failed to upload logo");
  }

  // Prepare deal item for DynamoDB
  /** @type {DealItem} */
  const dealItem = {
    PK: `DEAL#${dealId}`,
    SK: `DEAL#${dealId}`,
    EntityType: "Deal",
    Id: `${dealId}`,
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

  // Save Deal to DynamoDB
  try {
    console.log("(+) Saving to DDB...");
    await ddbClient.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(dealItem),
      })
    );
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return Api.error(500, "Failed to save deal");
  }

  return Api.success({ message: "Deal added successfully", dealId });

  // return prepareResponse();
}



// function getEventData(event) {
//   console.log("Inside 'getEventData()'");

//   const body = JSON.parse(event.body);
//   console.log("(+) body.Username: " + body.Username);
//   console.log("(+) body.Password: " + body.Password);
//   console.log("(+) body.EmailAddress: " + body.EmailAddress);

//   const username = body.Username;
//   const password = body.Password;
//   const emailAddress = body.EmailAddress;
//   console.log("(+) username: " + username);
//   console.log("(+) password: " + password);
//   console.log("(+) emailAddress: " + emailAddress);

//   return {
//     username,
//     password,
//     emailAddress,
//   };
// }


// function prepareResponse() {
//   // console.log("Inside 'prepareResponse()'");

//   const corsHeader = Api.addCorsHeader();
//   // console.log("(+) corsHeadear: " + JSON.stringify(corsHeader));

//   const headers = {
//     ...corsHeader,
//   };
//   // console.log("(+) headers: " + JSON.stringify(headers));

//   const body = JSON.stringify({
//     Message: "Resource created"
//   });
//   console.log("(+) body: " + JSON.stringify(body));

//   return {
//     statusCode: 201,
//     headers: headers,
//     body: body,
//   };
// }