import type { RequestHandler, Response } from 'express'
import { NotFound } from 'http-errors'

import type { ReferenceCode } from '../data/prisonApi'
import format from '../utils/format'

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
    incidentTypes(req, res): void {
      const { prisonApi } = res.locals.apis
      prisonApi.getIncidentTypeConfiguration().then(incidentTypes => {
        function* mapTypes(): Generator<CsvCellValue[]> {
          yield ['Type', 'Description', 'Questionnaire ID', 'Active', 'Expired']

          for (const incidentType of incidentTypes) {
            yield [
              incidentType.incidentType,
              incidentType.incidentTypeDescription,
              incidentType.questionnaireId,
              incidentType.active,
              format.shortDate(incidentType.expiryDate),
            ]
          }
        }

        streamCsvDownload(res, 'incident-types.csv', mapTypes())
      })
    },

    incidentTypeQuestions(req, res): void {
      const { type } = req.params
      if (!type) {
        throw new NotFound()
      }

      const { prisonApi } = res.locals.apis
      prisonApi.getIncidentTypeConfiguration(type).then(incidentTypes => {
        function* mapType(): Generator<CsvCellValue[]> {
          if (incidentTypes.length !== 1) {
            yield ['Type not found', type]
            return
          }

          yield ['Question ID', 'Sequence', 'List sequence', 'Question', 'Allows multiple answers', 'Active', 'Expired']

          for (const question of incidentTypes[0].questions) {
            yield [
              question.questionnaireQueId,
              question.questionSeq,
              question.questionListSeq,
              question.questionDesc,
              question.multipleAnswerFlag,
              question.questionActiveFlag,
              format.shortDate(question.questionExpiryDate),
            ]
          }
        }

        streamCsvDownload(res, `incident-type-questions-${type}.csv`, mapType())
      })
    },

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
