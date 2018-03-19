<center>
<img src="doc/logo.png" />

</center>

 * **Production Ready**
 * Takes your promise and returns a **robust-promise**
 * **robust-promise** will retry your promise a number of times before rejecting
 * Highly configurable
 * Simple and easy to use
 * It's magic!


---

## Simple Usage


Let's say for example, you want to send an email. You already have a `sendEmail` function that returns a promise.

```js 
const robustPromise = require('robust-promise')

robustPromise(sendEmail)
```

By default, robust-promise will try to send your email three times before rejecting. The delay between each attempt will exponentially increase according to the attempot number.


## Note

We kind of lied to you...Sorry! robust-promise actually expects a function that returns a promise, not an actual promise. So, if you need to pass options to your function, you can wrap it in a function like so:

```js 
const robustPromise = require('robust-promise')

robustPromise(() => sendEmail(options))
```

So easy!


---

## Advanced Usage

Let's say that you want to configure the number of retries to 6. That's easy:

```js 
const robustPromise = require('robust-promise')

robustPromise(sendEmail, 6)
```

---

## Next-Level Usage

Let's say that you want to configure the number of retries to 20, and the delay to half a second. Here you go:

```js 
const robustPromise = require('robust-promise')

robustPromise(sendEmail, 20, 500)
```

---

## HARDCORE USAGE

Let's say that you want to configure the number of retries to 10, with a ten sencond delay. But you also don't want the delay to exponentially increase. That's extremely easy:

```js 
const robustPromise = require('robust-promise')

const cfg = {
  retries: 10,
  delay: 10000,
  exp: false
}

robustPromise(sendEmail, cfg.retries, cfg.delay, cfg.exp)
```

---



so robust, wow!



## Contributing

Contributions are more than welcome! To contribute

 - Opening a pull request
 - Reporting an issue
