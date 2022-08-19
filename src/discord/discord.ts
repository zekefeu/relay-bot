"use strict";

import discordjs from "discord.js";
import * as telegram from "../telegram/telegram.js";
import { logger, whitelistedChannels } from "../utils/utils.js";

const client = new discordjs.Client({
	intents: [
		discordjs.GatewayIntentBits.Guilds,
		discordjs.GatewayIntentBits.GuildMessages,
	],
});

client.on("ready", () => {
	logger.log("info", "Discord bot online", { label: "DISCORD/MAIN" });
});

// Triggers when a user creates a message in Discord
client.on("messageCreate", (message) => {
	if (!whitelistedChannels.includes(message.channelId)) return;

	//	 		   Default					Reply
	if (message.type !== 0 && message.type !== 19) {
		logger.log("debug", "Unknown message type", {
			label: "DISCORD/MAIN",
			payload: message,
		});
		return;
	}

	logger.log("debug", `New message, type: ${message.type}`, {
		label: "DISCORD/MAIN",
		payload: message,
	});

	if (message.embeds.length > 0) {
		message.embeds.forEach((embed) => {
			let stringToSend = "";

			if (message.content) stringToSend += `${message.content}\n`;

			if (embed.title && embed.description) {
				if (embed.author) {
					stringToSend += `<${embed.author.name}> ${embed.title}: ${embed.description}`;
				} else {
					stringToSend += `${embed.title}: ${embed.description}`;
				}

				if (embed.fields.length) {
					embed.fields.forEach((field) => {
						stringToSend += `\n${field.name}: `;
						if (!field.inline) stringToSend += "\n";
						if (field.value) stringToSend += field.value;
					});
				}
			} else {
				logger.log("warn", "Invalid embed format", { label: "DISCORD/MAIN" });
			}

			logger.log("info", "Sending embed message: " + stringToSend, {
				label: "DISCORD/MAIN",
			});

			if (stringToSend) telegram.sendMessageToChannel(stringToSend);
		});
	} else {
		message.content = message.content.replace(/@everyone/g, "");

		client.channels.fetch(message.channelId).then((channel) => {
			if (message.type === 19) {
				// Reply
				logger.log(
					"info",
					"┌" +
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						"─".repeat(channel.name.length + 2) +
						` Replying to ${message.mentions.repliedUser.username}#${message.mentions.repliedUser.discriminator}`,
					{ label: "DISCORD/MAIN" }
				);
			}
			logger.log(
				"info",
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				`[#${channel.name}] ${message.author.username}#${message.author.discriminator}: ${message.content}`,
				{ label: "DISCORD/MAIN" }
			);

			if (message.content) telegram.sendMessageToChannel(message.content);

			message.attachments.forEach((a) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				if (message.height !== null) {
					logger.log(
						"info",
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						" ".repeat(channel.name.length + 1) +
							`   ↳ Attachment: MIME: ${a.contentType} (${a.height}x${a.width}) URL: ${a.url}`,
						{ label: "DISCORD/MAIN" }
					);

					if (a.contentType.startsWith("image")) {
						telegram.sendImageToChannel(a.url);
					} else if (a.contentType.startsWith("video")) {
						telegram.sendVideoToChannel(a.url);
					} else {
						telegram.sendDocumentToChannel(a.url);
					}
				} else {
					logger.log(
						"info",
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						" ".repeat(channel.name.length + 1) +
							`   ↳ Attachment: MIME:${a.contentType} URL: ${a.url}`,
						{ label: "DISCORD/MAIN" }
					);
					telegram.sendDocumentToChannel(a.url);
				}
			});
		});
	}
});

export function startBot(token: string) {
	logger.log("info", "Logging in...", { label: "DISCORD/MAIN" });

	try {
		client.login(token);
	} catch (error) {
		logger.log("error", "Failed to create the Discord bot", {
			label: "DISCORD/MAIN",
		});
		logger.log("error", error, { label: "DISCORD/MAIN" });
		process.exit(1);
	}
}

export function stopBot() {
	try {
		client.destroy();
	} catch (error) {
		logger.log("error", "Failed to destroy the Discord bot", {
			label: "DISCORD/MAIN",
		});
		logger.log("error", error, { label: "DISCORD/MAIN" });
	}
}
