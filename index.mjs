// @ts-check
import process from 'socket:process'
// import fs from 'socket:fs/promises'

const parent = typeof window === 'object' ? window : globalThis

// window.addEventListener('DOMContentLoaded', async () => {
//     await fs.readFile('index.html')
// })

if (typeof parent?.addEventListener === 'function') {
    parent.addEventListener('error', onerror)
    parent.addEventListener('unhandledrejection', onerror)
}

// fail on uncaught errors
function onerror (err) {
    console.error(err.stack || err.reason || err.message || err)
    process.exit(1)
}
