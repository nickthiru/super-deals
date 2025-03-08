import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import * as dotenv from "dotenv";

dotenv.config();

const tavilySearchTool = new TavilySearchResults();

export default tavilySearchTool;
