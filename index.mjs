// @ts-check
import process from '@socketsupply/io/process.js' 
const parent = typeof window === 'object' ? window : globalThis

if (typeof parent?.addEventListener === 'function') {
    parent.addEventListener('error', onerror)
    parent.addEventListener('unhandledrejection', onerror)
}

function onerror (err) {
    console.error(err.stack || err.reason || err.message || err)
    setTimeout(() => {
        process.exit(1)
    }, 100)
}
