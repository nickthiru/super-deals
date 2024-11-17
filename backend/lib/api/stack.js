const { Stack } = require("aws-cdk-lib");
const { HttpStack } = require("./http/stack");

// const { WebSocketStack } = require("./websocket/stack");

class ApiStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'ApiStack'");

    const {
      // auth,
      lambda,
    } = props;

    new HttpStack(this, "HttpStack", {
      // auth,
      lambda,
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