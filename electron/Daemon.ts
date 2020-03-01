import { spawn } from 'child_process'
import { EventEmitter } from 'events'
import path from 'path'

export type DaemonStatus = 'starting' | 'started' | 'stopping' | 'stopped'
export interface DaemonOptions {
  user: string
  pass: string
  port?: string
  seed?: string
}

export default class Daemon extends EventEmitter {
  private daemon: ReturnType<typeof spawn> | null = null

  running: boolean = false
  started: boolean = false

  private handleStdout(data: any) {
    const message = data?.toString().trim() || ''
    this.emit('stdout', message)

    switch (true) {
      case /done loading/i.test(message):
        this.started = true
        this.emit('wallet-loaded')
        this.emit('status', 'started')
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
      case /new wallet load detected/i.test(message):
        this.started = false
        this.emit('wallet-missing')
        this.emit('status', 'stopped')
        break
      case /error/i.test(message):
        this.emit('error', message)
        break
    }
  }

  private handleExit(_code: any) {
    this.running = false
    this.started = false
    this.emit('status', 'stopped')
    // this.emit('exit')
  }

  private startDaemon(options: DaemonOptions) {
    const { user, pass, port, seed } = options

    this.running = true
    this.daemon = spawn(
      process.env.ELECTRON_START_URL
        ? path.join(__dirname, '../veil/veild')
        : path.join(process.resourcesPath, 'veil/veild'),
      [
        `--rpcuser=${user}`,
        `--rpcpassword=${pass}`,
        `--rpcport=${port || '8332'}`,
        '--printtoconsole',
        seed ? `--importseed=${seed}` : '',
      ].filter(opt => opt !== '')
    )

    this.daemon.on('exit', this.handleExit)
    this.daemon.stdout?.on('data', this.handleStdout)
    this.daemon.stderr?.on('data', this.handleStderr)
  }

  start(options: DaemonOptions) {
    if (this.started) {
      this.emit('status', 'started')
      this.emit('wallet-loaded')
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      this.running = true
      this.startDaemon(options)

      const startInterval = setInterval(() => {
        if (this.started) {
          clearInterval(startInterval)
          resolve()
        }
        // todo: add timeout
      }, 100)
    })
  }

  stop() {
    if ((!this.running && !this.started) || this.daemon?.killed) {
      this.emit('status', 'stopped')
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      this.emit('status', 'stopping')
      this.daemon?.kill()

      const stopInterval = setInterval(() => {
        if (!this.running && !this.started) {
          clearInterval(stopInterval)
          resolve()
        }
        // todo: add timeout
      }, 100)
    })
  }
}
