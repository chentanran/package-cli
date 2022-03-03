const mysql = require('mysql2/promise')
const { mysqlConf } = require('../config/envs/dev')

async function testMysqlConn() {
  const connection = await mysql.createConnection(mysqlConf)
  const [rows] = await connection.execute('select now();')
  return rows
}

// ;(async () => {
// 	const rows = await testMysqlConn()
// 	console.log(rows)
// })()

module.exports = testMysqlConn
