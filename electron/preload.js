"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
window.platform = process.platform;
window.ipcRenderer = electron_1.ipcRenderer;
window.remote = electron_1.remote;
window.clipboard = electron_1.clipboard;
window.getConfig = function () {
    var configPath = path_1.default.join(electron_1.app.getPath('userData'), 'config.json');
    try {
        return JSON.parse(fs_1.default.readFileSync(configPath, 'utf-8'));
    }
    catch (error) {
        console.error(error);
    }
};
