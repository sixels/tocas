"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeCommand = exports.PauseCommand = void 0;
const distube_1 = require("distube");
exports.PauseCommand = {
    name: "pause",
    description: "Pausa a música atual",
    async execute(player, _, interaction) {
        const guild = interaction.guildId;
        try {
            player.pause(guild);
        }
        catch (error) {
            await interaction.reply(handleError(error));
        }
        await interaction.reply("Pausando a música");
    },
};
exports.ResumeCommand = {
    name: "resume",
    description: "Despausa a música atual",
    async execute(player, _, interaction) {
        const guild = interaction.guildId;
        try {
            player.resume(guild);
        }
        catch (error) {
            await interaction.reply(handleError(error));
        }
        await interaction.reply("Despausando a música");
    },
};
function handleError(error) {
    if (error instanceof distube_1.DisTubeError) {
        const errors = {
            NO_QUEUE: "Não estou tocando nada",
        };
        if (error.code in errors) {
            return errors[error.code];
        }
    }
    throw error;
}
