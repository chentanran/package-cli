const { get } = require('./_server')

test('数据库连接', async () => {
    const { data, error } = await get('/api/db-check')

    const { redisConn, mysqlConn, mongodbConn } = data

    expect(error).toBe(0)
    expect(redisConn).toBe(true)
    expect(mysqlConn).toBe(true)
    // expect(mongodbConn).toBe(true)
})