export default function formatDate(date: Date, format: string): string {
  // @ts-ignore
  return date.toLocaleDateString('en-US', { dateStyle: format })
}
