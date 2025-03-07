import { InvolvementSummary } from '../../../../controllers/involvements/summary'
import { prisonerInvolvementOutcomes, prisonerInvolvementRoles } from '../../../../reportConfiguration/constants'

export default class PrisonerSummary extends InvolvementSummary {
  protected type = 'prisoners' as const

  protected involvementField = 'prisonersInvolved' as const

  protected involvementDoneField = 'prisonerInvolvementDone' as const

  protected pageTitleBeforeInvolvementDone = 'Were any prisoners involved in the incident?'

  protected pageTitleOnceInvolvementDone = 'Prisoners involved'

  protected labelOnceInvolvementDone = 'Do you want to add a prisoner?'

  protected confirmError = 'Select if you would like to add another prisoner to continue'

  protected localsForLookups(): Record<string, unknown> {
    const prisonerInvolvementLookup = Object.fromEntries(
      prisonerInvolvementRoles.map(role => [role.code, role.description]),
    )
    const prisonerOutcomeLookup = Object.fromEntries(
      prisonerInvolvementOutcomes.map(outcome => [outcome.code, outcome.description]),
    )
    return {
      prisonerInvolvementLookup,
      prisonerOutcomeLookup,
    }
  }
}
