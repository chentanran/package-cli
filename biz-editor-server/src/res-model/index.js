/**
 * 基础模型，包括 error data 和 message
 */
class BaseRes {
  constructor({ error, data, message }) {
    this.error = error
    if (data) {
      this.data = data
    }
    if (message) {
      this.message = message
    }
  }
}

/**
 * 执行失败的数据模型
 */
class ErrorRes extends BaseRes {
  constructor({ error = -1, message = '', data }, addMessage = '') {
    super({
      error,
      message: addMessage ? `${message} - ${addMessage}` : message,
      data,
    })
  }
}

/**
 * 执行成功的数据模型
 */
class SuccessRes extends BaseRes {
  constructor(data = {}) {
    super({
      error: 0,
      data,
    })
  }
}

module.exports = {
  ErrorRes,
  SuccessRes,
}
