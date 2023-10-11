import { Client, ClientEvents } from "discord.js";
import DisTube, { DisTubeEvents } from "distube";

export interface IEventHandler<
  K extends keyof ClientEvents | keyof DisTubeEvents
> {
  event: K;
  isPlayerEvent: K extends keyof DisTubeEvents ? true : false;
  handler: (
    player: DisTube,
    client: Client
  ) => (
    ...args: K extends keyof ClientEvents
      ? ClientEvents[K]
      : K extends keyof DisTubeEvents
      ? DisTubeEvents[K]
      : never
  ) => Promise<void> | void;
}
