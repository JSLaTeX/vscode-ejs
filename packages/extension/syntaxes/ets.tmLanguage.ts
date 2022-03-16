import { outdent } from 'outdent';
import escapeStringRegexp from 'escape-string-regexp';

// https://stackoverflow.com/a/34755045
function r(regexString: string) {
	return regexString
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line !== '') // don't include empty lines
		.join('');
}

const tagDelimeters = ['%', '?'];

function getRepository() {
	const etsBeginTag = (delimiter: string) =>
		`<${escapeStringRegexp(delimiter)}[_=-]?`;
	const etsEndTag = (delimiter: string) =>
		`[_-]?${escapeStringRegexp(delimiter)}>`;

	return {
		// Comments that use the ETS <?# tag
		'tag-block-comment': {
			name: 'comment.block.ets',
			contentName: 'comment.block.ts',
			begin: '<(\\?)#',
			beginCaptures: {
				'0': {
					name: 'punctuation.definition.comment.ts',
				},
			},
			end: String.raw`\1>`,
			endCaptures: {
				'0': {
					name: 'punctuation.definition.comment.ts',
				},
			},
		},
		'tag-ets': {
			patterns: tagDelimeters.map((char) => ({
				begin: r(
					outdent.string(String.raw`
						(${etsBeginTag(char)})
						(
							(?:
								(?!${etsEndTag(char)}).
							)*
						)
					`)
				),
				beginCaptures: {
					'1': {
						name: 'punctuation.section.embedded.begin',
					},
					'2': {
						name: 'meta.embedded.ets',
						patterns: [{ include: 'source.ts' }],
					},
				},
				end: r(
					outdent.string(String.raw`
						(
							(?:
								(?!${etsEndTag(char)}).
							)*
						)
						(${etsEndTag(char)})
					`)
				),
				endCaptures: {
					'1': {
						name: 'meta.embedded.ets',
						patterns: [{ include: 'source.ts' }],
					},
					'2': {
						name: 'punctuation.section.embedded.end',
					},
				},
				// Matched against the part between the begin and end matches
				patterns: [
					{
						contentName: 'meta.embedded.ts',
						begin: String.raw`(?:^|\G).*`,
						// the `.*` is needed so that we can have TS before the end tag
						while: String.raw`(?:^|\G)((?!.*${etsEndTag(char)}))`,
						patterns: [{ include: 'source.ts' }],
					},
				],
			})),
		},
		'single-line-tag-ets': {
			patterns: tagDelimeters.map((char) => ({
				begin: r(
					outdent.string(String.raw`
						(${etsBeginTag(char)})
						(
							(?:
								(?!${etsEndTag(char)}).
							)+
						)
						(?=${etsEndTag(char)})
					`)
				),
				beginCaptures: {
					'1': {
						name: 'punctuation.section.embedded.begin',
					},
					'2': {
						name: 'meta.embedded.ets',
						patterns: [{ include: 'source.ts' }],
					},
				},
				end: etsEndTag(char),
				endCaptures: {
					'0': {
						name: 'punctuation.section.embedded.end',
					},
				},
			})),
		},
	};
}

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
		repository: getRepository(),
	};

	return JSON.stringify(config);
}
