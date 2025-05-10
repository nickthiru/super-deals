import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const initSseMcpClient = async (name, url) => {
  const sseClient = new Client({
    name,
  });
  const transport = new SSEClientTransport(url);
  await sseClient.connect(transport);
  return sseClient;
};

export default initSseMcpClient;
