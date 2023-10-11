import { DisTubeError } from "distube";
import { ICommand } from "./command";
import { getVoiceConnection } from "@discordjs/voice";
import { userVoiceChannel } from "./util";

export const LeaveCommand: ICommand = {
  name: "leave",
  description: "Sai do canal de voz",
  async execute(player, client, interaction) {
    const bot_channel = userVoiceChannel(
      client,
      interaction.guildId!,
      client.user!.id
    );

    if (!bot_channel) {
      await interaction.reply({
        content: "Não estou em um canal de voz",
        ephemeral: true,
      });
      return;
    }

    try {
      await player.stop(interaction.guildId!);
    } catch (error) {
      if (error instanceof DisTubeError && error.code != "NO_QUEUE") {
        throw error;
      }
    }

    getVoiceConnection(interaction.guildId!)?.destroy();

    await interaction.reply("Saindo do canal de voz");
  },
};
