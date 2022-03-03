module.exports = {
	types: [
			{
					value: 'WIP',
					name: '💡  WIP: Work in progress', // 开发中
			},
			{
					value: 'feat',
					name: '🚀  feat: A new feature', // 新功能
			},
			{
					value: 'fix',
					name: '🔧  fix: A bug fix', // 修改bug
			},
			{
					value: 'refactor',
					name: '🔨  refactor: A code change that neither fixes a bug nor adds a feature', // 既不修复bug也不添加特性的代码更改
			},
			{
					value: 'release',
					name: '🛳  release: Bump to a new Semantic version', // 新版本
			},
			{
					value: 'docs',
					name: '📚  docs: Documentation only changes', // 文档
			},
			{
					value: 'test',
					name: '🔍  test: Add missing tests or correcting existing tests', // 测试
			},
			{
					value: 'perf',
					name: '⚡️  perf: Changes that improve performance', // 提高性能的更改
			},
			{
					value: 'chore',
					name:
							"🚬  chore: Changes that don't modify src or test files. Such as updating build tasks, package manager", // 构建过程或辅助工具的变动
			},
			{
					value: 'workflow',
					name:
							'📦  workflow: Changes that only affect the workflow. Such as updating build systems or CI etc.', // 影响工作流的修改
			},
			{
					value: 'style',
					name:
							'💅  style: Code Style, Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)', // 样式
			},
			{
					value: 'revert',
					name: '⏱  revert: Revert to a commit', // 恢复提交
			},
	],
	// Specify the scopes for your particular project
	scopes: [],
	allowCustomScopes: true,
	allowBreakingChanges: ['feat', 'fix'],
}
