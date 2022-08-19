"use strict";

import dotenv from "dotenv";
import Telegraf from "telegraf";
import { logger } from "../utils/utils.js";

dotenv.config();

const bot = new Telegraf.Telegraf(process.env.TELEGRAM_TOKEN);

/**
 * Sends a text message to a channel, by default process.env.TELEGRAM_CHANNEL
 * @param {string} string - The message you want to send
 * @param {string} channel - (Optional) Overrides the default process.env.TELEGRAM_CHANNEL
 */
export function sendMessageToChannel(
	string: string,
	channel: string = process.env.TELEGRAM_CHANNEL
) {
	try {
		if (channel && string) bot.telegram.sendMessage(channel, string);
	} catch (error) {
		logger.log("error", "Couldn't send message", { label: "TELEGRAM/MAIN" });
		logger.log("error", error, { label: "TELEGRAM/MAIN" });
	}
}

/**
 * Sends an image to a channel, by default process.env.TELEGRAM_CHANNEL
 * @param {string} url - The URL to the image
 * @param {string} channel - (Optional) Overrides the default process.env.TELEGRAM_CHANNEL
 */
export function sendImageToChannel(
	url: string,
	channel: string = process.env.TELEGRAM_CHANNEL
) {
	try {
		if (channel && url) bot.telegram.sendPhoto(channel, url);
	} catch (error) {
		logger.log("error", "Couldn't send photo", { label: "TELEGRAM/MAIN" });
		logger.log("error", error, { label: "TELEGRAM/MAIN" });
	}
}

/**
 * Sends a document to a channel, by default process.env.TELEGRAM_CHANNEL
 * @param {string} url - The URL to the video
 * @param {string} channel - (Optional) Overrides the default process.env.TELEGRAM_CHANNEL
 */
export function sendVideoToChannel(
	url: string,
	channel: string = process.env.TELEGRAM_CHANNEL
) {
	try {
		if (channel && url) bot.telegram.sendVideo(channel, url);
	} catch (error) {
		logger.log("error", "Couldn't send video", { label: "TELEGRAM/MAIN" });
		logger.log("error", error, { label: "TELEGRAM/MAIN" });
	}
}

/**
 * Sends a document to a channel, by default process.env.TELEGRAM_CHANNEL
 * @param {string} url - The URL to the document
 * @param {string} channel - (Optional) Overrides the default process.env.TELEGRAM_CHANNEL
 */
export function sendDocumentToChannel(
	url: string,
	channel: string = process.env.TELEGRAM_CHANNEL
) {
	try {
		if (channel && url) bot.telegram.sendDocument(channel, url);
	} catch (error) {
		logger.log("error", "Couldn't send document", { label: "TELEGRAM/MAIN" });
		logger.log("error", error, { label: "TELEGRAM/MAIN" });
	}
}

/**
 * Starts the bot
 */
export function startBot() {
	logger.log("info", "Logging in...", { label: "TELEGRAM/MAIN" });

	bot
		.launch()
		.then(() => {
			logger.log("info", "Telegram bot online", { label: "TELEGRAM/MAIN" });
		})
		.catch((error) => {
			logger.log("error", "Failed to create the Telegram bot", {
				label: "TELEGRAM/MAIN",
			});
			logger.log("error", { error: error, label: "TELEGRAM/MAIN" });
			process.exit(1);
		});
}

/**
 * Stops the bot
 */
export function stopBot() {
	try {
		bot.stop();
	} catch (error) {
		logger.log("error", "Failed to destroy the Telegram bot", {
			label: "TELEGRAM/MAIN",
		});
		logger.log("error", { error: error, label: "TELEGRAM/MAIN" });
	}
}
