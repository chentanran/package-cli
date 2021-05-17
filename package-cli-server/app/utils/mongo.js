  'use strict'

  const Mongodb = require('../utils/cli-mongodb')
  const { mongodbUrl, mongoDbName } = require('../../config/db')

  function mongo() {
    return new Mongodb(mongodbUrl)
  }

  module.exports = mongo