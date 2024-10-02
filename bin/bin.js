#!/usr/bin/env node

import { argv } from 'node:process'
import { program } from 'commander'
import { useDownloadList } from '../dist/index.js'

program
  .version('0.0.1')
  .description('Download music from netease')
  .command('download-list <listId> [downloadDir]')
  .description('Download all music list songs from netease')
  .action((listId, downloadDir) => {
    useDownloadList(listId, downloadDir)
      .download()
  })

program.parse(argv)
