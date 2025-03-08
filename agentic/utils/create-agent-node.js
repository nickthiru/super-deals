import { AIMessage } from "@langchain/core/messages";
import { getLastMessage } from "./get-last-message.js";

function createAgentNode(agent, nodeName) {
  return async (state, config) => {
    const result = await agent.invoke(state, config);
    const { content } = getLastMessage(result);

    return {
      messages: [
        new AIMessage({
          content,
          name: nodeName,
        }),
      ],
    };
  };
}

export default createAgentNode;
