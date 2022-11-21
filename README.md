# tap ssc
Run tests in a browser environment from the command line

This depends on having the `ssc` command available on your shell. Install it
[from here](https://sockets.sh/).

## install
```
npm i -D @nichoth/tap-ssc
```

## use
Bundle your client side JS, then pipe it into this tool, which is installed as the `tap-ssc` command.

Your tests will be running in a browser environment, but all tap output will go to the terminal.

```
esbuild --bundle test/index.js | npx tap-ssc
```

Use it as a part of `package.json` scripts:
```js
"scripts": {
    "test": "esbuild --bundle test/index.js | tap-ssc"
},
```

The test script must exit the process when tests are done. Here we use `testContext` to do that, exposed at `'@nichoth/tap-ssc/index.mjs'`

## example

```js
// test/index.js
import tapzero from 'tapzero'
const { test } = tapzero
import testContext from '@nichoth/tap-ssc/index.mjs'

testContext(tapzero, { headless: true })

test('browser environment', t => {
    t.ok(window, 'window should exist')
})
```

Then in the terminal:
```
npx esbuild --bundle test/index.js | npx tap-ssc
```

see [this example](https://github.com/nichoth/tap-ssc-example)
