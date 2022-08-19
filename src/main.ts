"use strict";

import dotenv from "dotenv";
import { logger } from "./utils/utils.js";
import * as discord from "./discord/discord.js";
import * as telegram from "./telegram/telegram.js";

dotenv.config();

discord.startBot(process.env.DISCORD_TOKEN);
telegram.startBot();

process.on("uncaughtException", (error) => {
	logger.log("error", "New uncaught exception", { label: "MAIN/MAIN" });
	logger.log("error", { error: error, label: "MAIN/MAIN" });

	process.exit(1);
});

process.on("SIGINT", () => {
	logger.log("info", "Received SIGINT, exiting.", { label: "MAIN/MAIN" });

	shutdown();
});

process.on("SIGTERM", () => {
	logger.log("info", "Received SIGTERM, exiting.", { label: "MAIN/MAIN" });

	shutdown();
});

function shutdown() {
	discord.stopBot();
	telegram.stopBot();

	process.exit(0);
}
