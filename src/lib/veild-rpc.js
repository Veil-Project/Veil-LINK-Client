var http = require('http')
var https = require('https')
var url = require('url')

function decodeURL(str) {
  var parsedUrl = url.parse(str)
  var hostname = parsedUrl.hostname
  var port = parseInt(parsedUrl.port, 10)
  var protocol = parsedUrl.protocol
  // strip trailing ":"
  protocol = protocol.substring(0, protocol.length - 1)
  var auth = parsedUrl.auth
  var parts = auth.split(':')
  var user = parts[0] ? decodeURIComponent(parts[0]) : null
  var pass = parts[1] ? decodeURIComponent(parts[1]) : null
  var opts = {
    host: hostname,
    port: port,
    protocol: protocol,
    user: user,
    pass: pass,
  }
  return opts
}

function RpcClient(opts) {
  // opts can ba an URL string
  if (typeof opts === 'string') {
    opts = decodeURL(opts)
  }
  opts = opts || {}
  this.host = opts.host || '127.0.0.1'
  this.port = opts.port || 58812
  this.user = opts.user || 'user'
  this.pass = opts.pass || 'pass'
  this.protocol = opts.protocol === 'http' ? http : https
  this.batchedCalls = null
  this.disableAgent = opts.disableAgent || false

  var isRejectUnauthorized = typeof opts.rejectUnauthorized !== 'undefined'
  this.rejectUnauthorized = isRejectUnauthorized
    ? opts.rejectUnauthorized
    : true

  if (RpcClient.config.log) {
    this.log = RpcClient.config.log
  } else {
    this.log = RpcClient.loggers[RpcClient.config.logger || 'normal']
  }
}

var cl = console.log.bind(console)

var noop = function() {}

RpcClient.loggers = {
  none: { info: noop, warn: noop, err: noop, debug: noop },
  normal: { info: cl, warn: cl, err: cl, debug: noop },
  debug: { info: cl, warn: cl, err: cl, debug: cl },
}

RpcClient.config = {
  logger: 'normal', // none, normal, debug
}

function rpc(request, callback) {
  var self = this
  request = JSON.stringify(request)
  var auth = new Buffer(self.user + ':' + self.pass).toString('base64')

  var options = {
    host: self.host,
    path: '/',
    method: 'POST',
    port: self.port,
    rejectUnauthorized: self.rejectUnauthorized,
    agent: self.disableAgent ? false : undefined,
  }

  if (self.httpOptions) {
    for (var k in self.httpOptions) {
      options[k] = self.httpOptions[k]
    }
  }

  var called = false

  var errorMessage = 'Veil JSON-RPC: '

  var req = this.protocol.request(options, function(res) {
    var buf = ''
    res.on('data', function(data) {
      buf += data
    })

    res.on('end', function() {
      if (called) return
      called = true

      if (res.statusCode === 401) {
        callback(
          new Error(errorMessage + 'Connection Rejected: 401 Unnauthorized')
        )
        return
      }
      if (res.statusCode === 403) {
        callback(new Error(errorMessage + 'Connection Rejected: 403 Forbidden'))
        return
      }
      if (
        res.statusCode === 500 &&
        buf.toString('utf8') === 'Work queue depth exceeded'
      ) {
        var exceededError = new Error('Veil JSON-RPC: ' + buf.toString('utf8'))
        exceededError.code = 429 // Too many requests
        callback(exceededError)
        return
      }

      var parsedBuf
      try {
        parsedBuf = JSON.parse(buf)
      } catch (e) {
        self.log.err(e.stack)
        self.log.err(buf)
        self.log.err('HTTP Status code:' + res.statusCode)
        var err = new Error(errorMessage + 'Error Parsing JSON: ' + e.message)
        callback(err)
        return
      }

      callback(parsedBuf.error, parsedBuf)
    })
  })

  req.on('error', function(e) {
    if (called) return
    called = true
    callback(new Error(errorMessage + 'Request Error: ' + e.message))
  })

  req.setHeader('Content-Length', request.length)
  req.setHeader('Content-Type', 'application/json')
  req.setHeader('Authorization', 'Basic ' + auth)
  req.write(request)
  req.end()
}

RpcClient.prototype.batch = function(batchCallback, resultCallback) {
  this.batchedCalls = []
  batchCallback()
  rpc.call(this, this.batchedCalls, resultCallback)
  this.batchedCalls = null
}

RpcClient.callspec = {
  addwitnessaddress: 'str',
  abandonTransaction: 'str',
  addMultiSigAddress: '',
  addNode: '',
  bumpfee: 'str',
  backupWallet: '',
  createwallet: 'str',
  createMultiSig: '',
  createRawTransaction: 'obj obj',
  exportzerocoins: 'bool',
  decodeRawTransaction: '',
  decodescript: 'str',
  decodepsbt: 'str',
  disconnectnode: '',
  dumpPrivKey: '',
  encryptWallet: '',
  estimateFee: '',
  estimateSmartFee: 'int str',
  estimatePriority: 'int',
  estimaterawfee: 'int',
  generate: 'int',
  generatecontinuous: '',
  generateToAddress: 'int str',
  generatemintlist: 'int int',
  getnetworkhashps: 'int',
  getAccount: '',
  getAccountAddress: 'str',
  getAddedNodeInfo: '',
  getAddressMempool: 'obj',
  getAddressUtxos: 'obj',
  getAddressBalance: 'obj',
  getAddressDeltas: 'obj',
  getAddressTxids: 'obj',
  getAddressesByAccount: '',
  getAddressesByLabel: '',
  getBalance: 'str int',
  getBalances: '',
  getunconfirmedbalance: '',
  getSpendableBalance: '',
  getBestBlockHash: '',
  getBlockDeltas: 'str',
  getBlock: 'str int',
  getblockstats: 'str',
  getBlockchainInfo: '',
  findserial: 'src',
  getchaintxstats: 'int str',
  getBlockCount: '',
  getBlockHashes: 'int int obj',
  getBlockHash: 'int',
  getBlockHeader: 'str',
  getBlockNumber: '',
  getBlockTemplate: '',
  getConnectionCount: '',
  getChainTips: '',
  getDifficulty: '',
  getGenerate: '',
  getHashesPerSec: '',
  getInfo: '',
  getMemoryPool: '',
  getMemPoolEntry: 'str',
  getmempooldescendants: 'str bool',
  getmempoolancestors: 'str bool',
  getMemPoolInfo: '',
  getMiningInfo: '',
  getmemoryinfo: '',
  getNetworkInfo: '',
  getNewAddress: '',
  getnewbasecoinaddress: '',
  getAddressInfo: 'str',
  getPeerInfo: '',
  getRawMemPool: 'bool',
  getRawTransaction: 'str int',
  getReceivedByAccount: 'str int',
  getReceivedByAddress: 'str int',
  getSpentInfo: 'obj',
  getTransaction: '',
  getTxOut: 'str int bool',
  gettxoutproof: 'str str',
  getTxOutSetInfo: '',
  getWalletInfo: '',
  getWork: '',
  help: '',
  importAddress: 'str str bool',
  importMulti: 'obj obj',
  importpubkey: 'str',
  importPrivKey: 'str str bool',
  importzerocoins: 'str',
  invalidateBlock: 'str',
  keyPoolRefill: '',
  listAccounts: 'int',
  logging: '',
  listmintedzerocoins: 'bool',
  listAddressGroupings: '',
  listReceivedByAccount: 'int bool',
  listReceivedByAddress: 'int bool',
  listSinceBlock: 'str int',
  listTransactions: 'str int int',
  listUnspent: 'int int',
  listLockUnspent: 'bool',
  lockUnspent: '',
  sethdseed: 'str',
  mintzerocoin: 'int',
  move: 'str str float int str',
  recoveraddresses: 'int',
  rescanblockchain: '',
  rescanringctwallet: '',
  restoreaddresses: 'int',
  prioritiseTransaction: 'str float int',
  spendzerocoin: 'int bool bool int str int',
  spendzerocoinmints: 'str',
  showspendcaching: 'bool',
  searchdeterministiczerocoin: 'int int int',
  sendFrom: 'str str float int str str',
  sendMany: 'str obj int str', //not sure this is will work
  sendRawTransaction: 'str',
  sendToAddress: 'str float str str',
  sendbasecointostealth: 'str float',
  sendstealthtobasecoin: 'str float',
  sendstealthtostealth: 'str float',
  sendstealthtoringct: 'str float',
  sendringcttobasecoin: 'str float',
  sendringcttostealth: 'str float',
  sendringcttoringct: 'str float bool',
  setAccount: '',
  setnetworkactive: 'bool',
  setnonautomintaddress: 'str',
  setGenerate: 'bool int',
  setban: 'str str',
  setTxFee: 'float',
  signMessage: '',
  signRawTransaction: '',
  signRawTransactionWithWallet: 'str',
  signrawtransactionwithkey: 'str',
  signmessagewithprivkey: 'str str',
  startprecomputing: '',
  setprecomputeblockpercycle: 'int',
  stop: '',
  testmempoolaccept: 'obj',
  combinerawtransaction: 'str',
  submitBlock: '',
  validateAddress: '',
  verifyMessage: '',
  verifytxoutproof: 'str',
  walletLock: '',
  walletPassPhrase: 'string bool int',
  walletPassphraseChange: '',
  getzerocoinbalance: '',
  getzerocoinsupply: '',
  resetmintzerocoin: 'bool',
  resetspentzerocoin: '',
  reconsiderzerocoins: '',
  rescanzerocoinwallet: '',
  waitforblock: 'str int',
  waitforblockheight: 'int int',
  waitfornewblock: 'int',
  reconsiderblock: 'str',
  syncwithvalidationinterfacequeue: '',
  scantxoutset: 'str obj',
  preciousblock: 'str',
  verifychain: 'int int',
  savemempool: '',
  pruneblockchain: 'int',
  setmocktime: '',
  walletcreatefundedpsbt: 'str str int',
  walletprocesspsbt: 'str',
  createpsbt: 'str str int',
  combinepsbt: 'str',
  finalizepsbt: 'str',
  converttopsbt: 'str',
  uptime: '',
}

var slice = function(arr, start, end) {
  return Array.prototype.slice.call(arr, start, end)
}

function generateRPCMethods(constructor, apiCalls, rpc) {
  function createRPCMethod(methodName, argMap) {
    return function() {
      var limit = arguments.length - 1

      if (this.batchedCalls) {
        limit = arguments.length
      }

      for (var i = 0; i < limit; i++) {
        if (argMap[i]) {
          arguments[i] = argMap[i](arguments[i])
        }
      }

      if (this.batchedCalls) {
        this.batchedCalls.push({
          jsonrpc: '2.0',
          method: methodName,
          params: slice(arguments),
          id: getRandomId(),
        })
      } else {
        rpc.call(
          this,
          {
            method: methodName,
            params: slice(arguments, 0, arguments.length - 1),
            id: getRandomId(),
          },
          arguments[arguments.length - 1]
        )
      }
    }
  }

  var types = {
    str: function(arg) {
      return arg.toString()
    },
    int: function(arg) {
      return parseFloat(arg)
    },
    float: function(arg) {
      return parseFloat(arg)
    },
    bool: function(arg) {
      return (
        arg === true ||
        arg === '1' ||
        arg === 'true' ||
        arg.toString().toLowerCase() === 'true'
      )
    },
    obj: function(arg) {
      if (typeof arg === 'string') {
        return JSON.parse(arg)
      }
      return arg
    },
  }

  for (var k in apiCalls) {
    var spec = []
    if (apiCalls[k].length) {
      spec = apiCalls[k].split(' ')
      for (var i = 0; i < spec.length; i++) {
        if (types[spec[i]]) {
          spec[i] = types[spec[i]]
        } else {
          spec[i] = types.str
        }
      }
    }
    var methodName = k.toLowerCase()
    constructor.prototype[k] = createRPCMethod(methodName, spec)
    constructor.prototype[methodName] = constructor.prototype[k]
  }
}

function getRandomId() {
  return parseInt(Math.random() * 100000)
}

generateRPCMethods(RpcClient, RpcClient.callspec, rpc)

module.exports = RpcClient
