'use strict';

const Package = require('@package-cli-dev/package')
const log = require('@package-cli-dev/log')

const SETTINGS = {
    init: '@package-cli-dev/init'
}

function exec() {
    const targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH
    log.verbose('targetPath', targetPath)
    log.verbose('homePath', homePath)

    // console.log(arguments, 'arguments')
    const cmdObj = arguments[arguments.length - 1]
    const cmdName = cmdObj.name()
    const packageName = SETTINGS[cmdName]
    const packageVersion = 'latest'

    const packages = new Package({
        targetPath,
        packageName,
        packageVersion
    })
    console.log(packages)
}

module.exports = exec;
