// Figure out embedded veild path
process.env.ELECTRON_START_URL
  ? path.join(__dirname, '../veil/veild')
  : path.join(process.resourcesPath, 'veil/veild')

// async checksum
private getChecksum() {
  if (!this.installed) {
    return Promise.resolve(null)
  }

  return new Promise(resolve => {
    const hash = crypto.createHash('md5')
    const stream = fs.createReadStream(this.path)

    stream.on('data', data => {
      hash.update(data, 'utf8')
    })

    stream.on('end', () => {
      resolve(hash.digest('hex'))
    })
  })
}

// Fine-grained db change tracking
effects.db.initialize({
  onChanges(changes) {
    const creates = changes.filter((change: any) => change.type === 1)
    const updates = changes.filter((change: any) => change.type === 2)
    const deletes = changes.filter((change: any) => change.type === 3)

    if (creates.length > 0 || deletes.length > 0) {
      actions.transactions.updateFromCache()
    }

    if (updates.length > 0) {
      actions.balance.fetch()
    }
  },
})