import "dotenv/config";

import { Tocas } from "@/lib/index";
import { createServer } from "node:http";

const token = process.env.DISCORD_TOKEN;
if (token === undefined) {
  console.error("DISCORD_TOKEN is not defined.");
  process.exit(1);
}

const tocas = new Tocas(token);

tocas.start();

// health check
createServer(async (_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Tocas is live!\n");
}).listen(8080);
