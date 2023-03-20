import { format } from './util'

const mapping = {
    stdout: ['info', 'log'],
    stderr: ['debug', 'error', 'warn']
}

for (const name of mapping.stdout) {
    const fn = console[name]
    console[name] = (...args) => {
        const value = encodeURIComponent(format(...args))
        window.__ipc.postMessage(`ipc://stdout?value=${value}`)
        return fn.apply(console, args)
    }
}

for (const name of mapping.stderr) {
    const fn = console[name]
    console[name] = (...args) => {
        const value = encodeURIComponent(format(...args))
        window.__ipc.postMessage(`ipc://stderr?value=${value}`)
        return fn.apply(console, args)
    }
}
