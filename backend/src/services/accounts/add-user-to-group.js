const {
  AdminAddUserToGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

/**
 * // Add user to the Cognito group
 * @param {*} client
 * @param {*} props
 * @returns
 */
async function addUserToGroup(client, props) {
  const addUserToGroupResponse = await client.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: props.email,
      GroupName: "Merchants",
    })
  );

  console.log(
    "(+) addUserToGroupResponse: " +
      JSON.stringify(addUserToGroupResponse, null, 2)
  );

  return addUserToGroupResponse;
}

module.exports = addUserToGroup;
