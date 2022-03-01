const router = require('koa-router')()
const ENV = require('../utils/env')
const packageInfo = require('../../package.json')
const testMysqlConn = require('../db/mysql2')
const { WorkModel } = require('../models/WorkModel')

router.get('/api/db-check', async (ctx, next) => {
  // 测试 mysql 连接
  const mysqlRes = await testMysqlConn()

  // 测试 mongodb 连接
  let mongodbConn
  try {
      mongodbConn = true
      await WorkModel.findOne()
  } catch (ex) {
      mongodbConn = false
  }

  ctx.body = {
    error: 0,
    data: {
      name: '哇哇哇哇',
      ENV,
      version: packageInfo.version,
      mysqlConn: mysqlRes.length,
      mongodbConn
    }
  }
})

module.exports = router
