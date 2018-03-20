<img src="https://raw.githubusercontent.com/NateDigital/robust-promise/master/doc/logo.png" />

[![CircleCI](https://circleci.com/gh/NateDigital/robust-promise.svg?style=svg)](https://circleci.com/gh/NateDigital/robust-promise)

 * **Production Ready**
 * Takes your promise and returns a **robust-promise**
 * retries execution several times for extra reliability
 * Simple and easy to use
 * Highly configurable and flexible
 * It's magic!

---

## Simple Usage

First of all, import the library:

```js
const robustPromise = require('robust-promise')
```

Let's say for example, you want to send an email. You already have a `sendEmail` function that returns a promise.


```js 
robustPromise(sendEmail)
```

Wow, that was painless!

Note that `sendMail` is used here as an **example only**. You can use this for anything!

You can then treat your robust promise function, just like you would of treated your original function, e.g.

```js 
robustPromise(sendEmail)
  .then(console.log('so robust'))
  .catch(console.log('wow'))
```

By default, robust-promise will try to send your email three times before rejecting. The delay between each attempt will exponentially increase according to the attempot number.

Note: robust-promise actually expects a function that returns a promise, not an actual promise. So, if you need to pass options to your function, you can wrap it in a function like so:

```js 
robustPromise(() => sendEmail(options))
```

---

## Advanced Usage

Let's say that you want to configure the number of retries to 6. That's easy:

```js 
robustPromise(sendEmail, 6)
```

---

## Next-Level Usage

Let's say that you want to configure the number of retries to 20, and the delay to half a second. Here you go:

```js 
robustPromise(sendEmail, 20, 0.5)
```

---

## HARDCORE USAGE

Let's say that you are a hardcore mofo, you want to configure the number of retries to 10, with a ten sencond delay. But you are also so hard, that you don't want the delay to exponentially increase. We have you covered:

```js 
const cfg = {
  retries: 10,
  delay: 10,
  exp: false
}

robustPromise(sendEmail, cfg.retries, cfg.delay, cfg.exp)
```

---

## Contributing

Contributions are more than welcome! To contribute

 - Opening a pull request
 - Reporting an issue


## Tests

To run the unit tests:

```
npm test
```
