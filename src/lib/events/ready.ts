import { ICommand } from "@/lib/commands/command";
import { IEventHandler } from "./event";

export const HandleReady = (commands: ICommand[]): IEventHandler<"ready"> => ({
  event: "ready",
  isPlayerEvent: false,
  handler: (_, client) => () => {
    if (!client.user || !client.application) {
      throw new Error("Client is not ready");
    }

    for (const guild of client.guilds.cache.values()) {
      guild.commands.set(commands);
    }

    console.log(`${client.user.username} is online`);
  },
});
