import { ChatGroq } from "@langchain/groq";
import Utils from "#utils/_index.js";

const groqLlama3_3_70b_versatile = Utils.buildModel(ChatGroq, {
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

export default groqLlama3_3_70b_versatile;
