import { END } from "@langchain/langgraph";
import { getLastMessage } from "#utils/_index.js";

function hasToolCalls(state) {
  const lastMessage = getLastMessage(state);
  const didAICalledAnyTools =
    lastMessage._getType() === "ai" && lastMessage.tool_calls?.length;
  return didAICalledAnyTools ? "tools" : END;
}

export default hasToolCalls;
