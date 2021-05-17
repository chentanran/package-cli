'use strict';

const axios = require('axios')

// 基础路径
const BASE_URL = process.env.PACKAGE_CLI_BASE_URL ? process.env.PACKAGE_CLI_BASE_URL : 'http://127.0.0.1:7001'

// 基础设置
const request = axios.create({
    baseURL: BASE_URL,
    timeout: 5000
})

// 响应拦截
request.interceptors.response.use(res => {
    return res.data
}, err => {
    return Promise.reject(err)
})

module.exports = request;