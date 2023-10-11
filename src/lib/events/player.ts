import { Colors } from "discord.js";
import { IEventHandler } from "./event";
import { escapeText } from "@/lib/commands/util";

export const HandlePlaySong: IEventHandler<"playSong"> = {
  event: "playSong",
  isPlayerEvent: true,
  handler: (_, _client) => async (queue, song) => {
    await queue.textChannel!.send({
      embeds: [
        {
          author: {
            name: "",
            icon_url: song.member?.avatarURL() || undefined,
          },
          color: Colors.Blue,
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
              value: `requisitado por **${
                song.member?.displayName || "ninguém"
              }**`,
            },
          ],
        },
      ],
    });
  },
};

export const HandleAddSong: IEventHandler<"addSong"> = {
  event: "addSong",
  isPlayerEvent: true,
  handler: (_, _client) => async (queue, song) => {
    await queue.textChannel!.send(
      `**${song.member?.displayName || "ninguém"}** adicionou  ||${
        song.name ? escapeText(song.name) : "(nome indisponível)"
      }|| à fila`
    );
  },
};
