const { Stack } = require("aws-cdk-lib");
const { Role, FederatedPrincipal, PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");
const { CfnIdentityPoolRoleAttachment } = require("aws-cdk-lib/aws-cognito");

class RolesStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      userPool,
      identityPool,
    } = props;

    // Create authenticated role
    this.authenticated = new Role(this, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': identityPool.pool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated'
        }
      },
        'sts:AssumeRoleWithWebIdentity'
      )
    });

    // Create unauthenticated role
    this.unAuthenticated = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': identityPool.pool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'unauthenticated'
        }
      },
        'sts:AssumeRoleWithWebIdentity'
      )
    });

    // Create merchants role
    this.merchants = new Role(this, 'MerchantsRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': identityPool.pool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated'
        }
      },
        'sts:AssumeRoleWithWebIdentity'
      )
    });

    // Create role mappings
    new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: identityPool.pool.ref,
      roles: {
        authenticated: this.authenticated.roleArn,
        unauthenticated: this.unAuthenticated.roleArn,
      },
      roleMappings: {
        roleMapping: {
          type: 'Token',
          ambiguousRoleResolution: 'AuthenticatedRole',
          identityProvider: `${userPool.pool.userPoolProviderName}:${userPool.poolClient.userPoolClientId}`,
        },
      },
    });
  }
}

module.exports = RolesStack;