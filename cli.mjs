#!/usr/bin/env node
// @ts-check

import fs from 'node:fs' // 'node:fs/promises'
import path from 'node:path'
import config from './config.json' assert { type: "json" }
import { spawn } from 'node:child_process'
import { Transform } from 'readable-stream'
import { fileURLToPath } from 'url'
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

        this.push(chunk)
        cb()
    }
})

fs.readFile(path.join(__dirname, 'index.mjs'), (err, file) => {
    if (err) throw err
    writeStream.write(file)

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
