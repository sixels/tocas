import { HandleAddSong, HandlePlaySong } from "./events/player";
import { PauseCommand, ResumeCommand } from "./commands/pause_resume";

import { Client } from "discord.js";
import DisTube from "distube";
import { HandleInteraction } from "./events/interaction";
import { HandleReady } from "./events/ready";
import { ICommand } from "./commands/command";
import { IEventHandler } from "./events/event";
import { JoinCommand } from "./commands/join";
import { LeaveCommand } from "./commands/leave";
import { ListCommand } from "./commands/list";
import { PlayCommand } from "./commands/play";
import { SkipCommand } from "./commands/skip";
import { YtDlpPlugin } from "@distube/yt-dlp";

export class Tocas {
  private client: Client;
  private token: string;
  private distube: DisTube;

  private eventHandlers: IEventHandler<any>[] = [];
  private commands: ICommand[] = [];

  constructor(token: string) {
    this.client = new Client({
      intents: ["Guilds", "GuildMessages", "GuildVoiceStates"],
    });
    this.token = token;

    this.distube = new DisTube(this.client, {
      plugins: [new YtDlpPlugin()],
      leaveOnEmpty: true,
    });

    this.commands = [
      PlayCommand,
      JoinCommand,
      LeaveCommand,
      PauseCommand,
      ResumeCommand,
      SkipCommand,
      ListCommand,
    ];
    this.eventHandlers = [
      HandleReady(this.commands),
      HandleInteraction(this.commands),
      HandlePlaySong,
      HandleAddSong,
    ];
  }

  async start() {
    this.registerEventHandlers();

    while (true) {
      let retry = false;

      try {
        await this.client.login(this.token);
      } catch (e) {
        console.error(e);
        retry = true;
      }

      if (!retry) {
        break;
      } else {
        console.log("Restarting in 2 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  private registerEventHandlers() {
    for (const eventHandler of this.eventHandlers) {
      if (eventHandler.isPlayerEvent) {
        this.distube.on(
          eventHandler.event,
          eventHandler.handler(this.distube, this.client)
        );
      } else {
        this.client.on(
          eventHandler.event,
          eventHandler.handler(this.distube, this.client)
        );
      }
    }
  }
}
