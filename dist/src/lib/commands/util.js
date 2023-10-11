"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeText = exports.userVoiceChannel = void 0;
function userVoiceChannel(client, guildId, userId) {
    const guild = client.guilds.cache.get(guildId);
    const member = guild?.members.cache.get(userId);
    return member?.voice.channel;
}
exports.userVoiceChannel = userVoiceChannel;
function escapeText(text) {
    return text.replace(/((\_|\*|\~|\`|\|){2})/g, "\\$1");
}
exports.escapeText = escapeText;
