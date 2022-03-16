import { outdent } from 'outdent';
import escapeStringRegexp from 'escape-string-regexp';
import { r } from './regex.js';

type GetRepositoryOptions = {
	languageName: string;
	sourceLanguageName: string;
};

export function getGrammar(
	tagDelimiters: string[],
	{ languageName, sourceLanguageName }: GetRepositoryOptions
) {
	const beginTag = (delimiter: string) =>
		`<${escapeStringRegexp(delimiter)}[_=-]?`;
	const endTag = (delimiter: string) =>
		`[_-]?${escapeStringRegexp(delimiter)}>`;

	const repository = {
		// Comments that use the EJS/ETS <?# tag
		[`${languageName}-tag-block-comment`]: {
			patterns: tagDelimiters.map((char) => ({
				name: `comment.block.${languageName}`,
				contentName: `comment.block.${sourceLanguageName}`,
				begin: `<(${escapeStringRegexp(char)})#`,
				beginCaptures: {
					'0': {
						name: `punctuation.definition.comment.${sourceLanguageName}`,
					},
				},
				end: String.raw`\1>`,
				endCaptures: {
					'0': {
						name: `punctuation.definition.comment.${sourceLanguageName}`,
					},
				},
			})),
		},
		[`${languageName}-tag`]: {
			patterns: tagDelimiters.map((char) => ({
				begin: r(
					outdent.string(String.raw`
						(${beginTag(char)})
						(
							(?:
								(?!${endTag(char)}).
							)*
						)
					`)
				),
				beginCaptures: {
					'1': {
						name: 'punctuation.section.embedded.begin',
					},
					'2': {
						name: `meta.embedded.${languageName}`,
						patterns: [{ include: `source.${sourceLanguageName}` }],
					},
				},
				end: r(
					outdent.string(String.raw`
						(
							(?:
								(?!${endTag(char)}).
							)*
						)
						(${endTag(char)})
					`)
				),
				endCaptures: {
					'1': {
						name: `meta.embedded.${languageName}`,
						patterns: [{ include: `source.${sourceLanguageName}` }],
					},
					'2': {
						name: 'punctuation.section.embedded.end',
					},
				},
				// Matched against the part between the begin and end matches
				patterns: [
					{
						contentName: `meta.embedded.${languageName}`,
						begin: String.raw`(?:^|\G).*`,
						// the `.*` is needed so that we can have JS before the end tag
						while: String.raw`(?:^|\G)((?!.*${endTag(char)}))`,
						patterns: [{ include: `source.${sourceLanguageName}` }],
					},
				],
			})),
		},
		[`${languageName}-single-line-tag`]: {
			patterns: tagDelimiters.map((char) => ({
				begin: r(
					outdent.string(String.raw`
						(${beginTag(char)})
						(
							(?:
								(?!${endTag(char)}).
							)+
						)
						(?=${endTag(char)})
					`)
				),
				beginCaptures: {
					'1': {
						name: 'punctuation.section.embedded.begin',
					},
					'2': {
						name: `meta.embedded.${languageName}`,
						patterns: [{ include: `source.${sourceLanguageName}` }],
					},
				},
				end: endTag(char),
				endCaptures: {
					'0': {
						name: 'punctuation.section.embedded.end',
					},
				},
			})),
		},
	};

	const patterns = [
		{ include: `#${languageName}-tag-block-comment` },
		{ include: `#${languageName}-tag` },
		{ include: `#${languageName}-single-line-tag` },
	];

	return { repository, patterns };
}
