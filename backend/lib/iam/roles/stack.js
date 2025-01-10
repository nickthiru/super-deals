const { Stack, CfnOutput, CfnJson } = require("aws-cdk-lib");
const { Role, FederatedPrincipal, PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");
const { CfnIdentityPoolRoleAttachment } = require("aws-cdk-lib/aws-cognito");

class RolesStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
    } = props;

    this.authenticated = new Role(this, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': auth.identityPool.pool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated'
        }
      },
        'sts:AssumeRoleWithWebIdentity'
      )
    });

    this.unAuthenticated = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': auth.identityPool.pool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'unauthenticated'
        }
      },
        'sts:AssumeRoleWithWebIdentity'
      )
    });

    this.merchant = new Role(this, 'CognitoMerchantRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': auth.identityPool.pool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated'
        }
      },
        'sts:AssumeRoleWithWebIdentity'
      )
    })

    /*** Role Attachments ***/

    // Create a CfnJson resource to handle the dynamic provider name
    const roleMappingsKey = new CfnJson(this, 'ProviderNameKey', {
      value: auth.userPool.pool.userPoolProviderName
    });

    new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: auth.identityPool.pool.ref,
      roles: {
        authenticated: this.authenticated.roleArn,
        unauthenticated: this.unAuthenticated.roleArn,
      },
      roleMappings: {
        [roleMappingsKey.ref]: {
          type: 'Rules',
          ambiguousRoleResolution: 'Deny',
          identityProvider: `${auth.userPool.pool.userPoolProviderName}:${auth.userPool.poolClient.userPoolClientId}`,
          rulesConfiguration: {
            rules: [
              {
                claim: 'cognito:groups',
                matchType: 'Contains',
                value: 'Merchants',
                roleArn: this.merchant.roleArn
              }
            ]
          }
        }
      }
    });
  }
}

module.exports = RolesStack;