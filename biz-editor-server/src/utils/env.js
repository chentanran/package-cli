const ENV = process.env.NODE_ENV || ''

module.exports = {
	ENV,
	isprd: ENV === 'production',
	isPrdDev: ENV === 'prd_dev',
	isDev: ENV === 'dev',
	isTest: ENV.indexOf('test') === 0,
	isTestLocal: ENV === 'test_local',
	isTestRemote: ENV === 'test_remote'
}