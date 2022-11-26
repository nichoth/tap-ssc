# tap ssc
Run tests in a browser environment from the command line.

This depends on having the `ssc` command available in your shell. Install it
[from here](https://sockets.sh/).

The interface is inspired by [tape-run](https://www.npmjs.com/package/tape-run)

## install
```
npm i -D @nichoth/tap-ssc
```

## use
Bundle your client side JS, then pipe it into this tool, which is installed as the `tap-ssc` command.

Your tests will be running in a browser environment, but all tap output will go to the terminal.

```
esbuild --bundle test/index.js | tap-ssc
```

Use it as a part of `package.json` scripts:
```js
"scripts": {
    "test": "esbuild --bundle test/index.js | tap-ssc"
},
```

## example
```js
// example/test/index.js
import { test } from 'tapzero'
// test-context listens for any uncaught errors and exits the
// process on error
import '@nichoth/tap-ssc/test-context'

test('browser environment', t => {
    t.ok(window, 'window should exist')
})
```

Then in the terminal:
```
npx esbuild --bundle test/index.js | npx tap-ssc
```

see [this example](https://github.com/nichoth/tap-ssc/blob/main/example/package.json#L2)


## how does this work?
We build an `ssc` binary once after you install this package: https://github.com/nichoth/tap-ssc/blob/main/package.json#L11

The `ssc build` script calls [./build.mjs](https://github.com/nichoth/tap-ssc/blob/main/build.mjs), which builds the ssc binary with an html file that links to `bundle.js`.

The package binary, `./cli.js` takes javascript that is piped to `stdin`, and writes it to a file at the right location -- `target + /bundle.js`. Then it runs the ssc binary and pipes the output to `stdout`.

## test this module
This will use the `example` directory to install this as a dependency, then run a given test.

A passing test
```
npm test | npx tap-arc
```

A failing test
```
npm run test-fail
```

A test that throws an error
```
npm run test-err
```
