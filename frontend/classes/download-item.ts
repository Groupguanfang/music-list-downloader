import { ServerBackend } from '~/stores/settings'
import { DownloadZipImpl, ItemFilename } from './download-zip'

export enum DownloadStatus {
  ReceivingUrl = 'receiving-url',
  ReceiveUrlFailed = 'receive-url-failed',
  Received = 'received',

  Downloading = 'downloading',
  DownloadFailed = 'download-failed',
  Downloaded = 'downloaded',

  Compressing = 'compressing',
  CompressFailed = 'compress-failed',

  Completed = 'completed',
}

export interface DownloadItem {
  server: ServerBackend
  percentage: number
  status: DownloadStatus
}

export class DownloadItemImpl {
  constructor(
    private readonly downloadItem: DownloadItem,
    private readonly downloadZip: DownloadZipImpl,
    private readonly filename: ItemFilename,
  ) {}

  getFilename(): ItemFilename {
    return this.filename
  }

  getDownloadZip(): DownloadZipImpl | undefined {
    return this.downloadZip
  }

  getServer(): ServerBackend | undefined {
    return this.downloadItem.server
  }

  getPercentage(): number {
    return this.downloadItem.percentage || 0
  }

  setPercentage(percentage: number): void {
    this.downloadItem.percentage = percentage
  }

  getStatus(): DownloadStatus {
    return this.downloadItem.status
  }

  setStatus(status: DownloadStatus): void {
    this.downloadItem.status = status
  }
}
