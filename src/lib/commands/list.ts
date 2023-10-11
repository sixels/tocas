import { ApplicationCommandOptionType } from "discord.js";
import { ICommand } from "./command";

const MAX_LIST_SIZE = 10;

export const ListCommand: ICommand = {
  name: "list",
  description: "Lista as músicas na fila",
  options: [
    {
      name: "page",
      description: "A página da lista de reprodução",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      minValue: 1,
    },
  ],

  async execute(player, _, interaction) {
    const page = interaction.options.getInteger("page") ?? 1;

    const queue = player.getQueue(interaction.guildId!);

    const pageIndex = (page - 1) * MAX_LIST_SIZE;
    const songs = queue?.songs
      .slice(pageIndex, pageIndex + MAX_LIST_SIZE)
      .map((song, i) => {
        return `${i}. ${song.name} (${song.formattedDuration})`;
      });

    if (!songs) {
      await interaction.reply({
        content: "A lista de reprodução está vazia",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      embeds: [
        {
          fields: [
            {
              name: "LISTA DE REPRODUÇÃO",
              value: songs.join("\n"),
            },
          ],
        },
      ],
      ephemeral: true,
    });
  },
};
