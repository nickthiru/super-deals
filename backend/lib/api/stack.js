const { Stack } = require("aws-cdk-lib");
const { HttpStack } = require("./http/stack");

// const { WebSocketStack } = require("./websocket/stack");

class ApiStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      storage,
      db,
    } = props;

    new HttpStack(this, "HttpStack", {
      auth,
      storage,
      db,
    });

    // this.webSocket = new WebSocketStack(this, "WebSocketStack", {
    //   // auth,
    //   // lambda,
    //   // sqs,
    //   storage,
    // });
  }
}

module.exports = { ApiStack };