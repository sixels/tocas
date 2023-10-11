import {
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Colors,
  ComponentType,
  GuildMember,
  TextChannel,
} from "discord.js";
import { SearchResultType, SearchResultVideo } from "distube";
import { escapeText, userVoiceChannel } from "./util";

import { ICommand } from "./command";

export const PlayCommand: ICommand = {
  name: "play",
  description: "Toca a música que você passar em `query`",

  options: [
    {
      name: "query",
      description: "A música que você quer tocar",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "position",
      description: "A posição da música na fila",
      type: ApplicationCommandOptionType.Integer,
    },
  ],
  async execute(player, client, interaction) {
    const query = interaction.options.getString("query", true);
    const position = interaction.options.getInteger("position");

    await interaction.deferReply({ ephemeral: true });

    let channel =
      userVoiceChannel(client, interaction.guildId!, client.user!.id) ||
      userVoiceChannel(client, interaction.guildId!, interaction.user.id);
    if (!channel) {
      await interaction.reply({
        content:
          "Você precisa estar em um canal de voz antes de usar esse comando",
        ephemeral: true,
      });
      return;
    }

    // TODO: search non-url queries
    let song: string | SearchResultVideo = query;
    if (!query.startsWith("http")) {
      const results = await player.search(query, {
        limit: 5,
        type: SearchResultType.VIDEO,
      });
      const choosen = await chooseFromSearch(results, interaction, query);
      if (!choosen) {
        await interaction.deleteReply();
        return;
      }
      song = choosen;
    }

    await interaction.deleteReply();

    await player.play(channel, song, {
      member: interaction.member as GuildMember,
      textChannel: interaction.channel as TextChannel,
      position: position ?? -1,
    });
  },
};

async function chooseFromSearch(
  results: SearchResultVideo[],
  interaction: ChatInputCommandInteraction,
  query: string
) {
  const songs = results.map(
    (song, i) =>
      `${i + 1}. ${escapeText(song.name)} (${song.formattedDuration})`
  );

  const resultSelection = songs.map((song, i) =>
    new ButtonBuilder()
      .setCustomId(`${i}`)
      .setLabel(`${i + 1}`)
      .setStyle(ButtonStyle.Secondary)
  );

  const followUp = await interaction.followUp({
    embeds: [
      {
        color: Colors.Blue,
        fields: [
          {
            name: "RESULTADOS",
            value: songs.join("\n"),
            inline: false,
          },
        ],
      },
    ],
    components: [
      { components: resultSelection, type: ComponentType.ActionRow },
    ],
    ephemeral: true,
  });

  try {
    const choice = await followUp.awaitMessageComponent({
      filter: (i) => i.user.id === interaction.user.id,
      componentType: ComponentType.Button,
      time: 60000,
      dispose: true,
    });

    const choiceNumber = parseInt(choice.customId);

    if (isNaN(choiceNumber) || choiceNumber > songs.length - 1) {
      return null;
    }

    return songs[choiceNumber];
  } catch (error) {
    console.error(error);
    return null;
  }
}
