import { SystemMessage } from "@langchain/core/messages";
import {
  END,
  Annotation,
  START,
  StateGraph,
  messagesStateReducer,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import Utils from "#utils/_index.js";
import { loadMcpTools } from "@langchain/mcp-adapters";

// import { tavilySearchTool } from "#tools/_index.js";
import { hasToolCalls, generateGraphImage } from "#utils/_index.js";
import LLM from "#LLMs/_index.js";

const model = LLM.groqLlama3_3_70b_versatile;

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

const sseClient = await Utils.initSseMcpClient(
  "researcher",
  "http://localhost:8080/sse"
);

const tools = await loadMcpTools("search-mcp", sseClient);
// const tools = [tavilySearchTool];
const toolNode = new ToolNode(tools);

async function modelNode(state) {
  const { messages } = state;
  const result = await model.bindTools(tools).invoke(messages);
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
