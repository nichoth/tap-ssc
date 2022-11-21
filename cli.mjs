#!/usr/bin/env node
// @ts-check

import fs from 'node:fs'
import path from 'node:path'
import config from './config.json' assert { type: 'json' }
import run from 'comandante'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const target = path.resolve(path.join(config.target, 'bundle.js'))

// need to know target here
const ws = fs.createWriteStream(target);

// need to pipe stdin to a file,
// then start an `ssc` process
process.stdin
    .pipe(ws)
    .on('close', () => {
        run('ssc', ['run', '--headless', '.'], { cwd: __dirname })
            .pipe(process.stdout)
    })
