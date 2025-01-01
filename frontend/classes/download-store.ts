import { DownloadZip, DownloadZipImpl } from './download-zip'

export class DownloadStore {
  constructor(private readonly zip: Ref<Record<string, DownloadZip>>) {
    this.init()
  }

  private init(): void {
    if (!this.zip.value)
      this.zip.value = {}
  }

  addZip(name: string): DownloadZipImpl {
    this.init()
    this.zip.value[name] = { item: {} }
    return new DownloadZipImpl(this.zip.value[name], this, name)
  }

  getZip(name: string): DownloadZipImpl | undefined {
    this.init()
    return new DownloadZipImpl(this.zip.value[name], this, name)
  }

  removeZip(name: string): void {
    this.init()
    delete this.zip.value[name]
  }

  getZips(): DownloadZipImpl[] {
    this.init()
    return Object.keys(this.zip.value)
      .map(name => new DownloadZipImpl(this.zip.value[name], this, name))
  }
}
