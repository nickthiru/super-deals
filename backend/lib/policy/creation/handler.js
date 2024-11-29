const { VerifiedPermissionsClient, CreatePolicyCommand } = require("@aws-sdk/client-verifiedpermissions");
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const client = new VerifiedPermissionsClient({ region: 'us-east-1' });

  const policyFilePath = path.join(__dirname, '..', 'policies', event.ResourceProperties.PolicyFile);
  const policyDocument = JSON.parse(fs.readFileSync(policyFilePath, 'utf8'));

  const params = {
    PolicyStoreId: event.ResourceProperties.PolicyStoreId,
    PolicyDocument: policyDocument
  };

  const command = new CreatePolicyCommand(params);

  try {
    const response = await client.send(command);
    console.log("Policy created:", response);
    return {
      Status: 'SUCCESS',
      PhysicalResourceId: response.PolicyId,
      Data: response
    };
  } catch (error) {
    console.error("Error creating policy:", error);
    return {
      Status: 'FAILED',
      Reason: error.message
    };
  }
};