export default function formatTime(date: Date, format: string): string {
  // @ts-ignore
  return date.toLocaleTimeString('en-US', { timeStyle: format })
}
