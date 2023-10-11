import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";

import { ICommand } from "./command";

export const SkipCommand: ICommand = {
  name: "skip",
  description: "Pula uma música",
  options: [
    {
      name: "n",
      description: "Pula as `n` primeiras músicas",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      minValue: 1,
      autocomplete: true,
    },
    {
      name: "at",
      description: "Remove a música da posição `at` na fila",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      minValue: 1,
      autocomplete: true,
    },
    {
      name: "range",
      description: "Remove as músicas entre `from` e `to`",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "start",
          description: "Posição inicial",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          minValue: 1,
        },
        {
          name: "end",
          description: "Posição final",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          minValue: 1,
        },
      ],
    },
  ],
  async execute(player, client, interaction) {
    // range with both start and end inclusive
    const rangeOptions: RangeOption[] = [
      {
        param: {
          isSubcommand: false,
          name: "n",
        },
        range: (interaction) => {
          const n = interaction.options.getInteger("n", true);
          return [1, n];
        },
      },
      {
        param: {
          isSubcommand: false,
          name: "at",
        },
        range: (interaction) => {
          const at = interaction.options.getInteger("at", true);
          return [at, at];
        },
      },
      {
        param: {
          isSubcommand: true,
          subcommand: "range",
        },
        range: (interaction, subOptions) => {
          const start = interaction.options.getInteger("start", true);
          const end = interaction.options.getInteger("end", true);
          return [start, end];
        },
      },
    ];

    const queue = player.getQueue(interaction.guildId!);
    if (!queue) {
      await interaction.reply({
        content: "Não estou tocando nada",
        ephemeral: true,
      });
      return;
    }
    let skipRange = getRangeOption(rangeOptions, interaction);

    if (
      !skipRange ||
      skipRange[0] > queue.songs.length ||
      skipRange[1] < skipRange[0]
    ) {
      await interaction.reply({
        content: "Não há nada para pular",
        ephemeral: true,
      });
      return;
    }

    const removeCount = skipRange[1] - skipRange[0] + 1;
    queue.songs.splice(skipRange[0] - 1, removeCount);

    const positionString =
      removeCount === 1
        ? `na posição ${skipRange[0]}`
        : `nas posições ${skipRange[0]} a ${skipRange[1]}`;

    await interaction.reply({
      content: `Pulando ${removeCount} música${
        removeCount > 1 ? "s" : ""
      } ${positionString}`,
    });
  },
};

type RangeOption = {
  param: { isSubcommand: boolean } & (
    | { isSubcommand: false; name: string }
    | { isSubcommand: true; subcommand: string }
  );
  range: (
    interaction: ChatInputCommandInteraction,
    subOptions?: number[]
  ) => [number, number];
};

function getRangeOption(
  options: RangeOption[],
  interaction: ChatInputCommandInteraction
): [number, number] | null {
  for (const option of options) {
    if (option.param.isSubcommand) {
      const subcommand = interaction.options.getSubcommand();
      if (subcommand === option.param.subcommand) {
        return option.range(interaction);
      }
    } else {
      const param = interaction.options.getInteger(option.param.name);
      if (param !== null) {
        return option.range(interaction);
      }
    }
  }
  return null;
}
