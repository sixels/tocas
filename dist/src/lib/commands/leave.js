"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveCommand = void 0;
const distube_1 = require("distube");
const voice_1 = require("@discordjs/voice");
const util_1 = require("./util");
exports.LeaveCommand = {
    name: "leave",
    description: "Sai do canal de voz",
    async execute(player, client, interaction) {
        const bot_channel = (0, util_1.userVoiceChannel)(client, interaction.guildId, client.user.id);
        if (!bot_channel) {
            await interaction.reply({
                content: "Não estou em um canal de voz",
                ephemeral: true,
            });
            return;
        }
        try {
            await player.stop(interaction.guildId);
        }
        catch (error) {
            if (error instanceof distube_1.DisTubeError && error.code != "NO_QUEUE") {
                throw error;
            }
        }
        (0, voice_1.getVoiceConnection)(interaction.guildId)?.destroy();
        await interaction.reply("Saindo do canal de voz");
    },
};
