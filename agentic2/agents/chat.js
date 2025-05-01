import { END, Annotation, START, StateGraph } from "@langchain/langgraph";
import { supervisorAgent, teamMembers } from "#agents/supervisor.js";
import researcherAgent from "#agents/researcher.js";
import createAgentNode from "#utils/create-agent-node.js";

const agentAnnotation = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  next: Annotation({
    reducer: (x, y) => y ?? x ?? END,
    default: () => END,
  }),
});

const researcherNode = createAgentNode(researcherAgent, "researcher");

const chatGraph = new StateGraph(agentAnnotation)
  .addNode("supervisor", supervisorAgent)
  .addNode("researcher", researcherNode);

teamMembers.forEach((member) => chatGraph.addEdge(member, "supervisor"));

chatGraph.addConditionalEdges("supervisor", (x) => x.next);
chatGraph.addEdge(START, "supervisor");

const chatAgent = chatGraph.compile();

export default chatAgent;
