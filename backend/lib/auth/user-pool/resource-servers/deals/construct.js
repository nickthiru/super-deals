const { Construct } = require("constructs");
const { UserPoolResourceServer, ResourceServerScope } = require("aws-cdk-lib/aws-cognito");

/**
 * @typedef {Object} DealsResourceServerProps
 * @property {import('aws-cdk-lib/aws-cognito').UserPool} userPool - Cognito User Pool
 * @property {string} envName - Environment name for resource identification
 */

/**
 * Construct for managing the Deals Resource Server in Cognito
 * Handles scope definitions and resource server configuration
 */
class DealsResourceServerConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    const { userPool, envName } = props;

    // Define scopes for Deals API
    this.scopes = [
      new ResourceServerScope({
        scopeName: 'read',
        scopeDescription: 'Read access to deals'
      }),
      new ResourceServerScope({
        scopeName: 'write',
        scopeDescription: 'Write access to deals'
      }),
      new ResourceServerScope({
        scopeName: 'delete',
        scopeDescription: 'Delete access to deals'
      })
    ];

    // Create Resource Server
    this.resourceServer = new UserPoolResourceServer(this, 'ResourceServer', {
      userPool,
      identifier: `deals-${envName}`, // Include environment name in identifier
      scopes: this.scopes,
    });
  }

  /**
   * Get OAuth scopes for use in app client configuration
   * @returns {string[]} Array of OAuth scope strings
   */
  getOAuthScopes() {
    return this.scopes.map(scope => `deals/${scope.scopeName}`);
  }
}

module.exports = DealsResourceServerConstruct;
