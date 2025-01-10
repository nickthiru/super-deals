const { Construct } = require('constructs');
const DealsOAuthPermissionsConstruct = require('./deals/construct');

/**
 * @typedef {Object} OAuthPermissionsProps
 * @property {import('aws-cdk-lib/aws-cognito').IUserPoolResourceServer} dealsResourceServer - Deals Resource Server
 */

/**
 * Main construct for managing OAuth permissions across different services
 * Acts as a container for service-specific permission constructs
 */
class OAuthPermissionsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    const { dealsResourceServer } = props;

    // Deals permissions
    this.deals = new DealsOAuthPermissionsConstruct(this, 'Deals', {
      resourceServer: dealsResourceServer,
    });

    // Future service permissions can be added here
    // Example:
    // this.notifications = new NotificationsOAuthPermissionsConstruct(this, 'Notifications', {
    //   resourceServer: notificationsResourceServer,
    // });
  }
}

module.exports = OAuthPermissionsConstruct;
