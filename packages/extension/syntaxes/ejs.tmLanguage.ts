import * as vscodeEjs from 'vscode-ejs';

const tagDelimeters = ['%', '?'];

export default function getConfigString() {
	const { repository, patterns } = vscodeEjs.getGrammar(tagDelimeters, {
		languageName: 'ejs',
		sourceLanguageName: 'js',
	});

	const config = {
		name: 'Embedded JavaScript',
		scopeName: 'text.html.ejs',
		injectionSelector: 'L:text.html',
		patterns,
		repository,
	};

	return JSON.stringify(config);
}
