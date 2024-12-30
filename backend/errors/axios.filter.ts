import { Filter } from '@nailyjs/ioc'
import { RpcErrorHandler, RpcFilterContext } from '@nailyjs/rpc'

@Filter()
export class AxiosRpcFilter implements RpcErrorHandler {
  catch(error: any, ctx: RpcFilterContext) {
    if (error?.status && error?.body) {
      ctx.sendError(error?.status ?? 500, error?.body?.message, JSON.parse(JSON.stringify(error)))
    }
    else {
      ctx.sendError(500, error?.message, JSON.parse(JSON.stringify(error)))
    }

    console.error('[Request Error]', JSON.stringify(error))
  }
}
