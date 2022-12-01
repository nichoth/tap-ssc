#!/usr/bin/env node
// @ts-check

import fs from 'node:fs' // 'node:fs/promises'
import path from 'node:path'
import config from './config.json' assert { type: "json" }
import { spawn } from 'node:child_process'
import { Transform } from 'readable-stream'
import { fileURLToPath } from 'url'
import esbuild from 'esbuild'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const target = path.resolve(path.join(config.target, 'bundle.js'))
const writeStream = fs.createWriteStream(target)

let child

const transformer = new Transform({
    transform (_chunk, _, cb) {
        const chunk = _chunk.toString()
        if (chunk.includes('# ok')) {
            // @TODO -- is there a nicer way than `child.pid + 1` to exit?
            process.kill(child.pid + 1)
            setTimeout(() => {
                process.exit(0)
            }, 100)
        }

        if (chunk.includes('# fail ')) {
            process.kill(child.pid + 1)
            setTimeout(() => {
                process.exit(1)
            }, 100)
        }

        if (chunk.includes('Exiting Window#0 (code=1)')) {
            setTimeout(() => {
                process.exit(1)
            }, 100)
        }

        this.push(chunk)
        cb()
    }
})

//
// build listener for uncaught errors, then add it to the user's test code
//
esbuild.build({
    entryPoints: [path.join(__dirname, 'index.mjs')],
    bundle: true,
    keepNames: true,
    logLevel: 'silent',
    // found this via [source code](https://github.com/evanw/esbuild/blob/a7eb7891ec1aeb7f7967ae38d72ab96518913e62/lib/shared/types.ts#L212)
    write: false,
    // minify: true,
    platform: 'browser'
}).then(res => {
    const code = new TextDecoder('utf-8').decode(res.outputFiles[0].contents)
    writeStream.write(code, (err) => {
        if (err) throw err

        process.stdin
            .pipe(writeStream)
            .on('close', () => {
                child = spawn('ssc', ['run', '--headless', '.'], { cwd: __dirname })
                child.stdout
                    .pipe(transformer)
                    .pipe(process.stdout)

                child.stderr.pipe(process.stderr)
            })
    })
})
