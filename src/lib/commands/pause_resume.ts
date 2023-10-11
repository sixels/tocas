import { DisTubeError } from "distube";
import { ICommand } from "./command";

export const PauseCommand: ICommand = {
  name: "pause",
  description: "Pausa a música atual",

  async execute(player, _, interaction) {
    const guild = interaction.guildId!;

    try {
      player.pause(guild);
    } catch (error) {
      await interaction.reply(handleError(error));
    }

    await interaction.reply("Pausando a música");
  },
};

export const ResumeCommand: ICommand = {
  name: "resume",
  description: "Despausa a música atual",

  async execute(player, _, interaction) {
    const guild = interaction.guildId!;

    try {
      player.resume(guild);
    } catch (error) {
      await interaction.reply(handleError(error));
    }
    await interaction.reply("Despausando a música");
  },
};

function handleError(error: unknown): string {
  if (error instanceof DisTubeError) {
    const errors = {
      NO_QUEUE: "Não estou tocando nada",
    };

    if (error.code in errors) {
      return errors[error.code as keyof typeof errors];
    }
  }
  throw error;
}
