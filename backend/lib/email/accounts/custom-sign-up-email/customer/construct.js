const { Construct } = require("constructs");
const {
  ResponsiveEmailTemplate,
  TemplatePart,
} = require("@cloudcomponents/cdk-responsive-email-template");

const template = require("./template.js");

class CustomerSignUpConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) template: \n" + JSON.stringify(template, null, 2));

    const { templateName, subjectPart, textPart, htmlPart, parsingOptions } =
      template;

    new ResponsiveEmailTemplate(this, "ResponsiveEmailTemplate", {
      templateName,
      subjectPart,
      textPart: TemplatePart.fromInline(textPart),
      htmlPart: TemplatePart.fromInline(htmlPart),
      parsingOptions,
    });

    this.templateName = templateName;
  }
}

module.exports = { CustomerSignUpConstruct };
