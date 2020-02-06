import { spawn } from 'child_process'
import { EventEmitter } from 'events'
import path from 'path'

export default class Daemon extends EventEmitter {
  status: string = 'unknown'
  message: string | null = null
  progress: number | null = null

  user: string
  pass: string
  daemon: ReturnType<typeof spawn> | null = null

  constructor({ user, pass }: { user: string; pass: string }) {
    super()

    this.user = user
    this.pass = pass
  }

  private updateStatus(status: string) {
    if (this.status !== status) {
      this.message = null
      this.progress = null
    }
    this.status = status
    this.emit('status-change', this.status, this.message, this.progress)
  }

  private updateMessage(message: string | null) {
    if (this.message !== message) {
      this.progress = null
    }
    this.message = message
    this.emit('status-change', this.status, this.message, this.progress)
  }

  private updateProgress(progress: number | null) {
    this.progress = progress
    this.emit('status-change', this.status, this.message, this.progress)
  }

  private spawn(seed?: string) {
    this.daemon = spawn(
      process.env.ELECTRON_START_URL
        ? path.join(__dirname, '../veil/veild')
        : path.join(process.resourcesPath, 'veil/veild'),
      [
        `--rpcuser=${this.user}`,
        `--rpcpassword=${this.pass}`,
        '--rpcport=8332',
        '--printtoconsole',
        seed ? `--importseed=${seed}` : '',
      ].filter(opt => opt !== '')
    )

    this.daemon.on('exit', _code => {
      this.updateStatus('stopped')
      this.emit('exit')
    })

    this.daemon.stdout?.on('data', data => {
      const message = data?.toString().trim()
      switch (true) {
        case /done loading/i.test(message):
          this.updateStatus('started')
          this.emit('wallet-loaded')
          break
        case /init message:/i.test(message):
          if (this.status === 'starting') {
            const messageMatch = message.match(/init message: (.*)/i)
            this.updateMessage(messageMatch && messageMatch[1])
          }
          break
        case /\d*%/i.test(message):
          const progressMatch = message.match(/(\d*)%/i)
          this.updateProgress(progressMatch && parseInt(progressMatch[1]))
          break
        case /[DONE]]/i.test(message):
          this.updateProgress(100)
          break
        case /shutdown/i.test(message):
          this.updateStatus('stopping')
          break
        default:
          this.emit('message', message)
      }
      console.log('STDOUT', message)
    })

    this.daemon.stderr?.on('data', data => {
      const message = data?.toString().trim() || ''
      this.updateStatus('stopped')
      this.updateMessage(message)

      switch (true) {
        case /new wallet load detected/i.test(message):
          this.emit('wallet-missing')
          break
        case /error/i.test(message):
          this.emit('error')
          break
      }
      console.error('STDERR', message)
    })
  }

  start(seed?: string) {
    if (this.isStarted()) {
      this.updateStatus('started')
      this.emit('wallet-loaded')
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      this.updateStatus('starting')
      this.spawn(seed)

      const startInterval = setInterval(() => {
        switch (this.status) {
          case 'started':
            clearInterval(startInterval)
            resolve()
            break
          case 'stopped':
            clearInterval(startInterval)
            reject()
            break
        }
      }, 100)
    })
  }

  stop() {
    if (this.daemon === null || this.daemon.killed || this.isStopped()) {
      this.updateStatus('stopped')
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      this.updateStatus('stopping')
      this.daemon?.kill()

      const stopInterval = setInterval(() => {
        switch (this.status) {
          case 'stopped':
            clearInterval(stopInterval)
            resolve()
            break
          case 'started':
            clearInterval(stopInterval)
            reject()
            break
        }
      }, 100)
    })
  }

  isStarted(): boolean {
    return (
      this.daemon !== null &&
      !this.daemon.killed &&
      !['unknown', 'stopped'].includes(this.status)
    )
  }

  isStopped(): boolean {
    return !this.isStarted()
  }
}
