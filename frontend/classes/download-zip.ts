import { DownloadItem, DownloadItemImpl } from './download-item'
import { DownloadStore } from './download-store'

export type ItemFilename = string

export interface DownloadZip {
  item: Record<ItemFilename, DownloadItem>
}

export class DownloadZipImpl {
  constructor(
    private readonly downloadZip: DownloadZip,
    private readonly downloadStore: DownloadStore,
    private name: string,
  ) {}

  getDownloadStore(): DownloadStore {
    return this.downloadStore
  }

  getZipName(): string {
    return this.name
  }

  replaceZipName(name: string): void {
    this.name = name
  }

  addItem(filename: ItemFilename, item: DownloadItem): DownloadItemImpl {
    this.downloadZip.item[filename] = item
    return new DownloadItemImpl(item, this, filename)
  }

  removeItem(filename: ItemFilename): void {
    delete this.downloadZip.item[filename]
  }

  getItem(filename: ItemFilename): DownloadItemImpl | undefined {
    return new DownloadItemImpl(this.downloadZip.item[filename], this, filename)
  }

  getItems(): DownloadItemImpl[] {
    return Object.keys(this.downloadZip.item)
      .map(filename => new DownloadItemImpl(this.downloadZip.item[filename], this, filename))
  }
}
