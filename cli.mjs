#!/usr/bin/env node
// @ts-check

import fs from 'node:fs'
import path from 'node:path'
import config from './config.json' assert { type: "json" }
import run from 'comandante'
import { fileURLToPath } from 'url'
import { Transform } from 'readable-stream'
import MultiStream from 'multistream'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const target = path.resolve(path.join(config.target, 'bundle.js'))
const writeStream = fs.createWriteStream(target)

const transformer = new Transform({
    transform (_chunk, _, cb) {
        const chunk = _chunk.toString()
        if (chunk.includes('# ok')) {
            setTimeout(() => {
                process.exit(0)
            }, 100)
        }

        if (chunk.includes('# fail ')) {
            setTimeout(() => {
                process.exit(1)
            }, 100)
        }

        if (chunk.includes('# error')) {
            setTimeout(() => {
                process.exit(1)
            }, 100)
        }

        this.push(chunk)
        cb()
    }
})

// need to pipe stdin to a file,
// then start an `ssc` process
new MultiStream([
    fs.createReadStream(__dirname + '/index.mjs'),
    process.stdin
])
// process.stdin
    .pipe(writeStream)
    .on('close', () => {
        run('ssc', ['run', '--headless', '.'], { cwd: __dirname })
            .pipe(transformer)
            .pipe(process.stdout)
    })
