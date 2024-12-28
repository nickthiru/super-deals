const { Stack, CfnOutput } = require("aws-cdk-lib");
const { Role, FederatedPrincipal, PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");
const { CfnIdentityPoolRoleAttachment } = require("aws-cdk-lib/aws-cognito");

class RolesStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      storage,
    } = props;

    this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': auth.dev.identityPool.pool.ref
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
          'cognito-identity.amazonaws.com:aud': auth.dev.identityPool.pool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'unauthenticated'
        }
      },
        'sts:AssumeRoleWithWebIdentity'
      )
    });

    this.merchantRole = new Role(this, 'CognitoAdminRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': auth.dev.identityPool.pool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated'
        }
      },
        'sts:AssumeRoleWithWebIdentity'
      )
    })
      .addToPolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "s3:PutObject",
        ],
        resources: ["*"], // TODO: arn:${Partition}:s3:::${storage.dev.bucket.bucketName}/${ObjectName}
      }));


    /*** Attachments ***/

    new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: auth.dev.identityPool.pool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn,
        unauthenticated: this.unAuthenticatedRole.roleArn,
      },
      roleMappings: {
        adminsMapping: {
          type: 'Token',
          ambiguousRoleResolution: "AuthenticatedRole",
          identityProvider: `${auth.dev.userPool.pool.userPoolProviderName}:${auth.dev.userPool.poolClient.userPoolClientId}`,
        },
      },
    });
  }
}

module.exports = RolesStack;