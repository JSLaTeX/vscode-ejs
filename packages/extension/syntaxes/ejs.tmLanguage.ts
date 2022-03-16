import * as vscodeEjs from 'vscode-ejs';

const tagDelimeters = ['%', '?'];

export default function getConfigString() {
	const config = {
		name: 'Embedded JavaScript',
		scopeName: 'text.html.ejs',
		injectionSelector: 'L:text.html',
		patterns: [
			{ include: '#ejs-tag-block-comment' },
			{ include: '#ejs-single-line-tag' },
			{ include: '#ejs-tag' },
		],
		repository: vscodeEjs.getRepository(tagDelimeters, {
			languageName: 'ejs',
			sourceLanguageName: 'js',
		}),
	};

	return JSON.stringify(config);
}
