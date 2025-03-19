import {
  getPrisonerInvolvementRoleDetails,
  PrisonerInvolvementRole,
} from '../../../../../server/reportConfiguration/constants'
import { AddInvolvementsPage } from '../abstract'
import type { PageElement } from '../../../page'

// eslint-disable-next-line import/prefer-default-export
export class AddPrisonerInvolvementsPage extends AddInvolvementsPage {
  protected roleFieldName = 'prisonerRole'

  constructor(whose: string) {
    super(`${whose} involvement in the incident`)
  }

  selectRole(prisonerRole: PrisonerInvolvementRole): PageElement<HTMLLabelElement> {
    return super.selectRole(getPrisonerInvolvementRoleDetails(prisonerRole).description)
  }
}
