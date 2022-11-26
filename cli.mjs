#!/usr/bin/env node
// @ts-check

import fs from 'node:fs'
import path from 'node:path'
import config from './config.json' assert { type: "json" }
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'url'
import { Transform } from 'readable-stream'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const target = path.resolve(path.join(config.target, 'bundle.js'))
const writeStream = fs.createWriteStream(target)

let child

const transformer = new Transform({
    transform (_chunk, _, cb) {
        const chunk = _chunk.toString()
        if (chunk.includes('# ok')) {
            child.kill()
            setTimeout(() => {
                process.exit(0)
            }, 100)
        }

        if (chunk.includes('# fail ')) {
            child.kill()
            setTimeout(() => {
                process.exit(1)
            }, 100)
        }

        this.push(chunk)
        cb()
    }
})

process.stdin
    .pipe(writeStream)
    .on('close', () => {
        child = spawn('ssc', ['run', '--headless', '.'], { cwd: __dirname })
        child.stdout
            .pipe(transformer)
            .pipe(process.stdout)

        child.stderr.pipe(process.stderr)
    })
