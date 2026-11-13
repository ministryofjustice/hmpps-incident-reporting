import type { Response } from 'express'

export function jsonDownload<T>(res: Response, fileName: string, data: T): void {
  res.header('Content-Type', 'application/json')
  res.header('Content-Disposition', `attachment; filename="${fileName}.json"`)
  res.send(JSON.stringify(data))
  res.end()
}
