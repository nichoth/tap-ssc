# tap ssc
Run tests in a browser environment from the command line.

The interface is inspired by [tape-run](https://www.npmjs.com/package/tape-run). Just pipe some JS into the `tap-ssc` command, and your tests will run in a browser environment.

## install
```
npm i -D @nichoth/tap-ssc
```

[!NOTE]  
There is some flakiness with [@socketsupply/socket](https://github.com/socketsupply/socket) & headless mode.

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

Or on the command line:
```sh
npx esbuild --bundle test/index.js | npx tap-ssc
```

## example
```js
// example/test/index.js
import { test } from '@nichoth/tapzero'

test('browser environment', t => {
    t.ok(window, 'window should exist')
})
```

Then in the terminal:
```
npx esbuild --bundle test/index.js | npx tap-ssc
```

see [this example](https://github.com/nichoth/tap-ssc/blob/main/example/package.json#L2)

### pass in your own html file
Use command line argument `--html=filename.html`

```
esbuild --bundle --platform=browser --format=esm test/html.js | tap-ssc --html=test.html | tap-arc
```

In the html, be sure to include a script tag pointing at `bundle.js`:
```html
    <script charset="utf-8" src="bundle.js" type="module"></script>
```


## how does this work?
We build an `ssc` binary [once after you install this package](./package.json#L16)

The `ssc build` script calls [./build.mjs](./build.mjs), which builds the ssc binary with an html file that links to `bundle.js`.

The package binary, `./cli.js`, takes javascript that is piped to `stdin`, and writes it to a file at the right location -- `target + /bundle.js`. Then it runs the ssc binary and pipes the output to `stdout`.

## test this module
This will use the `example` directory to install this as a dependency, then run a given test.

### A passing test
```
npm test | npx tap-arc
```

### A failing test
```
npm run test-fail
```

### A test that throws an error
```
npm run test-err
```
