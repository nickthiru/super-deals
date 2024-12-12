const { Stack } = require("aws-cdk-lib");
const { SpecRestApi, ApiDefinition } = require("aws-cdk-lib/aws-apigateway");

const yaml = require('yaml');
const oasResolver = require('oas-resolver');
const fs = require('fs');
const path = require('path');

const Utils = require('#src/utils/_index.js');

class HttpStack extends Stack {
  constructor(scope, id, props) {
    const {
      OasOpIdsToLambdaArns,
    } = props;

    super(scope, id, props);
    this.init(OasOpIdsToLambdaArns);
  }

  async init(OasOpIdsToLambdaArns) {
    const region = process.env.CDK_DEFAULT_REGION;
    console.log(`Region: ${region}`);

    // Upade OAS with lambda ARNs
    const oasFile = "../../../oas/openapi.yml";
    const resolvedOas = await loadAndResolveOas(oasFile);
    const oasObjectWithLambdaArns = this.updateOasAwsIntegrationsWithLambdaArns(resolvedOas.openapi, OasOpIdsToLambdaArns, region);

    // this.restApi = new SpecRestApi(this, "RestApi", {
    //   apiDefinition: ApiDefinition.fromInline(oasObjectWithLambdaArns),
    //   cloudWatchRole: true,
    // });

    console.log("oasObjectWithLambdaArns: " + JSON.stringify(oasObjectWithLambdaArns, null, 2));
  }

  updateOasAwsIntegrationsWithLambdaArns(oasObject, OasOpIdsToLambdaArns, region) {
    if (!oasObject || !oasObject.paths) {
      console.error('Invalid OAS object:', oasObject);
      return oasObject;
    }

    const updatedOasObject = clone(oasObject);

    Object.keys(updatedOasObject.paths).forEach(path => {
      Object.keys(updatedOasObject.paths[path]).forEach(method => {
        if (method !== 'options') {
          const integration = updatedOasObject.paths[path][method]['x-amazon-apigateway-integration'];
          if (integration && integration.uri) {
            const OasOpIdNameMatch = integration.uri.match(/functions\/\$\{([^}]+)\}/);
            if (OasOpIdNameMatch) {
              const OasOpIdName = OasOpIdNameMatch[1];
              const lambdaArn = OasOpIdsToLambdaArns.get(OasOpIdName);
              if (lambdaArn) {
                integration.uri = integration.uri.replace(`functions/\${${OasOpIdName}}`, `functions/${lambdaArn}`);
              }
            }
            integration.uri = integration.uri.replace('${AWS::Region}', region);
          }
        }
      });
    });

    return updatedOasObject;
  }
}

async function loadAndResolveOas(oasFile) {
  const oasContent = fs.readFileSync(path.resolve(__dirname, oasFile), 'utf8');
  const input = yaml.parse(oasContent);
  const source = path.resolve(__dirname, oasFile);
  const options = {
    resolveInternal: true,
  };
  const resolvedOas = await oasResolver.resolve(input, source, options);
  // const yamlOutput = yaml.stringify(resolvedOas.openapi);
  // console.log(yamlOutput);
  return resolvedOas;
}

module.exports = { HttpStack };