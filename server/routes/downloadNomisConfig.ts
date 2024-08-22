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
    async incidentTypes(req, res): Promise<void> {
      const { prisonApi } = res.locals.apis
      const incidentTypes = await prisonApi.getIncidentTypeConfiguration()

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

      return streamCsvDownload(res, 'incident-types.csv', mapTypes())
    },

    async incidentTypeQuestions(req, res): Promise<void> {
      const { type } = req.params
      if (!type) {
        throw new NotFound()
      }

      const { prisonApi } = res.locals.apis
      const incidentTypes = await prisonApi.getIncidentTypeConfiguration(type)

      function* mapType(): Generator<CsvCellValue[]> {
        if (incidentTypes.length !== 1) {
          yield ['Type not found', type]
          return
        }

        yield [
          // question headers
          'Question ID',
          'Question sequence',
          'Question list sequence',
          'Question',
          'Allows multiple answers?',
          'Question is active',
          'Question expired',
          // answer headers
          'Answer ID',
          'Answer sequence',
          'Answer list sequence',
          'Answer',
          'Answer requires comment',
          'Answer requires date',
          'Answer is active',
          'Answer expired',
          'Next question ID',
        ]

        for (const question of incidentTypes[0].questions) {
          yield [
            question.questionnaireQueId,
            question.questionSeq,
            question.questionListSeq,
            question.questionDesc,
            question.multipleAnswerFlag,
            question.questionActiveFlag,
            format.shortDate(question.questionExpiryDate),
            ...Array(8),
          ]
          for (const answer of question.answers) {
            yield [
              ...Array(7),
              answer.questionnaireAnsId,
              answer.answerSeq,
              answer.answerListSeq,
              answer.answerDesc,
              answer.answerActiveFlag,
              answer.commentRequiredFlag,
              answer.dateRequiredFlag,
              format.shortDate(answer.answerExpiryDate),
              answer.nextQuestionnaireQueId ?? 'None',
            ]
          }
        }
      }

      return streamCsvDownload(res, `incident-type-questions-${type}.csv`, mapType())
    },

    async incidentTypePrisonerRoles(req, res): Promise<void> {
      const { type } = req.params
      if (!type) {
        throw new NotFound()
      }

      const { prisonApi } = res.locals.apis
      const [prisonerInvolvementRoles, incidentTypes] = await Promise.all([
        prisonApi.getPrisonerInvolvementRoles(),
        prisonApi.getIncidentTypeConfiguration(type),
      ])
      const prisonerInvolvementMap = new Map(prisonerInvolvementRoles.map(code => [code.code, code.description]))

      function* mapType(): Generator<CsvCellValue[]> {
        if (incidentTypes.length !== 1) {
          yield ['Type not found', type]
          return
        }

        yield ['Role', 'Description (from reference data)', 'Only one prisoner can have this role', 'Active', 'Expired']

        for (const prisonerRole of incidentTypes[0].prisonerRoles) {
          yield [
            prisonerRole.prisonerRole,
            prisonerInvolvementMap.get(prisonerRole.prisonerRole) ?? '',
            prisonerRole.singleRole,
            prisonerRole.active,
            format.shortDate(prisonerRole.expiryDate),
          ]
        }
      }

      return streamCsvDownload(res, `incident-type-prisoner-roles-${type}.csv`, mapType())
    },

    async staffInvolvementRoles(req, res): Promise<void> {
      const { prisonApi } = res.locals.apis
      const referenceCodes = await prisonApi.getStaffInvolvementRoles()
      return streamCsvDownload(res, 'staff-involvement-roles.csv', mapCodes(referenceCodes))
    },

    async prisonerInvolvementRoles(req, res): Promise<void> {
      const { prisonApi } = res.locals.apis
      const referenceCodes = await prisonApi.getPrisonerInvolvementRoles()
      return streamCsvDownload(res, 'prisoner-involvement-roles.csv', mapCodes(referenceCodes))
    },

    async prisonerInvolvementOutcome(req, res): Promise<void> {
      const { prisonApi } = res.locals.apis
      const referenceCodes = await prisonApi.getPrisonerInvolvementOutcome()
      return streamCsvDownload(res, 'prisoner-involvement-outcome.csv', mapCodes(referenceCodes))
    },
  }
}
