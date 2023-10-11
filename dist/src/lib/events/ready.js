"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleReady = void 0;
const HandleReady = (commands) => ({
    event: "ready",
    isPlayerEvent: false,
    handler: (_, client) => () => {
        if (!client.user || !client.application) {
            throw new Error("Client is not ready");
        }
        for (const guild of client.guilds.cache.values()) {
            guild.commands.set(commands);
        }
        console.log(`${client.user.username} is online`);
    },
});
exports.HandleReady = HandleReady;
