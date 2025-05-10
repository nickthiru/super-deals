import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import restify from "restify";
import chatAgent from "./agents/chat.js";

// Create the Restify server
const server = restify.createServer({
  name: "LangGraph-API",
  version: "1.0.0",
});

// Middleware for parsing JSON body
server.use(restify.plugins.bodyParser());

// Define the endpoint to interact with the LangGraph agent
server.post("/api/agentic", async (req, res) => {
  try {
    const query = req.body.query || "";

    const result = await chatAgent.invoke({
      messages: [
        new SystemMessage(`
          You are responsible for answering user questions using tools. These tools sometimes fail, but you keep trying until you get a valid response.
        `),
        new HumanMessage(query),
      ],
    });

    res.send({
      response: result.response,
    });
  } catch (error) {
    res.send(500, {
      error: error.message,
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`${server.name} listening at ${server.url}`);
});
