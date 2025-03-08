import { ChatGroq } from "@langchain/groq";
// import { SystemMessage } from "@langchain/core/messages";
// import {
//   END,
//   Annotation,
//   START,
//   StateGraph,
//   messagesStateReducer,
// } from "@langchain/langgraph";
// import { ToolNode } from "@langchain/langgraph/prebuilt";

// import { tavilySearchTool } from "#tools/_index.js";
import { buildModel, hasToolCalls, generateGraphImage } from "#utils/_index.js";

const agentModel = buildModel(ChatGroq, {
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

// const agentAnnotation = Annotation.Root({
//   messages: Annotation({
//     reducer: messagesStateReducer,
//     default: () => [
//       new SystemMessage(
//         "You are a web researcher. You may use the Tavily search engine to search the web for the latest and most important information pertaining to the user's query."
//       ),
//     ],
//   }),
// });

async function llmNode(state) {
  const { messages } = state;
  const result = await agentModel.bindTools(tools).invoke(messages);
  return { messages: [result] };
}

// const tools = [tavilySearchTool];
// const toolNode = new ToolNode(tools);

// const researcherAgent = new StateGraph(agentAnnotation)
//   .addNode("agent", modelNode)
//   .addNode("tools", toolNode)
//   .addEdge(START, "agent")
//   .addEdge("tools", "agent")
//   .addConditionalEdges("agent", hasToolCalls, ["tools", END])
//   .compile();

// await generateGraphImage(researcherAgent, "researcher-agent");

// export default researcherAgent;

export default llmNode;
