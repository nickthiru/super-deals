import { ChatGroq } from "@langchain/groq";
import { SystemMessage } from "@langchain/core/messages";
import {
  END,
  Annotation,
  START,
  StateGraph,
  messagesStateReducer,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { tavilySearchTool } from "#tools/_index.js";
import { buildModel, hasToolCalls, generateGraphImage } from "#utils/_index.js";

const agentModel = buildModel(ChatGroq, {
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

const agentAnnotation = Annotation.Root({
  messages: Annotation({
    reducer: messagesStateReducer,
    default: () => [
      new SystemMessage(
        "You are a web researcher. You may use the Tavily search engine to search the web for the latest and most important information pertaining to the user's query."
      ),
    ],
  }),
});

const tools = [tavilySearchTool];
const toolNode = new ToolNode(tools);

async function modelNode(state) {
  const { messages } = state;
  const result = await agentModel.bindTools(tools).invoke(messages);
  return { messages: [result] };
}

const researcherAgent = new StateGraph(agentAnnotation)
  .addNode("model", modelNode)
  .addNode("tools", toolNode)
  .addEdge(START, "model")
  .addEdge("tools", "model")
  .addConditionalEdges("model", hasToolCalls, ["tools", END])
  .compile();

// await generateGraphImage(researcherAgent, "researcher-agent");

export default researcherAgent;
