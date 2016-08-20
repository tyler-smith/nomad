'use strict'

const R = require('ramda')
const log = require('./log')

// func must return a promise
const setTimeoutP = (func, time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      func()
        .then((data) => {
          log('setTimeoutP resolving')
          resolve(data)
        })
        .catch((error) => {
          log('setTimeoutP rejecting')
          reject(error)
        })
    }, time)
  })
}

// Tries to call func every few milliseconds
// attemptTimers is array of milliseconds to delay calls
const repeatAttempt = (attemptTimers, func) => {
  if (!R.isArrayLike(attemptTimers)) {
    throw new Error('repeatAttempt expected array of times')
  }

  if (R.isEmpty(attemptTimers)) {
    log('repeatAttempt failed for the last time')
    return Promise.reject({ repeatAttempt: 'exhausted attempts' })
  }

  return func()
    .then((data) => {
      log('repeatAttempt succeeded')
      return Promise.resolve(data)
    })
    // TODO check whether rejected promise is one of our errors or not
    // if its ours, recurse to retry, if not reject to caller
    .catch((error) => {
      log('repeatAttempt failed')
      return setTimeoutP(() => {
        return repeatAttempt( R.tail(attemptTimers), func)
      }, R.head(attemptTimers))
    })
}

module.exports = { setTimeoutP, repeatAttempt }
