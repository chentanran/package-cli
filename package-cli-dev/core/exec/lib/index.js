'use strict';

const path = require('path')
const cp = require('child_process')
const Package = require('@package-cli-dev/package')
const log = require('@package-cli-dev/log')
const { spawn } = require('@package-cli-dev/utils')

const SETTINGS = {
    init: '@package-cli-dev/init'
}

const CACHE_DIR = 'dependencies'

async function exec() {
    let targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH
    let storeDir = ''

    log.verbose('targetPath', targetPath)
    log.verbose('homePath', homePath)

    const cmdObj = arguments[arguments.length - 1]
    const cmdName = cmdObj.name()
    const packageName = SETTINGS[cmdName]
    const packageVersion = 'latest'

    let packages = ''
    if (!targetPath) {
        // 生成缓存路径
        targetPath = path.resolve(homePath, CACHE_DIR)
        storeDir = path.resolve(targetPath, 'node_modules')
        log.verbose('targetPath', targetPath)
        log.verbose('storeDir', storeDir)

        packages = new Package({
            targetPath,
            packageName,
            packageVersion,
            storeDir
        })

        if (await packages.exists()) {
            // 更新 package
            packages.update()
        } else {
            // 安装 package
            packages.install()
        }
    } else {
        packages = new Package({
            targetPath,
            packageName,
            packageVersion
        })
    }

   const rootFile = packages.getRootFilePath()
   // 如果为空 会抛出异常
   if (rootFile) {
        const args = Array.from(arguments)
        const cmd = args[args.length - 1]

        const o = Object.create(null)
        Object.keys(cmd).forEach(key => {
            if (cmd.hasOwnProperty(key) && key !== 'parent') {
                o[key] = cmd[key]
            }
        })
        
        args[args.length - 1] = o
        // require(rootFile).call(null, Array.from(arguments))
        const code = `require('${rootFile}').call(null, ${JSON.stringify(args)})`
        // const child = cp.spawn('node', ['-e', code], {
        //     cwd: process.cwd(),
        //     stdio: 'inherit'
        // })
        const child = spawn('node', ['-e', code], {
            cwd: process.cwd(),
            stdio: 'inherit'
        })
        child.on('error', e => {
            log.error(e.message)
            process.exit(1)
        })
        child.on('exit', e => {
            log.verbose('命令执行成功:' + e)
        })
   }
}

// 兼容 window
// function spawn(command, args, options) {
//     const win32 = process.platform === 'win32'
//     const cmd = win32 ? 'cmd' : command
//     const cmdArgs = win32 ? ['/c'].concat(command, args) : args
//     return cp.spawn(cmd, cmdArgs, options || {})
// }

module.exports = exec;
