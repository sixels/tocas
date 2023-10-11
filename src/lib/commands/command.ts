import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Client,
} from "discord.js";

import DisTube from "distube";

export interface ICommand extends ChatInputApplicationCommandData {
  execute(
    player: DisTube,
    client: Client,
    interaction: ChatInputCommandInteraction
  ): Promise<void>;
}
