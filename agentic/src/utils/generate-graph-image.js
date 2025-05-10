import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

async function generateGraphImage(graph, filename) {
  const image = await graph.getGraph().drawMermaidPng();
  const arrayBuffer = await image.arrayBuffer();
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const outputDir = path.resolve(currentDir, "..", "graph-diagrams");
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, `${filename}.png`);
  fs.writeFileSync(outputPath, new Uint8Array(arrayBuffer));
}

export default generateGraphImage;
