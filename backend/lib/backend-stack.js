const { Stack } = require("aws-cdk-lib");

const DbStack = require("./db/stack");
const StorageStack = require("./storage/stack");
const AuthStack = require("./auth/stack");
const ApiStack = require("./api/stack");
const PermissionsStack = require("./permissions/stack");
const IamStack = require("./iam/stack");
const SnsStack = require("./sns/stack");
const EmailTemplatesStack = require("./email/stack");
const ServicesStack = require("./services/stack");
const MonitorStack = require("./monitor/stack");

class BackendStack extends Stack {
  /**
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const { envName } = props; // this is mainly for config purposes, i think e.g. used by DbStack to determine retention policy for DDB

    // Set the CDK_ENV environment variable for the config system
    // This makes the environment available to all constructs
    process.env.CDK_ENV = envName;

    const db = new DbStack(this, "DbStack", {
      envName,
    });

    const storage = new StorageStack(this, "StorageStack", {
      envName,
    });

    const sns = new SnsStack(this, "SnsStack", {
      envName,
    });

    const email = new EmailTemplatesStack(this, "EmailTemplatesStack");

    const auth = new AuthStack(this, "AuthStack", {
      envName,
      email,
    });

    const iam = new IamStack(this, "IamStack", {
      auth,
    });

    const permissions = new PermissionsStack(this, "PermissionsStack", {
      iam,
      storage,
      auth,
    });

    const services = new ServicesStack(this, "ServicesStack", {
      envName,
      auth,
      db,
      sns,
      email,
    });

    new ApiStack(this, "ApiStack", {
      envName,
      auth,
      permissions,
      services,
    });

    new MonitorStack(this, "MonitorStack", {
      envName,
    });
  }
}

module.exports = BackendStack;
