/**
 * Takes your promise and return a robust promise.
 * Retries your promise a number of times before rejecting. 
 * 
 * @param promise the promise that you wish to pass in
 * @param maxTries (optional, default=3) the number of times you want to retry
 * @param delay (optional, default=3000) milliseconds to wait before retrying
 * @param exponential (optional, default=true)
 * @returns Promise
 */
module.exports = (promiseFunc, maxTries = 3, delay = 3000, exponential = true) => 
  new Promise((resolve, reject) => {
    let tries = 0
    const tryResolve = () => {
      tries++
      promiseFunc()
        .then(data => resolve(data))
        .catch(err => {
          if (tries >= maxTries) return reject(err)
          else setTimeout(tryResolve, exponential ? Math.pow(delay, maxTries) : delay)
        })
    }
    tryResolve()
  })
