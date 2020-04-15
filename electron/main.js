"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var electron_updater_1 = require("electron-updater");
var url_1 = __importDefault(require("url"));
var path_1 = __importDefault(require("path"));
var Daemon_1 = __importDefault(require("./Daemon"));
var AppWindow_1 = __importDefault(require("./AppWindow"));
// Set up main window
var startUrl = process.env.ELECTRON_START_URL ||
    url_1.default.format({
        pathname: path_1.default.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true,
    });
var mainWindow = new AppWindow_1.default(startUrl);
// Set up veild daemon
var daemon = new Daemon_1.default();
daemon.on('transaction', function (txid, event) {
    mainWindow.emit('daemon-transaction', txid, event);
});
daemon.on('download-progress', function (state) {
    mainWindow.emit('daemon-download-progress', state);
});
daemon.on('warmup', function (status) {
    mainWindow.emit('daemon-warmup', status);
});
daemon.on('stdout', function (message) {
    mainWindow.emit('daemon-stdout', message);
});
daemon.on('stderr', function (message) {
    mainWindow.emit('daemon-stderr', message);
});
daemon.on('blockchain-tip', function (tip) {
    mainWindow.emit('daemon-blockchain-tip', tip);
});
daemon.on('error', function (message) {
    mainWindow.emit('daemon-error', message);
});
daemon.on('exit', function () {
    mainWindow.emit('daemon-exit');
});
// App listeners
electron_1.app.on('before-quit', function (e) {
    if (daemon.running) {
        e.preventDefault();
        mainWindow.emit('app-quitting');
        var stopAndQuit = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, daemon.stop()];
                    case 1:
                        _a.sent();
                        electron_1.app.quit();
                        return [2 /*return*/];
                }
            });
        }); };
        stopAndQuit();
    }
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('ready', function (e) {
    mainWindow.open();
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
});
electron_1.app.on('activate', function (e) {
    if (!mainWindow.isOpen()) {
        mainWindow.open();
    }
});
// API for renderer process
electron_1.ipcMain.handle('show-open-dialog', function (_, options) {
    if (mainWindow.window === null)
        return;
    return electron_1.dialog.showOpenDialogSync(mainWindow.window, options);
});
electron_1.ipcMain.handle('show-save-dialog', function (_, options) {
    if (mainWindow.window === null)
        return;
    return electron_1.dialog.showSaveDialogSync(mainWindow.window, options);
});
electron_1.ipcMain.handle('open-external-link', function (_, url) {
    electron_1.shell.openExternal(url);
});
electron_1.ipcMain.handle('relaunch', function () {
    electron_1.app.relaunch();
    electron_1.app.quit();
});
// Daemon API for renderer
electron_1.ipcMain.handle('set-daemon-path', function (_, path) {
    daemon.path = path;
});
electron_1.ipcMain.handle('get-daemon-info', function (_) {
    return daemon.getInfo();
});
electron_1.ipcMain.handle('download-daemon', function (_, url) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, daemon.download(url)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('start-daemon', function (_, options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, daemon.start(options)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('stop-daemon', function (_) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, daemon.stop()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
