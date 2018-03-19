const robustPromise = require('./')

const workingService = () => new Promise((resolve, reject) => resolve(true))
const brokenService = () => new Promise((resolve, reject) => reject(false))
const returnFlakeyService = howManyTriesTillItWorks => {
    let tries = 0
    return () => new Promise((resolve, reject) => {
        tries++
        if (tries >= howManyTriesTillItWorks) return resolve(true)
        return reject(false)
    })
}

describe('robust-promise success cases', () => {
    test('will resolve working promise instantly using default settings', async () => {
        jest.setTimeout(500)
        await expect(robustPromise(workingService)).resolves.toBe(true)
    })
    test('will resolve working promise instantly without any retries', async () => {
        jest.setTimeout(500)
        await expect(robustPromise(workingService, 1)).resolves.toBe(true)
    })
    test('will resolve a flakey promise after retrying twice, using default props', async () => {
        jest.setTimeout(15000)
        await expect(robustPromise(returnFlakeyService(3))).resolves.toBe(true)
    })
    test('will resolve a flakey promise after retrying three times using custom timeout', async () => {
        jest.setTimeout(15000)
        await expect(robustPromise(returnFlakeyService(3), 3, 1)).resolves.toBe(true)
    })
    test('will resolve a flakey promise after retrying 10 times', async () => {
        jest.setTimeout(18000)
        await expect(robustPromise(returnFlakeyService(10), 10, 0.9)).resolves.toBe(true)
    })
    test('will resolve a flakey promise after retrying 10 times, with exponential set to false', async () => {
        jest.setTimeout(15000)
        await expect(robustPromise(returnFlakeyService(10), 10, 0.1, false)).resolves.toBe(true)
    })
    test('will resolve a flakey promise after retrying 50 times', async () => {
        jest.setTimeout(15000)
        await expect(robustPromise(returnFlakeyService(50), 50, 0.01)).resolves.toBe(true)
    })
    test('will resolve a flakey promise after retrying 25 times', async () => {
        jest.setTimeout(15000)
        await expect(robustPromise(returnFlakeyService(25), 25, 0.001)).resolves.toBe(true)
    })
})

describe('robust-promise failure cases', () => {
    test('will reject broken promise using default amount of retries', async () => {
        jest.setTimeout(20000)
        await expect(robustPromise(brokenService)).rejects.toBe(false)
    })
    test('will reject a broken promise after retrying 10 times', async () => {
        jest.setTimeout(18000)
        await expect(robustPromise(returnFlakeyService(11), 10, 0.9)).rejects.toBe(false)
    })
    test('will reject a broken promise after retrying 10 times, with exponential set to false', async () => {
        jest.setTimeout(15000)
        await expect(robustPromise(returnFlakeyService(11), 10, 0.1, false)).rejects.toBe(false)
    })
    test('will reject a broken promise after retrying 50 times', async () => {
        jest.setTimeout(15000)
        await expect(robustPromise(returnFlakeyService(51), 50, 0.01)).rejects.toBe(false)
    })
    test('will reject a broken promise after retrying 25 times', async () => {
        jest.setTimeout(15000)
        await expect(robustPromise(returnFlakeyService(26), 25, 0.001)).rejects.toBe(false)
    })
})

