const createESLintConfig = require('lionconfig');

module.exports = createESLintConfig(__dirname, {
	rules: {
		'unicorn/filename-case': 'off';
	}
});

