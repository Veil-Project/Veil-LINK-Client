export default function getDefaultVeilDatadir() {
  switch (window.platform) {
    case 'darwin':
      return `${window.remote.app.getPath('appData')}/Veil`
    case 'linux':
      return `${window.remote.app.getPath('home')}/.veil`
    case 'win32':
      return `${window.remote.app.getPath('appData')}/Roaming/Veil`
    default:
      return ''
  }
}
