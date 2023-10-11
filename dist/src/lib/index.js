"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tocas = void 0;
const player_1 = require("./events/player");
const pause_resume_1 = require("./commands/pause_resume");
const discord_js_1 = require("discord.js");
const distube_1 = __importDefault(require("distube"));
const interaction_1 = require("./events/interaction");
const ready_1 = require("./events/ready");
const join_1 = require("./commands/join");
const leave_1 = require("./commands/leave");
const play_1 = require("./commands/play");
const yt_dlp_1 = require("@distube/yt-dlp");
class Tocas {
    client;
    token;
    distube;
    eventHandlers = [];
    commands = [];
    constructor(token) {
        this.client = new discord_js_1.Client({
            intents: ["Guilds", "GuildMessages", "GuildVoiceStates"],
        });
        this.token = token;
        this.distube = new distube_1.default(this.client, {
            plugins: [new yt_dlp_1.YtDlpPlugin()],
            leaveOnEmpty: true,
        });
        this.commands = [
            play_1.PlayCommand,
            join_1.JoinCommand,
            leave_1.LeaveCommand,
            pause_resume_1.PauseCommand,
            pause_resume_1.ResumeCommand,
        ];
        this.eventHandlers = [
            (0, ready_1.HandleReady)(this.commands),
            (0, interaction_1.HandleInteraction)(this.commands),
            player_1.HandlePlaySong,
            player_1.HandleAddSong,
        ];
    }
    async start() {
        this.registerEventHandlers();
        await this.client.login(this.token);
    }
    registerEventHandlers() {
        for (const eventHandler of this.eventHandlers) {
            if (eventHandler.isPlayerEvent) {
                this.distube.on(eventHandler.event, eventHandler.handler(this.distube, this.client));
            }
            else {
                this.client.on(eventHandler.event, eventHandler.handler(this.distube, this.client));
            }
        }
    }
}
exports.Tocas = Tocas;
