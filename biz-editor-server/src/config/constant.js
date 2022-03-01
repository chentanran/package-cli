module.exports = {
	// 密码加密 密钥
	PASSWORD_SECRET: 'qdqwer#',
	
	// jwt 密钥
	JWT_SECRET: 'secret_for-json#web$token',

	// jwt 可忽略 path: 全部忽略即可，需要登录验证的， 自己用 loginCheck
	JWT_LGNORE_PATH: [/\//],

	// 查询列表， 默认分页配置
	DEFAULT_PAGE_SIZE: 8
}