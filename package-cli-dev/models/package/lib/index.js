'use strict';

const path = require('path')
const pkgDir = require('pkg-dir').sync
const pathExists = require('path-exists').sync
const npminstall = require('npminstall')
const fse = require('fs-extra')
const { isObject } = require('@package-cli-dev/utils')
const formatPath = require('@package-cli-dev/format-path')
const { getDefaultRegistry, getNpmLatestVersion } = require('@package-cli-dev/get-npm-info')

class Package {
    constructor(options) {
        if (!options) {
            throw new Error('Package类的options参数不能为空！')
        }
        if (!isObject(options)) {
            throw new Error('Package类的options参数必须为对象！')
        }
        // package得路径
        this.targetPath = options.targetPath
        // package的存储路径
        this.storePath = options.storePath
        // package的默认路径
        this.storeDir = options.storeDir
        // package 的 name
        this.packageName = options.packageName
        // package 的 version
        this.packageVersion = options.packageVersion
        // package 的缓存目录前缀
        this.cacheFilePathPrefix = this.packageName.replace('/', '_')
    }

    // 获取最后一个版本
    async prepare() {
        if (this.storeDir && !pathExists(this.storeDir)) {
            fse.mkdirpSync(this.storeDir)
        }
        if (this.packageVersion === 'latest') {
            this.packageVersion = await getNpmLatestVersion(this.packageName)
        }
    }

    // 下载到本地的缓存路径
    get cacheFilePath() {
        return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this,this.packageName}`)
    }

    // 拼接传入的版本号
    getSpecificCacheFilePath(packageVersion) {
        return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${packageVersion}@${this,this.packageName}`)
    }

    // 判断当前 Package 是否存在
    async exists() {
        if (this.storeDir) {
            await this.prepare()
            return pathExists(this.cacheFilePath)
        } else {
            return pathExists(this.targetPath)
        }
    }

    // 安装 Package
    install() {
        npminstall({
            root: this.targetPath,
            storeDir: this.storeDir,
            registry: getDefaultRegistry(true),
            pkgs: [{ 
                name: this.packageName, 
                version: this.packageVersion 
            }]
        })
    }

    // 更新 Package
    async update() {
        await this.prepare()
        // 1. 获取最新的 npm 模块版本号
        const latestPackageVersion = await getNpmLatestVersion(this.packageName)
        // 2. 查询最新版本号对应的路径是否存在
        const latestFilePath = this.getSpecificCacheFilePath(latestPackageVersion)
        // 3. 如果不存在，则直接安装最新版本
        if (!pathExists(latestFilePath)) {
            await npminstall({
                root: this.targetPath,
                storeDir: this.storeDir,
                registry: getDefaultRegistry(true),
                pkgs: [{ 
                    name: this.packageName, 
                    version: latestPackageVersion 
                }]
            })
        }
    }

    // 获取入口文件得路径
    getRootFilePath() {
        function _getRootFile(targetPath) {
            // 1. 获取 package.json 所在目录
            const dir = pkgDir(targetPath)
            if (dir) {
                // 2. 读取 package.json
                const pkgFile = require(path.resolve(dir, 'package.json'))
                // 3. 寻找 main/lib
                if (pkgFile && pkgFile.main) {
                    // 4. 路径的兼容(macOS/windows)
                    return formatPath(path.resolve(dir, pkgFile.main))
                }
            }
            return null
        }
        
        if (this.storeDir) {
            return _getRootFile(this.cacheFilePath)
        } else {
            return _getRootFile(this.targetPath)
        }
    }
}

module.exports = Package;
 