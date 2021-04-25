'use strict';

module.exports = core;

const path = require('path')
const semver = require('semver')
const colors = require('colors')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const log = require('@package-cli-dev/log')

const pkg = require('../package.json')
const constant = require('./const');

let args = {}

async function core() {
    // TODO
    try {
        checkPkgVersion() // 查看包版本
        checkNodeVersion() // 检查node版本
        checkRoot()
        checkUserHome()
        checkInputArgs()
        checkEnv()
       await checkGlobalUpdate() 
    } catch(e) {
        log.error(e.message)
    }
}

async function checkGlobalUpdate() {
    // 获取当前版本号
    const currentVersion = pkg.version
    const npmName = pkg.name
    const { getNpmSemverVersion } = require('@package-cli-dev/get-npm-info')
    const lastVersions = await getNpmSemverVersion(currentVersion, npmName)
    // 获取最新版本号，提示用户更新到该版本
    // if (lastVersions && semver.gt(lastVersions, currentVersion)) {
        log.warn(colors.yellow(`请手动更新${npmName}, 当前版本：${currentVersion}, 最新版本：${lastVersions}     
            更新命令： npm install -g ${npmName}
        `))
    // }
}

function checkEnv() {
    const dotenv = require('dotenv')
    const dotenvPath = path.resolve(userHome, '.env')
    console.log(pathExists(dotenvPath), dotenvPath, 'pathExists(dotenvPath)')
    if (pathExists(dotenvPath)) {
        dotenv.config({
            path: dotenvPath
        })
    }
    createDefaultConfig()
    log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome
    }
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}

function checkInputArgs() {
    const minimist = require('minimist')
    args = minimist(process.argv.slice(2))
    console.log(args)
    checkArgs()
}

function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose'
    } else {
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
}

function checkUserHome() {
    console.log(userHome)
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'))
    }
}

function checkRoot() {
    // 由于 window 不支持 geteuid 方法，没法测试
    // console.log(process.geteuid())
    const rootCheck = require('root-check')
    rootCheck()
}

function checkNodeVersion() {
    const currentVersion = process.version
    const lowestVersion = constant.LOWEST_NODE_VERSION
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`package-cli 需要安装 v${lowestVersion}以上版本`))
    }
}

function checkPkgVersion() {
    log.info('cli', pkg.version)
}
