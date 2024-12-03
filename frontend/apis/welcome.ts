import { WelcomeServer } from '#/welcome.protocol'
import { useRequest } from '../utils/request'

export function useWelcomeServer() {
  const client = useRequest()

  function request() {
    return client.request<WelcomeServer>(WelcomeServer)
  }

  return {
    request,
  }
}
