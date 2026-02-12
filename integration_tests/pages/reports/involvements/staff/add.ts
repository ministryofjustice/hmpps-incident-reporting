import {
  getStaffInvolvementRoleDetails,
  StaffInvolvementRole,
} from '../../../../../server/reportConfiguration/constants'
import { AddInvolvementsPage } from '../abstract'
import type { PageElement } from '../../../page'

export class AddStaffInvolvementsPage extends AddInvolvementsPage {
  protected roleFieldName = 'staffRole'

  constructor(who: string) {
    super(`How was ${who}`, `How was ${who} involved in the incident?`)
  }

  selectRole(staffRole: StaffInvolvementRole): PageElement<HTMLLabelElement> {
    return super.selectRole(getStaffInvolvementRoleDetails(staffRole).description)
  }
}
