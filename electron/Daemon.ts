import { spawn } from 'child_process'
import { EventEmitter } from 'events'
import path from 'path'
import crypto from 'crypto'

export interface DaemonOptions {
  user: string
  pass: string
  port?: string
}

export default class Daemon extends EventEmitter {
  private options: DaemonOptions = {
    user: crypto.randomBytes(256 / 8).toString('hex'),
    pass: crypto.randomBytes(256 / 8).toString('hex'),
    port: '58812',
  }
  private daemon: ReturnType<typeof spawn> | null = null

  running: boolean = false
  started: boolean = false

  private handleStdout(data: any) {
    const message = data?.toString().trim() || ''
    this.emit('stdout', message)

    switch (true) {
      case /done loading/i.test(message):
        this.started = true
        this.emit('status', 'wallet-loaded')
        break
      case /init message:/i.test(message):
        const messageMatch = message.match(/init message: (.*)/i)
        if (messageMatch) this.emit('message', messageMatch[1])
        break
      case /\d*%/i.test(message):
        const progressMatch = message.match(/(\d*)%/i)
        if (progressMatch) this.emit('progress', parseInt(progressMatch[1]))
        break
      case /[DONE]]/i.test(message):
        this.emit('progress', 100)
        break
      case /shutdown/i.test(message):
        this.emit('status', 'stopping')
        break
    }
  }

  private handleStderr(data: any) {
    const message = data?.toString().trim() || ''
    this.emit('stderr', message)

    switch (true) {
      case /cannot obtain a lock on data directory/i.test(message):
        this.started = false
        this.emit('status', 'already-running')
      case /new wallet load detected/i.test(message):
        this.started = false
        this.emit('status', 'new-wallet')
        break
      case /error/i.test(message):
        this.emit('error', message)
        break
    }
  }

  private handleExit(_code: any) {
    this.running = this.started = false
    this.emit('status', 'stopped')
    this.emit('exit')
  }

  private startDaemon(seed?: string) {
    const { user, pass, port } = this.options

    this.running = true
    this.daemon = spawn(
      process.env.ELECTRON_START_URL
        ? path.join(__dirname, '../veil/veild')
        : path.join(process.resourcesPath, 'veil/veild'),
      [
        `--rpcuser=${user}`,
        `--rpcpassword=${pass}`,
        `--rpcport=${port}`,
        '--printtoconsole',
        seed ? `--importseed=${seed}` : '',
      ].filter(opt => opt !== '')
    )

    this.daemon.on('exit', this.handleExit.bind(this))
    this.daemon.stdout?.on('data', this.handleStdout.bind(this))
    this.daemon.stderr?.on('data', this.handleStderr.bind(this))
  }

  start(seed?: string): Promise<DaemonOptions> {
    if (this.started) {
      this.emit('status', 'wallet-loaded')
      return Promise.resolve(this.options)
    }

    this.emit('status', 'starting')
    this.startDaemon(seed)

    return new Promise((resolve, reject) => {
      const startInterval = setInterval(() => {
        if (this.started) {
          clearInterval(startInterval)
          resolve(this.options)
        }
        // todo: add timeout
      }, 100)
    })
  }

  stop() {
    if (this.isStopped()) {
      this.emit('status', 'stopped')
      return Promise.resolve()
    }

    this.emit('status', 'stopping')
    this.daemon?.kill()

    return new Promise((resolve, reject) => {
      const stopInterval = setInterval(() => {
        if (this.isStopped()) {
          clearInterval(stopInterval)
          resolve()
        }
        // todo: add timeout
      }, 100)
    })
  }

  isStopped() {
    return (!this.running && !this.started) || !this.daemon
  }
}
