import { format } from 'node:util'
const SSC_VERSION_PREFIX = '--ssc-version=v'
const SSC_VERSION_PATTERN = /v(\d+\.\d+\.\d+)/
const MINIMAL_MAJOR_VERSION = 0
const MINIMAL_MINOR_VERSION = 1
const MINIMAL_PATCH_VERSION = 0
const MAX_MESSAGE_KB = 512 * 1024

// redirect console
console.log = (...args) => {
    const s = args.map(v => format(v)).join(' ')
    const enc = encodeURIComponent(s)
    write(`ipc://stdout?value=${enc}`)
}
console.error = (...args) => {
    const s = args.map(v => format(v)).join(' ')
    const enc = encodeURIComponent(s)
    write(`ipc://stderr?value=${enc}`)
}

for (const arg of process.argv) {
    if (arg.startsWith(SSC_VERSION_PREFIX)) {
        const [major, minor, patch] = arg.match(SSC_VERSION_PATTERN)?.[1]
            .split('.').map(Number) ?? [0, 0, 0]
        checkVersion(major, minor, patch)
        break
    }
}

function checkVersion (major, minor, patch) {
    if (major < MINIMAL_MAJOR_VERSION || minor < MINIMAL_MINOR_VERSION ||
    patch < MINIMAL_PATCH_VERSION) {
        throw new Error(`socket-node-backend requires at least version 0.1.0, got ${major}.${minor}.${patch}`)
    }
}

function write (s) {
    if (s.includes('\n')) {
        throw new Error('invalid write()')
    }

    if (s.length > MAX_MESSAGE_KB) {
        const len = Math.ceil(s.length / 1024)
        process.stderr.write('WARNING: Sending large message to webview: ' + len + 'kb\n')
        process.stderr.write('RAW MESSAGE: ' + s.slice(0, 512) + '...\n')
    }

    return new Promise(resolve =>
        process.stdout.write(s + '\n', resolve)
    )
}

// import { format } from './util'

// const mapping = {
//     stdout: ['info', 'log'],
//     stderr: ['debug', 'error', 'warn']
// }

// for (const name of mapping.stdout) {
//     const fn = console[name]
//     console[name] = (...args) => {
//         const value = encodeURIComponent(format(...args))
//         window.__ipc.postMessage(`ipc://stdout?value=${value}`)
//         return fn.apply(console, args)
//     }
// }

// for (const name of mapping.stderr) {
//     const fn = console[name]
//     console[name] = (...args) => {
//         const value = encodeURIComponent(format(...args))
//         window.__ipc.postMessage(`ipc://stderr?value=${value}`)
//         return fn.apply(console, args)
//     }
// }
