'use strict';

module.exports = core;

const path = require('path')
const semver = require('semver')
const colors = require('colors')
const userHome = require('user-home')
const commander = require('commander')
const pathExists = require('path-exists').sync
const log = require('@package-cli-dev/log')
const exec = require('@package-cli-dev/exec')

const pkg = require('../package.json')
const constant = require('./const');

let args = {}
const program = new commander.Command()

async function core() {
    // TODO
    try {
        await prepare()
        registerCommand()
    } catch(e) {
        log.error(e.message)
    }
}

function registerCommand() {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '是否开启调试模式', false)
        .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '')
        
    program
        .command('init [projectName]')
        .option('-f, --force', '是否强制初始化项目')
        .action(exec)
    
    program.on('option:debug', function() {
        if (program._optionValues.debug) {
            process.env.LOG_LEVEL = 'verbose'
        } else {
            process.env.LOG_LEVEL = 'info'
        }
        console.log(process.env.LOG_LEVEL, 'cli')
        log.level = process.env.LOG_LEVEL
        log.verbose('test')
    })

    // 指定 targetPath
    program.on('option:targetPath', function() {
        process.env.CLI_TARGET_PATH = program._optionValues.targetPath
    })

    program.on('command:*', function(obj) {
        const availableCommands = program.commands.map(cmd => cmd.name())
        console.log(colors.red('未知命令：' + obj[0]))
        if (availableCommands.length > 0) {
            console.log(colors.red('可用命令：' + availableCommands.join(',')))
        }
    })

    program.parse(process.argv)
    if (program.args && program.args.length < 1) {
        program.outputHelp()
    }
}

async function prepare() {
    checkPkgVersion() // 查看包版本
    checkRoot()
    checkUserHome()
    checkEnv()
   await checkGlobalUpdate() 
}

async function checkGlobalUpdate() {
    // 获取当前版本号
    const currentVersion = pkg.version
    const npmName = pkg.name
    const { getNpmSemverVersion } = require('@package-cli-dev/get-npm-info')
    const lastVersions = await getNpmSemverVersion(currentVersion, npmName)
    // 获取最新版本号，提示用户更新到该版本
    if (lastVersions && semver.gt(lastVersions, currentVersion)) {
        log.warn(colors.yellow(`请手动更新${npmName}, 当前版本：${currentVersion}, 最新版本：${lastVersions}     
            更新命令： npm install -g ${npmName}
        `))
    }
}

function checkEnv() {
    const dotenv = require('dotenv')
    console.log(userHome, 'userHome')
    const dotenvPath = path.resolve(userHome, '.env')
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

// function checkInputArgs() {
//     const minimist = require('minimist')
//     args = minimist(process.argv.slice(2))
//     checkArgs()
// }

// function checkArgs() {
//     if (args.debug) {
//         process.env.LOG_LEVEL = 'verbose'
//     } else {
//         process.env.LOG_LEVEL = 'info'
//     }
//     log.level = process.env.LOG_LEVEL
// }

function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'))
    }
}

function checkRoot() {
    // 由于 window 不支持 geteuid 方法，没法测试
    const rootCheck = require('root-check')
    rootCheck()
}

function checkPkgVersion() {
    log.info('cli', pkg.version)
}
