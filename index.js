/**
 * Takes your promise and return a robust promise.
 * Retries your promise a number of times before rejecting. 
 * 
 * @param {function} promiseFunc - Function you wish to pass in that returns a promise
 * @param {number} maxTries - (optional, default=3) the number of times you want to retry
 * @param {number} delay - (optional, default=3000) seconds to wait before retrying
 * @param {boolean} exponential - (optional, default=true)
 * @returns {Promise} - Returns a robust promise
 */
module.exports = (promiseFunc, maxTries = 3, delay = 3, exponential = true) => 
  new Promise((resolve, reject) => {
    let tries = 0
    const tryResolve = () => {
      tries++
      promiseFunc()
        .then(data => resolve(data))
        .catch(err => {
          if (tries >= maxTries) return reject(err)
          else setTimeout(tryResolve, exponential ? Math.pow(delay, tries) * 1000 : delay)
        })
    }
    tryResolve()
  })
