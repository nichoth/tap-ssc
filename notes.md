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
