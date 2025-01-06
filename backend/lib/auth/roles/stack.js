const { Stack, CfnOutput } = require("aws-cdk-lib");
const { Role, FederatedPrincipal, PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");
const { CfnIdentityPoolRoleAttachment } = require("aws-cdk-lib/aws-cognito");

class RolesStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      storage,
      userPool,
      identityPool,
    } = props;

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

    this.merchants = new Role(this, 'CognitoMerchantsRole', {
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
    })
      .addToPolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "s3:PutObject",
        ],
        resources: [`${storage.s3Bucket.bucketArn}/*`], // TODO: arn:${Partition}:s3:::${storage.bucket.bucketName}/${ObjectName}
        // conditions: {
        //   "DateLessThan": {
        //     "aws:CurrentTime": '${aws:CurrentTime+3600}' // 1 hour from now
        //   }
        // },
      }));


    /*** Permission for Switch to Role ***/

    new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: identityPool.pool.ref,
      roles: {
        authenticated: this.authenticated.roleArn,
        unauthenticated: this.unAuthenticated.roleArn,
      },
      roleMappings: {
        adminsMapping: {
          type: 'Token',
          ambiguousRoleResolution: "AuthenticatedRole",
          identityProvider: `${userPool.pool.userPoolProviderName}:${userPool.poolClient.userPoolClientId}`,
        },
      },
    });
  }
}

module.exports = RolesStack;