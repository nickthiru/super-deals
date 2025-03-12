const { Stack, RemovalPolicy } = require("aws-cdk-lib");
const { TableV2, AttributeType, BillingMode } = require("aws-cdk-lib/aws-dynamodb");

class DbStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // We can use envName for resource naming or other environment-specific configurations
    const { envName } = props;

    this.table = new TableV2(this, "TableV2", {
      partitionKey: {
        name: "PK",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "SK",
        type: AttributeType.STRING
      },
      globalSecondaryIndexes: [
        {
          indexName: "GSI1",
          partitionKey: {
            name: "GSI1PK",
            type: AttributeType.STRING,
          },
          sortKey: {
            name: "GSI1SK",
            type: AttributeType.STRING,
          },
        },
      ],
      removalPolicy: RemovalPolicy.RETAIN, // Default to RETAIN for safety
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  };
}

module.exports = DbStack;