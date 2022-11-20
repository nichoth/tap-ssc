#!/usr/bin/env node
// @ts-check
import path from 'node:path'
import fs from 'node:fs/promises'
import esbuild from 'esbuild'

async function main () {
    const target = path.resolve(process.argv[2])

    //
    // Add `target` to package.json here, so that is is available in cli
    //
    // pkg.ssc = { target }
    await fs.writeFile(path.join(process.cwd(), 'config.json'),
        JSON.stringify({ target }, null, 2))

    console.log('**target**', target)
    console.log('**argv 2**', process.argv[2])

    // render process
    await esbuild.build({
        entryPoints: ['src/render/index.js'],
        format: 'esm',
        bundle: true,
        keepNames: true,
        platform: 'browser',
        sourcemap: 'inline',
        outfile: path.join(target, 'bundle.js')
    })

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
