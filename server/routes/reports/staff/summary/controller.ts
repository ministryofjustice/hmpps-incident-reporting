import { InvolvementSummary } from '../../../../controllers/involvements/summary'
import { staffInvolvementRoles } from '../../../../reportConfiguration/constants'

export default class StaffSummary extends InvolvementSummary {
  protected type = 'staff' as const

  protected involvementField = 'staffInvolved' as const

  protected involvementDoneField = 'staffInvolvementDone' as const

  protected pageTitleBeforeInvolvementDone = 'Were any staff involved in the incident?'

  protected pageTitleOnceInvolvementDone = 'Staff involved'

  protected labelOnceInvolvementDone = 'Do you want to add a member of staff?'

  protected confirmError = 'Select if you would like to add another staff member to continue'

  protected localsForLookups(): Record<string, unknown> {
    const staffInvolvementLookup = Object.fromEntries(staffInvolvementRoles.map(role => [role.code, role.description]))
    return {
      staffInvolvementLookup,
    }
  }
}
