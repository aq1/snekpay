/** @type {import('prettier').Config} */
const config = {
	semi: false,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	pluginSearchDirs: ['.'],
	overrides: [{ 'files': '*.svelte', 'options': { 'parser': 'svelte' } }],
	plugins: [require.resolve('prettier-plugin-svelte'), require.resolve('prettier-plugin-tailwindcss')]
}

module.exports = config
