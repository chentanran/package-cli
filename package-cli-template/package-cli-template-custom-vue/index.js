const path = require('path')
const fse = require('fs-extra')
const ejs = require('ejs')
const inquirer = require('inquirer')
const log = require('@package-cli-dev/log')

async function ejsRender(option) {
  const dir = option.targetPath
  const projectInfo = option.data
  return new Promise((resolve, reject) => {
      require('glob')('**', {
          cwd: dir,
          ignore: option.ignore || '',
          nodir: true
      }, (err, files) => {
          if (err) {
              reject(err)
          }
          Promise.all(files.map(file => {
              const filePath = path.join(dir, file)
              return new Promise((res, rej) => {
                  ejs.renderFile(filePath, projectInfo, {}, (err, result) => {
                      if (err) {
                        rej(err)
                      } else {
                        fse.writeFileSync(filePath, result)
                        res(result)
                      }
                  })
              }).catch(() => {
                reject()
              })
          })).then(() => {
              resolve()
          }).catch(() => {
              reject()
          })
      })
  })
}

async function install(options) {
  const projectPrompt = []
  const descriptionPrompt = {
    type: 'input',
    name: 'description',
    message: '请输入组件描述信息',
    default: '',
    validate: (v) => {
        return !!v
    }
  }
  projectPrompt.push(descriptionPrompt)
  const projectInfo = await inquirer.prompt(projectPrompt)
  options.projectInfo.description = projectInfo.description
  try {
    // 获取缓存文件路径
    // 获取当前目录路径
    const { sourcePath, targetPath } = options
    // 创建资源目录
    fse.ensureDirSync(sourcePath)
    fse.ensureDirSync(targetPath)
    // 复制文件或目录
    fse.copySync(sourcePath, targetPath)

    // 从接口中读取忽略文件
    let templateIgnore = options.templateInfo.ignore || []
    const ignore = ['node_modules/**', ...templateIgnore]
    await ejsRender({ ignore, data: options.projectInfo, targetPath })
  } catch(e) {
      throw e
  } finally {
      log.success('模板安装成功')
  }
}

module.exports = install