const { Stack, CfnOutput } = require("aws-cdk-lib");
const { CfnIdentityPool, CfnIdentityPoolRoleAttachment } = require("aws-cdk-lib/aws-cognito");
const { Role, FederatedPrincipal } = require("aws-cdk-lib/aws-iam");


class RolesStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
    } = props;

    this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
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

    this.unAuthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
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

    this.adminRole = new Role(this, 'CognitoAdminRole', {
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

    new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: auth.identityPool.pool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn,
        unauthenticated: this.unAuthenticatedRole.roleArn,
      },
      roleMappings: {
        adminsMapping: {
          type: 'Token',
          ambiguousRoleResolution: "AuthenticatedRole",
          identityProvider: `${auth.userPool.pool.userPoolProviderName}:${auth.userPool.poolClient.userPoolClientId}`
        }
      }
    });

    /*** Outputs ***/

    // For web client Auth service
    // new CfnOutput(this, `IdentityPoolId-${stage}`, {
    //   value: this.identityPool.ref,
    //   description: "Identity Pool ID",
    //   exportName: `IdentityPoolId${stage}`
    // });
  }
}

module.exports = { RolesStack };