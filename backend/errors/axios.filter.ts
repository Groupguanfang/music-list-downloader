import { Filter } from '@nailyjs/ioc'
import { RpcErrorHandler, RpcFilterContext } from '@nailyjs/rpc'
import { AxiosError } from 'axios'

@Filter(AxiosError)
export class AxiosRpcFilter implements RpcErrorHandler {
  catch(error: AxiosError, ctx: RpcFilterContext) {
    ctx.sendError(error.response?.status ?? 500, error.message, error.response?.data)
  }
}
