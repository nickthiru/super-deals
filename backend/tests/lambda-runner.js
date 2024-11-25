const fs = require("fs");
const { handler } = require("#lib/lambda/deals/create/lambda-handler.js");
const eventDataFilePath = "#lib/lambda/deals/create/lambda-event-test-data.json";

const main = async () => {

  // const data = fs.readFileSync(eventDataFilePath);
  // const event = JSON.parse(data);
  // console.log("event: " + JSON.stringify(event, null, 2));

  const event = JSON.parse(fs.readFileSync(eventDataFilePath));

  const response = await handler(event, {});

  // console.log("(+) response: " + JSON.stringify(response, null, 2));
}

main();