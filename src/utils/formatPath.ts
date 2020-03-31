export default function formatPath(path: string) {
  return path.replace(/\/users\/\w*\//gi, '~/')
}
