import axios from 'axios'

export function useChickenSoup() {
  async function getIowenChickenSoup(): Promise<string> {
    const result = await axios.get('https://www.iowen.cn/jitang/api')
    return result.data.data.content.content
  }

  return {
    getIowenChickenSoup,
  }
}
