"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinCommand = void 0;
const voice_1 = require("@discordjs/voice");
const util_1 = require("./util");
exports.JoinCommand = {
    name: "join",
    description: "Entra no canal de voz que você está",
    async execute(_, client, interaction) {
        const bot_channel = (0, util_1.userVoiceChannel)(client, interaction.guildId, client.user.id);
        const user_channel = (0, util_1.userVoiceChannel)(client, interaction.guildId, interaction.user.id);
        if (bot_channel && user_channel && bot_channel.id === user_channel.id) {
            await interaction.reply({
                content: "Já estou no seu canal de voz",
                ephemeral: true,
            });
            return;
        }
        const channel = user_channel ?? bot_channel;
        if (!channel) {
            await interaction.reply({
                content: "Você precisa estar em um canal de voz antes de usar esse comando",
                ephemeral: true,
            });
            return;
        }
        (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true,
        });
        await interaction.reply({
            content: "Entrando no canal de voz",
        });
    },
};
