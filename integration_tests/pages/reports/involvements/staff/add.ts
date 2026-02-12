import {
  getStaffInvolvementRoleDetails,
  StaffInvolvementRole,
} from '../../../../../server/reportConfiguration/constants'
import { AddInvolvementsPage } from '../abstract'
import type { PageElement } from '../../../page'

export class AddStaffInvolvementsPage extends AddInvolvementsPage {
  protected roleFieldName = 'staffRole'

  constructor(who: string, whose: string) {
    super(`How was ${who}`, `${whose} involvement in the incident`)
  }

  selectRole(staffRole: StaffInvolvementRole): PageElement<HTMLInputElement> {
    return super.selectRole(getStaffInvolvementRoleDetails(staffRole).description)
  }
}
