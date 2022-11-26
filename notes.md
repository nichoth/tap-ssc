```
browserify app.js | tap-ssc
```

-------------------------------------------

use binary that gets passed the JS tests in stdin

**this is what `tape-run` does. [spawn an electron](https://github.com/juliangruber/electron-stream/blob/main/index.js#L87)**

[uses enstore](https://github.com/juliangruber/browser-run/blob/main/index.js#L38) to get the JS bundle from `stdin`.

how do you get this bundle into the app?

vs.

download source then compile a program with the tests built into it


----------------------------


the way `electron-stream` (used by `browser-run`/`tape-run`) does it is
they `require` an `electron`, then spawn it as a process

```js
const ps = self.ps = spawn(electron, args, {
    stdio: [null, null, null, 'ipc']
});
```


-------------------



_weekend project_
Where I last left off was decoupling [tap-ssc](https://github.com/nichoth/tap-ssc/) from `tapzero`, so it works with any tap producing test library. That means looking at the tap output and then exiting the process depending on results: https://github.com/nichoth/tap-ssc/blob/main/cli.mjs#L21

A problem now is that we are able to [kill the child process](https://github.com/nichoth/tap-ssc/blob/main/cli.mjs#L22), but another process stays open. I'm not sure why.

This is `npm run test | npx tap-arc`:
```
tap-ssc main % npm run test | npx tap-arc 
    > @nichoth/tap-ssc@0.0.9 test
    > cd example && rm -rf node_modules package-lock.json && npm i && npm test
    added 2 packages, and audited 4 packages in 15s
    found 0 vulnerabilities
    > test
    > esbuild --bundle test/index.js | tap-ssc
(node:9756) ExperimentalWarning: Importing JSON modules is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
    • 'ssc compile' is deprecated, use 'ssc build' instead +0ms
    • Creating Window#0 +1ms
    • Creating Window#1 +111ms
    • Showing Window#0 (seq=) +6ms

  browser environment
    ✔ window should exist

  total:     1
  passing:   1
  15.776 s
```

`ps -a` after running tests:
```
tap-ssc main % ps -a
  PID TTY           TIME CMD
 9758 ttys001    0:00.12 /Users/nick/code/tap-ssc/./dist/mac/tap-ssc-dev.app/Co
 9775 ttys001    0:00.01 ps -a
```

^ the PID `9758` is the problem here

An interesting thing is that it *does* exit correctly if you call `io.process.exit(1)` from within the tests — https://github.com/nichoth/tap-ssc/blob/main/index.mjs#L13 . But there's no way to get the tap output from within that context. 

That's why I was inspecting the `tapzero.GLOBAL_TEST_RUNNER` global property in the past, but there is no universal API for tap tests of course.

