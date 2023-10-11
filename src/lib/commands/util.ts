import { Client, VoiceBasedChannel } from "discord.js";

export function userVoiceChannel(
  client: Client,
  guildId: string,
  userId: string
): VoiceBasedChannel | null | undefined {
  const guild = client.guilds.cache.get(guildId!);
  const member = guild?.members.cache.get(userId);
  return member?.voice.channel;
}

export function escapeText(text: string): string {
  return text.replace(/((\_|\*|\~|\`|\|){2})/g, "\\$1");
}
