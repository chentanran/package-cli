const fse = require('fs-extra')
const ejs = require('ejs')

async function ejsRender(option) {
  const dir = process.cwd()
  const projectInfo = option.projectInfo
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
              })
          })).then(() => {
              resolve()
          }).catch(() => {
              reject()
          })
      })
  })
}

function install(options) {
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
  options.description = projectInfo.description
  try {
    // 获取缓存文件路径
    // 获取当前目录路径
    const { sourcePath, targetPath } = options
    // 创建资源目录
    fse.ensureDirSync(sourcePath)
    fse.ensureDirSync(targetPath)
    // 复制文件或目录
    fse.copySync(sourcePath, targetPath)
  } catch(e) {
      throw e
  } finally {
      spinner.stop(true)
      log.success('模板安装成功')
  }
  // 从接口中读取忽略文件
  let templateIgnore = options.templateInfo.ignore || []
  const ignore = ['node_modules/**', ...templateIgnore]
  await ejsRender({ ignore, options })
  // 依赖安装
  // const { installCommand, startCommand } = this.templateInfo
  // await this.execCommand(installCommand, '依赖安装过程失败！')
  // await this.execCommand(startCommand, '启动过程失败！')
}

module.exports = install