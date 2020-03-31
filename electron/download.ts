import { createWriteStream } from 'fs'
import request from 'request'
// @ts-ignore
import progress from 'request-progress'

export default (sourceUrl: string, destinationPath: string) => {
  const download = progress(request(sourceUrl))
  download.pipe(createWriteStream(destinationPath))
  return download
}
