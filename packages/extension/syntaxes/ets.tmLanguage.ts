import * as vscodeEjs from 'vscode-ejs';

const tagDelimeters = ['%', '?'];

export default function getConfigString() {
	const config = {
		name: 'Embedded JavaScript',
		scopeName: 'text.html.ets',
		injectionSelector: 'L:text.html',
		patterns: [
			{ include: '#tag-block-comment' },
			{ include: '#single-line-tag-ets' },
			{ include: '#tag-ets' },
		],
		repository: vscodeEjs.getRepository(tagDelimeters),
	};

	return JSON.stringify(config);
}
