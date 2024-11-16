import type { WebContents } from 'electron'
import { ipcMain } from 'electron'
import type { LoggerService } from '.'
import { useDownloadList } from '.'

export interface DownloadList {
  id: string | number
  dir?: string
  cookie?: string
  level?: string
}

class LoggerSender implements LoggerService {
  constructor(private sender: WebContents) {}

  info(message: string): void {
    this.sender.send('download:info', message)
  }

  error(message: string): void {
    this.sender.send('download:error', message)
  }

  silly(message: string): void {
    this.sender.send('download:silly', message)
  }

  log(message?: string): void {
    this.sender.send('download:log', message)
  }
}

ipcMain.on('download', (event, args: DownloadList) => {
  useDownloadList(args.id, args.cookie, args.dir, args.level).download(new LoggerSender(event.sender))
})
