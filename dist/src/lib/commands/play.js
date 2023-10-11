"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayCommand = void 0;
const discord_js_1 = require("discord.js");
const distube_1 = require("distube");
const util_1 = require("./util");
exports.PlayCommand = {
    name: "play",
    description: "Toca a música que você passar em `query`",
    options: [
        {
            name: "query",
            description: "A música que você quer tocar",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "position",
            description: "A posição da música na fila",
            type: discord_js_1.ApplicationCommandOptionType.Integer,
        },
    ],
    async execute(player, client, interaction) {
        const query = interaction.options.getString("query", true);
        const position = interaction.options.getInteger("position");
        await interaction.deferReply({ ephemeral: true });
        let channel = (0, util_1.userVoiceChannel)(client, interaction.guildId, client.user.id) ||
            (0, util_1.userVoiceChannel)(client, interaction.guildId, interaction.user.id);
        if (!channel) {
            await interaction.reply({
                content: "Você precisa estar em um canal de voz antes de usar esse comando",
                ephemeral: true,
            });
            return;
        }
        // TODO: search non-url queries
        let song = query;
        if (!query.startsWith("http")) {
            const results = await player.search(query, {
                limit: 5,
                type: distube_1.SearchResultType.VIDEO,
            });
            const choosen = await chooseFromSearch(results, interaction, query);
            if (!choosen) {
                await interaction.deleteReply();
                return;
            }
            song = choosen;
        }
        console.log(`playing: ${song}`);
        await Promise.all([
            // interaction.deleteReply(),
            player.play(channel, song, {
                member: interaction.member,
                textChannel: interaction.channel,
                position: position ?? -1,
            }),
        ]);
    },
};
async function chooseFromSearch(results, interaction, query) {
    const songs = results.map((song, i) => `${i + 1}. ${(0, util_1.escapeText)(song.name)} (${song.formattedDuration})`);
    const resultSelection = songs.map((song, i) => new discord_js_1.ButtonBuilder()
        .setCustomId(`${i}`)
        .setLabel(`${i + 1}`)
        .setStyle(discord_js_1.ButtonStyle.Secondary));
    const followUp = await interaction.followUp({
        embeds: [
            {
                color: discord_js_1.Colors.Blue,
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
            { components: resultSelection, type: discord_js_1.ComponentType.ActionRow },
        ],
        ephemeral: true,
    });
    try {
        const choice = await followUp.awaitMessageComponent({
            filter: (i) => i.user.id === interaction.user.id,
            componentType: discord_js_1.ComponentType.Button,
            time: 60000,
            dispose: true,
        });
        const choiceNumber = parseInt(choice.customId);
        if (isNaN(choiceNumber) || choiceNumber > songs.length - 1) {
            return null;
        }
        return songs[choiceNumber];
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
