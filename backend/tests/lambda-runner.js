const fs = require("fs");
const path = require("path");

const { handler } = require("#lib/lambda/accounts/sign-up/handler.js");
const eventDataFilePath = "../lib/lambda/accounts/sign-up/event.json";

const main = async () => {

  // const data = fs.readFileSync(eventDataFilePath);
  // const event = JSON.parse(data);
  // console.log("event: " + JSON.stringify(event, null, 2));

  const event = JSON.parse(fs.readFileSync(path.join(__dirname, eventDataFilePath)));

  const response = await handler(event, {});

  // console.log("(+) response: " + JSON.stringify(response, null, 2));
}

main();