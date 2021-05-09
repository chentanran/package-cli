'use strict';

const path = require('path')
const Package = require('@package-cli-dev/package')
const log = require('@package-cli-dev/log')

const SETTINGS = {
    init: '@package-cli-dev/init'
}

const CACHE_DIR = 'dependencies'

function exec() {
    let targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH
    let storeDir = ''
    log.verbose('targetPath', targetPath)
    log.verbose('homePath', homePath)

    // console.log(arguments, 'arguments')
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

        if (packages.exists()) {
            // 更新 package
        } else {
            // 安装 package
            packages.install()
        }
    } else {
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion
        })
    }

   const rootFile = packages.getRootFilePath()
   if (rootFile) {
    require(rootFile).apply(null, arguments)
   }
}

module.exports = exec;
