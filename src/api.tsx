// @ts-ignore
import RpcClient from 'veild-rpc'

const rpc = new RpcClient({
  protocol: 'http',
  user: 'veilrpc',
  pass: '1e34844e00d00966de896ceb4cade95c',
  host: 'localhost',
  port: '8332',
  logger: 'debug',
})

export const call = (method: Function, params: any) => {
  return new Promise(
    (resolve, reject) => {
      rpc.getWalletInfo((err: any, ret: any) => {
        if (err) {
          reject(err)
        }
        resolve(ret)
      });
   }
 );
}