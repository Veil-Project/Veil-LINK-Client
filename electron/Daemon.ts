import { app } from 'electron'
import { spawn, execFileSync } from 'child_process'
import { EventEmitter } from 'events'
import crypto from 'crypto'
import fs from 'fs'
import tar from 'tar'
import extractZip from 'extract-zip'
import path from 'path'
import download from './download'

const VEILD_USER = crypto.randomBytes(256 / 8).toString('hex')
const VEILD_PASS = crypto.randomBytes(256 / 8).toString('hex')

export type DaemonStatus =
  | 'unknown'
  | 'starting'
  | 'already-started'
  | 'new-wallet'
  | 'wallet-loaded'
  | 'stopping'
  | 'stopped'
  | 'reindex-required'
  | 'crashed'

export interface DaemonOptions {
  datadir?: string
  network?: 'mainnet' | 'testnet' | 'regtest' | 'devnet'
  seed?: string
  reindex?: boolean
  wallet?: string
}

export interface DaemonCredentials {
  user: string
  pass: string
}

export default class Daemon extends EventEmitter {
  private daemon: ReturnType<typeof spawn> | null = null
  private credentials: DaemonCredentials = {
    user: VEILD_USER,
    pass: VEILD_PASS,
  }

  path: string | null = null
  status: DaemonStatus = 'unknown'
  isRunning: boolean = false

  private handleStdout(data: any) {
    const message = data?.toString().trim() || ''
    this.emit('stdout', message)

    switch (true) {
      case /done loading/i.test(message):
        this.status = 'wallet-loaded'
        break
      case /init message:/i.test(message):
        const messageMatch = message.match(/init message: (.*)/i)
        if (messageMatch) this.emit('warmup', { message: messageMatch[1] })
        break
      case /\[\d*%\]/i.test(message):
        const progressMatch = message.match(/(\d*)%/i)
        if (progressMatch)
          this.emit('warmup', {
            progress: parseInt(progressMatch[1]),
          })
        break
      case /progress=\d/i.test(message):
        const rescanMatch = message.match(/Progress=([\d.]*)/i)
        if (rescanMatch)
          this.emit('warmup', {
            progress: parseFloat(rescanMatch[1]) * 100,
          })
        break
      case /\[done\]]/i.test(message):
        this.emit('warmup', { progress: 100 })
        break
      case /addtowallet/i.test(message):
        const txMatch = message.match(
          /addtowallet\s*([a-z0-9]*)\s*(new|update)/i
        )
        if (txMatch) this.emit('transaction', txMatch[1], txMatch[2])
        break
      case /updatetip/i.test(message):
        const dateMatch = message.match(/date='(.*)'/i)
        const heightMatch = message.match(/height=(\d*)/i)
        if (dateMatch && heightMatch)
          this.emit('blockchain-tip', {
            date: dateMatch[1],
            height: heightMatch[1],
          })
        break
      case /shutdown/i.test(message):
        // this.status = 'stopping'
        break
    }
  }

  private handleStderr(data: any) {
    const message = data?.toString().trim() || ''
    this.emit('stderr', message)

    switch (true) {
      case /cannot obtain a lock on data directory/i.test(message):
        this.status = 'already-started'
        break
      case /new wallet load detected/i.test(message):
        this.status = 'new-wallet'
        break
      case /error loading block database/i.test(message):
        this.status = 'reindex-required'
        break
      case /error/i.test(message):
        this.emit('error', message)
        break
    }
  }

  private handleError(_error: any) {
    console.log(_error)
  }

  private handleExit(_code: any) {
    if (this.status === 'stopping') {
      this.status = 'stopped'
    }
    this.isRunning = false
    this.emit('exit')
  }

  private get installed() {
    if (!this.path) return false
    return fs.existsSync(this.path)
  }

  private get checksum() {
    if (!this.path || !this.installed) {
      return null
    }

    let data
    try {
      data = fs.readFileSync(this.path, 'utf8')
    } catch (err) {
      return console.error('Error: ', err)
    }

    return crypto
      .createHash('md5')
      .update(data, 'utf8')
      .digest('hex')
  }

  private get version() {
    if (!this.path || !this.installed) {
      return null
    }

    try {
      const output = execFileSync(this.path, [`--version`])
      const version =
        output
          ?.toString()
          ?.trim()
          ?.match(/veil core daemon version (.*)/i) || []
      return version[1]
    } catch (e) {
      return null
    }
  }

  getInfo() {
    const { path, version, installed, checksum, status, credentials } = this
    return {
      path,
      status,
      installed,
      checksum,
      version,
      credentials,
    }
  }

  // todo: prevent dupe downloads
  download(url: string) {
    return new Promise((resolve, reject) => {
      const downloadPath = path.join(app.getPath('temp'), path.basename(url))
      const destinationPath = path.join(app.getPath('userData'))
      download(url, downloadPath)
        .on('progress', (state: any) => {
          this.emit('download-progress', state)
        })
        .on('error', reject)
        .on('end', async () => {
          try {
            if (process.platform === 'win32') {
              await extractZip(downloadPath, { dir: destinationPath })
              this.path = path.join(
                destinationPath,
                path
                  .basename(url, 'zip')
                  .split('-')
                  .slice(0, 2)
                  .join('-'),
                'bin',
                'veild.exe'
              )
            } else {
              await tar.extract({
                file: downloadPath,
                cwd: destinationPath,
                filter: path => path.endsWith('veild'),
              })
              this.path = path.join(
                destinationPath,
                path
                  .basename(url, 'tar.gz')
                  .split('-')
                  .slice(0, 2)
                  .join('-'),
                'bin',
                'veild'
              )
            }
            resolve(this.path)
          } catch (e) {
            reject(e)
          }
        })
    })
  }

  start({ network, datadir, seed, reindex, wallet }: DaemonOptions) {
    if (!this.path || !this.installed) {
      return Promise.reject()
    }

    if (this.isRunning) {
      return Promise.resolve(this.status)
    }

    this.isRunning = true

    try {
      // Avoid dupe starts
      if (this.status !== 'starting') {
        this.status = 'starting'
        this.daemon = spawn(
          this.path,
          [
            `--rpcuser=${this.credentials.user}`,
            `--rpcpassword=${this.credentials.pass}`,
            `--rpcport=58812`,
            '--printtoconsole',
            network === 'testnet' ? '--testnet' : '',
            datadir ? `--datadir=${datadir}` : '',
            seed ? `--importseed=${seed}` : '',
            reindex ? '--reindex' : '',
            wallet ? `--wallet=${wallet}` : '',
          ].filter(opt => opt !== '')
        )

        this.daemon.on('exit', this.handleExit.bind(this))
        this.daemon.on('error', this.handleError.bind(this))
        this.daemon.stdout?.on('data', this.handleStdout.bind(this))
        this.daemon.stderr?.on('data', this.handleStderr.bind(this))
      }

      return new Promise((resolve, reject) => {
        const startInterval = setInterval(() => {
          if (this.status !== 'starting') {
            clearInterval(startInterval)
            resolve(this.status)
          }
        }, 100)
      })
    } catch (e) {
      this.status = 'crashed'
      this.isRunning = false
      return Promise.reject(e)
    }
  }

  stop() {
    if (!this.installed) {
      return Promise.reject()
    }

    if (this.status === 'stopped') {
      return Promise.resolve(this.status)
    }

    // Avoid dupe stops
    if (this.status !== 'stopping') {
      this.status = 'stopping'
      this.daemon?.kill()
    }

    return new Promise((resolve, reject) => {
      const stopInterval = setInterval(() => {
        if (this.status !== 'stopping') {
          clearInterval(stopInterval)
          resolve(this.status)
        }
      }, 100)
    })
  }
}
