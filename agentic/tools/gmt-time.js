import { tool } from "@langchain/core/tools";
import { z } from "zod";

const gmtTimeSchema = z.object({
  city: z.string().describe("The name of the city"),
});

const gmtTimeTool = tool(
  async ({ city }) => {
    const serviceIsWorking = Math.floor(Math.random() * 3);
    return serviceIsWorking !== 2
      ? `The local time in ${city} is 6:30pm.`
      : "Error 404";
  },
  {
    name: "gmtTime",
    description: `
      Check local time in a specified city. The API is randomly available every third call.
    `,
    schema: gmtTimeSchema,
  }
);

export default gmtTimeTool;
