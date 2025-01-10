const { Stack } = require("aws-cdk-lib");

const HttpStack = require("./http/stack");
// const { WebSocketStack } = require("./websocket/stack");

/**
 * @typedef {Object} ApiStackProps
 * @property {string} stage - Stage name (e.g., 'dev', 'prod')
 * @property {import('../auth/stack').AuthStack} auth - Auth stack
 * @property {import('../lambda/stack').LambdaStack} lambda - Lambda stack
 * @property {import('../permissions/stack').PermissionsStack} permissions - Permissions stack
 */

class ApiStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      stage,
      auth,
      lambda,
      permissions,
    } = props;

    this.http = new HttpStack(this, "HttpStack", {
      stage,
      auth,
      lambda,
      permissions,
    });

    // this.webSocket = new WebSocketStack(this, "WebSocketStack", {
    //   // auth,
    //   // lambda,
    //   // sqs,
    //   storage,
    // });
  }
}

module.exports = ApiStack;