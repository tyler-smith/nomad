// This file contains our test's global after hooks

const utils = require('./../utils/ipfs-utils')

after(() => {
  utils.cleanRepo()
})