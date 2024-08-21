import type { RequestHandler, Response } from 'express'

import type { ReferenceCode } from '../data/prisonApi'

function streamReferenceCodeResponse(fileName: string, referenceCodes: ReferenceCode[], res: Response): void {
  res.header('Content-Type', 'text/csv')
  res.header('Content-Disposition', `attachment; filename="${fileName}"`)
  res.write('Domain,Code,Description,Sequence,Active,System\n')
  referenceCodes.forEach(referenceCode => {
    const fields = [
      referenceCode.domain,
      referenceCode.code,
      referenceCode.description,
      referenceCode.listSeq?.toString() ?? '',
      referenceCode.activeFlag === 'N' ? 'FALSE' : 'TRUE',
      referenceCode.systemDataFlag === 'N' ? 'FALSE' : 'TRUE',
    ]
    res.write(`${fields.join(',')}\n`)
  })
  res.end()
}

export default function makeDownloadNomisConfigRoutes(): Record<string, RequestHandler> {
  return {
    incidentTypes(req, res): void {
      const { prisonApi } = res.locals.apis
      prisonApi
        .getIncidentTypes()
        .then(referenceCodes => streamReferenceCodeResponse('incident-types.csv', referenceCodes, res))
    },

    staffInvolvementRoles(req, res): void {
      const { prisonApi } = res.locals.apis
      prisonApi
        .getStaffInvolvementRoles()
        .then(referenceCodes => streamReferenceCodeResponse('staff-involvement-roles.csv', referenceCodes, res))
    },

    prisonerInvolvementRoles(req, res): void {
      const { prisonApi } = res.locals.apis
      prisonApi
        .getPrisonerInvolvementRoles()
        .then(referenceCodes => streamReferenceCodeResponse('prisoner-involvement-roles.csv', referenceCodes, res))
    },

    prisonerInvolvementOutcome(req, res): void {
      const { prisonApi } = res.locals.apis
      prisonApi
        .getPrisonerInvolvementOutcome()
        .then(referenceCodes => streamReferenceCodeResponse('prisoner-involvement-outcome.csv', referenceCodes, res))
    },
  }
}
