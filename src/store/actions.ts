import { Action, AsyncAction } from 'store'
import { toast } from 'react-toastify'
import RPC_ERRORS from 'constants/rpcErrors'

interface RpcError {
  code: number
  message: string
}

export const handleRpcError: Action<RpcError, void> = (
  { state, effects, actions },
  { code, message }
) => {
  if (code === undefined) {
    switch (true) {
      case /connection_refused/i.test(message):
      case /request error/i.test(message):
      case /unauthorized/i.test(message):
        state.status = 'login'
        break
    }
  }

  toast(message, { type: 'error' })

  switch (code) {
    case RPC_ERRORS.RPC_IN_WARMUP:
    // TODO
  }

  //throw new Error(message)
}
