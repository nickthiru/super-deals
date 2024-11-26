const { handler } = require("#lib/domain/deals/workflow/add-deal/lambda-handler.js");
const fs = require("fs");

const eventDataFilePath = "lib/domain/deals/workflow/add-deal/lambda-event-test-data.json";

const main = async () => {

  const data = fs.readFileSync(eventDataFilePath);
  const event = JSON.parse(data);
  // console.log("event: " + JSON.stringify(event, null, 2));

  // const response = await handler({}, {});

  const response = await handler(event, {});

  // console.log("(+) response: " + JSON.stringify(response, null, 2));
}

main();