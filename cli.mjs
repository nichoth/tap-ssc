#!/usr/bin/env node
// @ts-check

//
// take stdin and pipe it to a file at a target location
//
// `target` comes from the `ssc build` command
//

// const tapssc = require('./')
// var yargs = require('yargs/yargs')
// const { hideBin } = require('yargs/helpers')
// const fs = require('node:fs')
import tapssc from './index.mjs'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import fs from 'node:fs'
import path from 'node:path'
import config from './config.json' assert { type: 'json' }
// import { spawn } from 'node:child_process'
import run from 'comandante'


// [0] is the path to node
// [1] is absolute path to this file
// [2]... is the args passed in

//
// a line like this in test repo
//
// const target = path.resolve(process.argv[2]);

// need to get the `target` file

// const argv = yargs(process.argv.slice(2))
const argv = yargs(hideBin(process.argv)).argv

console.log('process.argv', process.argv)
console.log('aaaargs', argv)

const target = path.resolve(path.join(config.target, 'bundle.js'))

console.log('**target**', target)

// need to know target here
const ws = fs.createWriteStream(target);

// need to pipe stdin to a file,
// then start an `ssc` process
process.stdin
    .pipe(ws)
    .on('close', () => {
        run('ssc', ['run', '--headless', '.'])
            .pipe(process.stdout)
    })
