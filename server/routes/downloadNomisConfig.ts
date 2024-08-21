import type { RequestHandler, Response } from 'express'

import type { ReferenceCode } from '../data/prisonApi'

type CsvCellValue = string | number | boolean | null

function streamCsvDownload(res: Response, fileName: string, lines: Generator<CsvCellValue[]>): void {
  res.header('Content-Type', 'text/csv')
  res.header('Content-Disposition', `attachment; filename="${fileName}"`)
  for (const line of lines) {
    const lineString = line.map(escapeCsvCell).join(',')
    res.write(`${lineString}\n`)
  }
  res.end()
}

function escapeCsvCell(value: CsvCellValue): string {
  /* eslint-disable no-param-reassign */
  if (value === null || value === undefined) {
    return ''
  }
  if (value === true) {
    return 'TRUE'
  }
  if (value === false) {
    return 'FALSE'
  }
  let mustQuote = false
  if (typeof value === 'number') {
    value = value.toString()
  }
  if (value.includes(',')) {
    mustQuote = true
  }
  if (value.includes('"')) {
    value = value.replaceAll('"', '""')
    mustQuote = true
  }
  if (mustQuote) {
    return `"${value}"`
  }
  return value
  /* eslint-enable no-param-reassign */
}

function* mapCodes(referenceCodes: ReferenceCode[]) {
  yield ['Domain', 'Code', 'Description', 'Sequence', 'Active', 'System']
  for (const referenceCode of referenceCodes) {
    yield [
      referenceCode.domain,
      referenceCode.code,
      referenceCode.description,
      referenceCode.listSeq,
      referenceCode.activeFlag === 'Y',
      referenceCode.systemDataFlag === 'Y',
    ]
  }
}

export default function makeDownloadNomisConfigRoutes(): Record<string, RequestHandler> {
  return {
    staffInvolvementRoles(req, res): void {
      const { prisonApi } = res.locals.apis
      prisonApi
        .getStaffInvolvementRoles()
        .then(referenceCodes => streamCsvDownload(res, 'staff-involvement-roles.csv', mapCodes(referenceCodes)))
    },

    prisonerInvolvementRoles(req, res): void {
      const { prisonApi } = res.locals.apis
      prisonApi
        .getPrisonerInvolvementRoles()
        .then(referenceCodes => streamCsvDownload(res, 'prisoner-involvement-roles.csv', mapCodes(referenceCodes)))
    },

    prisonerInvolvementOutcome(req, res): void {
      const { prisonApi } = res.locals.apis
      prisonApi
        .getPrisonerInvolvementOutcome()
        .then(referenceCodes => streamCsvDownload(res, 'prisoner-involvement-outcome.csv', mapCodes(referenceCodes)))
    },
  }
}
