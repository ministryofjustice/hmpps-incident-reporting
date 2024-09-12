import { Router, type Request, type Response } from 'express'
import { NotFound } from 'http-errors'

import type { ReferenceCode } from '../../data/prisonApi'
import format from '../../utils/format'
import { jsonDownload, streamCsvDownload, type CsvCellValue } from './utils'

function isFileTypeSupported(fileType: string): fileType is 'csv' | 'json' {
  return ['csv', 'json'].includes(fileType)
}

async function downloadIncidentTypes(req: Request, res: Response): Promise<void> {
  const { fileType } = req.params
  if (!isFileTypeSupported(fileType)) {
    throw new NotFound()
  }

  const fileName = 'incident-types'
  const { prisonApi } = res.locals.apis
  const incidentTypes = await prisonApi.getIncidentTypeConfiguration()

  if (fileType === 'json') {
    return jsonDownload(res, fileName, incidentTypes)
  }

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

  return streamCsvDownload(res, fileName, mapTypes())
}

async function downloadIncidentTypeQuestions(req: Request, res: Response): Promise<void> {
  const { type, fileType } = req.params
  if (!type || !isFileTypeSupported(fileType)) {
    throw new NotFound()
  }

  const fileName = `incident-type-questions-${type}`
  const { prisonApi } = res.locals.apis
  const incidentTypes = await prisonApi.getIncidentTypeConfiguration(type)
  if (incidentTypes.length === 0) {
    throw new NotFound(`Incident type “${type}” not found`)
  }

  if (fileType === 'json') {
    return jsonDownload(res, fileName, incidentTypes[0])
  }

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

  return streamCsvDownload(res, fileName, mapType())
}

async function downloadIncidentTypePrisonerRoles(req: Request, res: Response): Promise<void> {
  const { type, fileType } = req.params
  if (!type || !isFileTypeSupported(fileType)) {
    throw new NotFound()
  }

  const fileName = `incident-type-prisoner-roles-${type}`
  const { prisonApi } = res.locals.apis
  const [prisonerInvolvementRoles, incidentTypes] = await Promise.all([
    prisonApi.getPrisonerInvolvementRoles(),
    prisonApi.getIncidentTypeConfiguration(type),
  ])
  if (incidentTypes.length === 0) {
    throw new NotFound(`Incident type “${type}” not found`)
  }

  if (fileType === 'json') {
    return jsonDownload(res, fileName, prisonerInvolvementRoles)
  }

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

  return streamCsvDownload(res, fileName, mapType())
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

async function downloadStaffInvolvementRoles(req: Request, res: Response): Promise<void> {
  const { fileType } = req.params
  if (!isFileTypeSupported(fileType)) {
    throw new NotFound()
  }

  const fileName = 'staff-involvement-roles'
  const { prisonApi } = res.locals.apis
  const referenceCodes = await prisonApi.getStaffInvolvementRoles()

  if (fileType === 'json') {
    return jsonDownload(res, fileName, referenceCodes)
  }
  return streamCsvDownload(res, fileName, mapCodes(referenceCodes))
}

async function downloadPrisonerInvolvementRoles(req: Request, res: Response): Promise<void> {
  const { fileType } = req.params
  if (!isFileTypeSupported(fileType)) {
    throw new NotFound()
  }

  const fileName = 'prisoner-involvement-roles'
  const { prisonApi } = res.locals.apis
  const referenceCodes = await prisonApi.getPrisonerInvolvementRoles()

  if (fileType === 'json') {
    return jsonDownload(res, fileName, referenceCodes)
  }
  return streamCsvDownload(res, fileName, mapCodes(referenceCodes))
}

async function downloadPrisonerInvolvementOutcome(req: Request, res: Response): Promise<void> {
  const { fileType } = req.params
  if (!isFileTypeSupported(fileType)) {
    throw new NotFound()
  }

  const fileName = 'prisoner-involvement-outcome'
  const { prisonApi } = res.locals.apis
  const referenceCodes = await prisonApi.getPrisonerInvolvementOutcome()

  if (fileType === 'json') {
    return jsonDownload(res, fileName, referenceCodes)
  }
  return streamCsvDownload(res, fileName, mapCodes(referenceCodes))
}

export default function makeNomisConfigRouter(): Router {
  const router = Router()

  router.get('/incident-types.:fileType', downloadIncidentTypes)
  router.get('/incident-type/:type/questions.:fileType', downloadIncidentTypeQuestions)
  router.get('/incident-type/:type/prisoner-roles.:fileType', downloadIncidentTypePrisonerRoles)
  router.get('/staff-involvement-roles.:fileType', downloadStaffInvolvementRoles)
  router.get('/prisoner-involvement-roles.:fileType', downloadPrisonerInvolvementRoles)
  router.get('/prisoner-involvement-outcome.:fileType', downloadPrisonerInvolvementOutcome)

  return router
}
