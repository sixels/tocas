import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";

import { ICommand } from "@/lib/commands/command";
import { IEventHandler } from "./event";

export const HandleInteraction = (
  commands: ICommand[]
): IEventHandler<"interactionCreate"> => ({
  event: "interactionCreate",
  isPlayerEvent: false,
  handler: (player, client) => async (interaction) => {
    const cmd_interaction = interaction as CommandInteraction;

    const command = commands.find(
      (cmd) => cmd.name === cmd_interaction.commandName
    );

    if (!command) return;

    console.info("handling command", command.name);

    try {
      await command.execute(
        player,
        client,
        interaction as ChatInputCommandInteraction
      );
    } catch (error) {
      console.error(error);
      if (!cmd_interaction.replied) {
        await cmd_interaction.reply({
          content: "Ocorreu um erro ao executar o comando",
          ephemeral: true,
        });
      }
    }
  },
});
