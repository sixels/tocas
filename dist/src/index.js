"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const index_1 = require("./lib/index");
const token = process.env.DISCORD_TOKEN;
if (token === undefined) {
    console.error("DISCORD_TOKEN is not defined.");
    process.exit(1);
}
const tocas = new index_1.Tocas(token);
tocas.start();
