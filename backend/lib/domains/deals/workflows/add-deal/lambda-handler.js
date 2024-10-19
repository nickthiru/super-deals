const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const KSUID = require("ksuid");
var multipart = require('parse-multipart-data');
const { Buffer } = require('node:buffer');

const Api = require("#src/utils/api/service.js");


const s3Client = new S3Client();
const ddbClient = new DynamoDBClient();


exports.handler = async (event) => {
  // console.log("Inside 'lib/domain/deals/workflow/add-deal/lambda-handler.js'");
  // console.log("process.env: \n" + JSON.stringify(process.env, null, 2));
  console.log("event: \n" + JSON.stringify(event, null, 2));

  // Decode Base64 Event Body
  let decodedBody = atob(event.body);
  // console.log("decodedBody: " + decodedBody);

  // Get boundary
  const contentType = event.headers["content-type"];
  // console.log("contentType: " + contentType);

  const boundaryStartIdx = contentType.indexOf("=") + 1;
  // console.log("boundaryStartIdx: " + boundaryStartIdx);

  const boundary = contentType.slice(boundaryStartIdx);
  // console.log("boundary: " + boundary);


  // Get Deal data
  const deal = {};

  const parts = multipart.parse(Buffer.from(decodedBody), boundary);
  // console.log("parts: " + JSON.stringify(parts, null, 2));

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    // will be: { filename: 'A.txt', type: 'text/plain', data: <Buffer 41 41 41 41 42 42 42 42> }

    if (!part.filename) {
      // string-type data
      // console.log("part: " + JSON.stringify(part, null, 2));
      deal[`${part.name}`] = part.data.toString()
      // console.log("deal: " + JSON.stringify(deal, null, 2));
    } else {
      // process file type data before adding to data object
      // console.log("part: " + JSON.stringify(part, null, 2));
      // console.log("Setting file type data...");
      const fileDetails = {
        fileName: part.filename,
        type: part.type,
        data: part.data,
      }

      deal[`${part.name}`] = fileDetails;
    }
  }

  // console.log("deal: " + JSON.stringify(deal, null, 2));


  // Validate Category data?


  // Generate KSUID for PK, SK, and Deal
  const ksuId = KSUID.randomSync(new Date());
  // console.log("ksuId: " + ksuId);

  // const logoS3Key = `MERCHANT#${deal.merchantId}/DEAL#${ksuId.string}/LOGO#${deal.logo.fileName}`;
  const logoS3Key = `merchants/${deal.merchantId}/deals/${ksuId.string}/logos/${deal.logo.fileName}`;


  // console.log("logoS3Key: " + logoS3Key);

  // Save Logo image to S3
  try {
    console.log("(+) Saving to Bucket...");

    const result = await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: logoS3Key,
      Body: deal.logo.data,
    }));

    // console.log("(+) result: \n" + JSON.stringify(result, null, 2));

  } catch (error) {
    console.log("(-) Error: " + error);
  };



  // Anything to do for the 'Expiration' data i.e. Date



  const dealData = {
    PK: `DEAL#${ksuId.string}`,
    SK: `DEAL#${ksuId.string}`,
    EntityType: "Deal",
    Id: `${ksuId.string}`,
    Title: deal.title,
    OriginalPrice: deal.originalPrice,
    Discount: deal.discount,
    Category: deal.category,
    Expiration: deal.expiration,
    MerchantId: deal.merchantId,
    LogoKey: logoS3Key,
  };
  console.log("dealData: " + JSON.stringify(dealData, null, 2));

  // Save Deal data to DDB
  try {
    console.log("(+) Saving to DDB...");

    const result = await ddbClient.send(new PutItemCommand({
      TableName: process.env.DDB_TABLE_NAME,
      Item: marshall(dealData),
    }));

    console.log("(+) result: \n" + JSON.stringify(result, null, 2));

  } catch (error) {
    console.log("(-) Error: " + error);
  };

  return prepareResponse();
}


// function getProcessEnvData(process) {
//   console.log("Inside 'getProcessEnvData()'");

//   const bucketName = process.env.S3_BUCKET_NAME;
//   console.log("bucketName: " + bucketName);

//   const tableName = process.env.DDB_TABLE_NAME;
//   console.log("tableName: " + tableName);

//   return {
//     bucketName,
//     tableName,
//   }
// }


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


function prepareResponse() {
  // console.log("Inside 'prepareResponse()'");

  const corsHeader = Api.addCorsHeader();
  // console.log("(+) corsHeadear: " + JSON.stringify(corsHeader));

  const headers = {
    ...corsHeader,
  };
  // console.log("(+) headers: " + JSON.stringify(headers));

  // const body = JSON.stringify({
  //   Message: "Resource created"
  // });
  // console.log("(+) body: " + JSON.stringify(body));

  return {
    statusCode: 201,
    headers: headers,
    // body: body,
  };
}