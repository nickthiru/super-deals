const { Stack } = require("aws-cdk-lib");
const { HttpStack } = require("./http/stack");

// const { WebSocketStack } = require("./websocket/stack");

class ApiStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      lambdaArns,
    } = props;

    this.http = new HttpStack(this, "HttpStack", {
      lambdaArns,
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