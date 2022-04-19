import { setProperty } from 'dot-prop';
import { execaCommandSync as exec } from 'execa';
import inquirer from 'inquirer';
import PressToContinuePrompt from 'inquirer-press-to-continue';
import {
	chProjectDir,
	copyPackageFiles,
	getProjectDir,
	rmDist,
} from 'lion-system';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

rmDist();
chProjectDir(import.meta.url);
exec('pnpm build', { stdio: 'inherit' });
await copyPackageFiles({ additionalFiles: ['assets'] });

const distDir = path.join(getProjectDir(import.meta.url), 'dist');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')) as Record<
	string,
	unknown
>;
setProperty(pkg, 'type', 'commonjs');

process.chdir(distDir);

exec('npm install --only=production', { stdio: 'inherit' });

await inquirer.prompt({
	name: 'response',
	pressToContinueMessage:
		'Please inspect the `dist/` folder to make sure everything looks OK in the bundled extension! Press enter to continue...',
	type: 'press-to-continue',
	enter: true,
});

exec('vsce package', { stdio: 'inherit' });
exec('vsce publish', { stdio: 'inherit' });
