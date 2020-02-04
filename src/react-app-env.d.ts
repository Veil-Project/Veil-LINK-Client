/// <reference types="react-scripts" />

interface Config {
  darkTheme: boolean
}

declare interface Window {
  getConfig(): Config
}
