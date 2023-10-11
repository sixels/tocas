"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleAddSong = exports.HandlePlaySong = void 0;
const discord_js_1 = require("discord.js");
const util_1 = require("../../lib/commands/util");
exports.HandlePlaySong = {
    event: "playSong",
    isPlayerEvent: true,
    handler: (_, _client) => async (queue, song) => {
        await queue.textChannel.send({
            embeds: [
                {
                    author: {
                        name: "",
                        icon_url: song.member?.avatarURL() || undefined,
                    },
                    color: discord_js_1.Colors.Blue,
                    thumbnail: song.thumbnail
                        ? {
                            url: song.thumbnail,
                        }
                        : undefined,
                    fields: [
                        {
                            name: "TOCANDO AGORA",
                            value: song.name || "-",
                            inline: true,
                        },
                        {
                            name: "",
                            value: `requisitado por **${song.member?.displayName || "ninguém"}**`,
                        },
                    ],
                },
            ],
        });
    },
};
exports.HandleAddSong = {
    event: "addSong",
    isPlayerEvent: true,
    handler: (_, _client) => async (queue, song) => {
        await queue.textChannel.send(`**${song.member?.displayName || "ninguém"}** adicionou  ||${song.name ? (0, util_1.escapeText)(song.name) : "(nome indisponível)"}|| à fila`);
    },
};
