"use strict";

import fs from "fs";
import dotenv from "dotenv";
import { createLogger, format, transports } from "winston";

dotenv.config();

// Exports package.json
export const packageJson = JSON.parse(
	fs.readFileSync("package.json", { encoding: "utf-8" }).toString()
);

export const whitelistedChannels = JSON.parse(process.env.DISCORD_CHANNELS);

const logFormat = format.printf(({ level, message, label, timestamp }) => {
	return "\x1b[90m" + `[${timestamp}] [${label}] ${level}: ${message}`;
});

export const logger = createLogger({
	format: format.combine(
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	defaultMeta: { service: packageJson.name },
	handleExceptions: true,

	transports: [
		new transports.File({ filename: packageJson.name + "-all.log" }),
	],
});

logger.add(
	new transports.Console({
		format: format.combine(format.colorize(), logFormat),
		level: "info",
	})
);

logger.log("info", `Starting ${packageJson.name}@${packageJson.version}`, {
	label: "UTILS/UTILS",
});
