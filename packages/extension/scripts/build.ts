import * as fs from "node:fs";
import * as path from "node:path";
import chalk from "chalk";
import sharp from "sharp";
import { chProjectDir, rmDist } from "lion-system";
import languageConfiguration from "../syntaxes/language-configuration.js
import tmLanguage from "../syntaxes/ets.tmLanguage.js

chProjectDir(import.meta.url);

rmDist();
fs.mkdirSync("dist", { recursive: true });

// https://stackoverflow.com/a/51220236
const syntaxDistDir = "dist/syntaxes";
fs.mkdirSync(syntaxDistDir, { recursive: true });

fs.writeFileSync(path.join(syntaxDistDir, "ets.tmLanguage.json"), tmLanguage());
fs.writeFileSync(
	path.join(syntaxDistDir, "language-configuration.json"),
	languageConfiguration()
);

console.info(chalk.greenBright("Syntax built."));

fs.mkdirSync("dist/assets", { recursive: true });
// Convert .svg icon to .png
await sharp("assets/icon.svg").png().toFile(path.join("dist/assets/icon.png"));

console.info(chalk.greenBright("Image converted."));
