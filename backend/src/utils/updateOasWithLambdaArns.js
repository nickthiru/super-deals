const { clone } = require("ramda");

module.exports = function updateOasWithLambdaArns(oasObject, lambdaFunctions, region) {
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
          const lambdaFunctionNameMatch = integration.uri.match(/functions\/\$\{([^}]+)\}/);
          if (lambdaFunctionNameMatch) {
            const lambdaFunctionName = lambdaFunctionNameMatch[1];
            const lambdaArn = lambdaFunctions.get(lambdaFunctionName);
            if (lambdaArn) {
              integration.uri = integration.uri.replace(`functions/\${${lambdaFunctionName}}`, `functions/${lambdaArn}`);
            }
          }
          integration.uri = integration.uri.replace('${AWS::Region}', region);
        }
      }
    });
  });

  return updatedOasObject;
}