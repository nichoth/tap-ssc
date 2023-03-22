// @ts-check
// @ts-ignore
import process from 'socket:process'

const parent = typeof window === 'object' ? window : globalThis

if (typeof parent?.addEventListener === 'function') {
    parent.addEventListener('error', onerror)
    parent.addEventListener('unhandledrejection', onerror)
}

// fail on uncaught errors
function onerror (err) {
    console.error(err.stack || err.reason || err.message || err)
    process.exit(1)
}
