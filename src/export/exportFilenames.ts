export function buildExportFilename(name: string, dateStr: string | null, ext: string): string {
  const namePart = name.trim() ? name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'report'
  const datePart = dateStr ?? new Date().toISOString().slice(0, 10)
  return `pension-${namePart}-${datePart}.${ext}`
}
