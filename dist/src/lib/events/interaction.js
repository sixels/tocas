"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleInteraction = void 0;
const HandleInteraction = (commands) => ({
    event: "interactionCreate",
    isPlayerEvent: false,
    handler: (player, client) => async (interaction) => {
        const cmd_interaction = interaction;
        const command = commands.find((cmd) => cmd.name === cmd_interaction.commandName);
        if (!command)
            return;
        console.info("handling command", command.name);
        try {
            await command.execute(player, client, interaction);
        }
        catch (error) {
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
exports.HandleInteraction = HandleInteraction;
