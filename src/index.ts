import "dotenv/config";

import { Tocas } from "@/lib/index";

const token = process.env.DISCORD_TOKEN;
if (token === undefined) {
  console.error("DISCORD_TOKEN is not defined.");
  process.exit(1);
}

const tocas = new Tocas(token);

tocas.start();
