import { ChatGroq } from "@langchain/groq";
import { END } from "@langchain/langgraph";
import { z } from "zod";
import { JsonOutputToolsParser } from "@langchain/core/output_parsers/openai_tools";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import { buildModel } from "#utils/_index.js";

const agentModel = buildModel(ChatGroq, {
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

// const teamMembers = ["researcher", "chart_generator"];
const teamMembers = ["researcher"];

const systemPrompt =
  "You are a supervisor tasked with managing a conversation between the following workers: {teamMembers}. Given the following user request, respond with the worker to act next. Each worker will perform a task and respond with their results and status. When finished, respond with FINISH.";

const options = [END, ...teamMembers];

const routingTool = {
  name: "route",
  description: "Select the next role.",
  schema: z.object({
    next: z.enum([END, ...teamMembers]),
  }),
};

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  new MessagesPlaceholder("messages"),
  [
    "system",
    "Given the conversation above, who should act next? Or should we FINISH? Select one of: {options}",
  ],
]);

const formattedPrompt = await prompt.partial({
  options: options.join(", "),
  teamMembers: teamMembers.join(", "),
});

const supervisorAgent = formattedPrompt
  .pipe(agentModel.bindTools([routingTool], { tool_choice: "route" }))
  .pipe(new JsonOutputToolsParser())
  .pipe((x) => x[0].args);

export { supervisorAgent, teamMembers };
