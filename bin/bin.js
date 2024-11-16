#!/usr/bin/env node

import { argv } from 'node:process'
import { program } from 'commander'
import { useDownloadList } from '../dist/index.js'

program
  .name('music-list-downloader')
  .helpOption('-h, --help', '输出命令的帮助信息')
  .description('从网易云音乐下载整个歌单的mp3到本地')
  .version('0.0.1', '-v, --version', '输出当前版本号')
  .description('从网易云音乐下载整个歌单的mp3到本地')
  .command('download-list <listId> [downloadDir]')
  .option('-l, --level <level>', '控制日志的输出级别', 'silly')
  .description('下载歌单。listId: 歌单id,必须提供; downloadDir: 下载目录,默认为\'./config/music\'目录，你也可以指定一个目录')
  .action((listId, downloadDir, { level } = { level: 'silly' },
  ) => {
    useDownloadList(listId, downloadDir, level)
      .download()
  })

program.parse(argv)
