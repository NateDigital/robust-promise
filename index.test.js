const robustPromise = require('./')

const workingService = () => new Promise((resolve, reject) => resolve({msg: 'it works!'}))
const brokenService = () => new Promise((resolve, reject) => reject({msg: 'broken!'}))
const throwingService = () => new Promise((resolve, reject) => {
    throw new Error('threw!')
})
const returnFlakeyService = howManyTriesTillItWorks => {
    let tries = 0
    return () => new Promise((resolve, reject) => {
        tries++
        if (tries >= howManyTriesTillItWorks) return resolve({msg: 'flakey!'})
        return reject({msg: 'broken!'})
    })
}
describe('robust-promise success cases', () => {
    
    test('will resolve working promise instantly using default settings', async () => {
        jest.setTimeout(500)
        const fn = jest.fn(workingService)
        await expect(robustPromise(fn)).resolves.toEqual({msg: 'it works!'})
        expect(fn).toHaveBeenCalledTimes(1)
    })
    
    test('will resolve working promise instantly without any retries', async () => {
        jest.setTimeout(500)
        const fn = jest.fn(workingService)
        await expect(robustPromise(fn, 1)).resolves.toEqual({msg: 'it works!'})
        expect(fn).toHaveBeenCalledTimes(1)
    })
    
    test('will resolve a flakey promise after retrying twice, using default props', async () => {
        jest.setTimeout(15000)
        const fn = jest.fn(returnFlakeyService(3))
        await expect(robustPromise(fn)).resolves.toEqual({msg: 'flakey!'})
        expect(fn).toHaveBeenCalledTimes(3)
    })
    
    test('will resolve a flakey promise after retrying three times using custom timeout', async () => {
        jest.setTimeout(15000)
        const fn = jest.fn(returnFlakeyService(3))
        await expect(robustPromise(fn, 3, 1)).resolves.toEqual({msg: 'flakey!'})
        expect(fn).toHaveBeenCalledTimes(3)
    })
    
    test('will resolve a flakey promise after retrying 10 times', async () => {
        jest.setTimeout(18000)
        const fn = jest.fn(returnFlakeyService(10))
        await expect(robustPromise(fn, 10, 0.9)).resolves.toEqual({msg: 'flakey!'})
        expect(fn).toHaveBeenCalledTimes(10)
    })
    
    test('will resolve a flakey promise after retrying 3 times, with exponential set to false', async () => {
        jest.setTimeout(15000)
        const fn = jest.fn(returnFlakeyService(3))
        await expect(robustPromise(fn, 3, 0.1, false)).resolves.toEqual({msg: 'flakey!'})
        expect(fn).toHaveBeenCalledTimes(3)
    })
    
    test('will resolve a flakey promise after retrying 50 times', async () => {
        jest.setTimeout(15000)
        const fn = jest.fn(returnFlakeyService(50))
        await expect(robustPromise(fn, 50, 0.01)).resolves.toEqual({msg: 'flakey!'})
        expect(fn).toHaveBeenCalledTimes(50)
    })
    
    test('will resolve a flakey promise after retrying 25 times', async () => {
        jest.setTimeout(15000)
        const fn = jest.fn(returnFlakeyService(25))
        await expect(robustPromise(fn, 25, 0.001)).resolves.toEqual({msg: 'flakey!'})
        expect(fn).toHaveBeenCalledTimes(25)
    })
})

describe('robust-promise failure cases', () => {
    
    test('will reject broken promise using default amount of retries', async () => {
        jest.setTimeout(20000)
        const fn = jest.fn(brokenService)
        await expect(robustPromise(fn)).rejects.toEqual({msg: 'broken!'})
        expect(fn).toHaveBeenCalledTimes(3)
    })
    
    test('will reject a broken promise after retrying 10 times', async () => {
        jest.setTimeout(18000)
        const fn = jest.fn(brokenService)
        await expect(robustPromise(fn, 10, 0.9)).rejects.toEqual({msg: 'broken!'})
        expect(fn).toHaveBeenCalledTimes(10)
    })
    
    // test('will reject a function that throws after retrying 10 times', async () => {
    //     jest.setTimeout(18000)
    //     const fn = jest.fn(throwingService)
    //     await expect(robustPromise(fn, 10, 0.9)).toThrow(new Error('threw!'))
    //     expect(fn).toHaveBeenCalledTimes(10)
    // })
    
    test('will reject a function that throws after retrying 10 times', async () => {
        jest.setTimeout(18000)
        const fn = jest.fn(throwingService)
        await expect(robustPromise(fn, 10, 0.9)).rejects.toEqual(new Error('threw!'))
        expect(fn).toHaveBeenCalledTimes(10)
    })
    
    test('will reject a very flakey promise after retrying 3 times, with exponential set to false', async () => {
        jest.setTimeout(15000)
        const fn = jest.fn(returnFlakeyService(4))
        await expect(robustPromise(fn, 3, 0.1, false)).rejects.toEqual({msg: 'broken!'})
        expect(fn).toHaveBeenCalledTimes(3)
    })
    
    test('will reject a very flakey promise after retrying 50 times', async () => {
        jest.setTimeout(15000)
        const fn = jest.fn(returnFlakeyService(51))
        await expect(robustPromise(fn, 50, 0.01)).rejects.toEqual({msg: 'broken!'})
        expect(fn).toHaveBeenCalledTimes(50)
    })

    test('will reject a very flakey promise after retrying 25 times', async () => {
        jest.setTimeout(15000)
        const fn = jest.fn(returnFlakeyService(26))
        await expect(robustPromise(fn, 25, 0.001)).rejects.toEqual({msg: 'broken!'})
        expect(fn).toHaveBeenCalledTimes(25)
    })
})

