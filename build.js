#!/usr/bin/env node
// @ts-check
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main () {
    const target = path.resolve(process.argv[2])

    console.log('**target**', target)

    //
    // Add `target` to config.json here, so that is is available in cli
    //
    await fs.writeFile(path.join(__dirname, 'config.json'),
        JSON.stringify({ target }, null, 2))

    await cp('./src/index.html', target)
}

main()

function cp (a, b) {
    return fs.cp(
        path.resolve(a),
        path.join(b, path.basename(a)),
        { recursive: true, force: true }
    )
}
