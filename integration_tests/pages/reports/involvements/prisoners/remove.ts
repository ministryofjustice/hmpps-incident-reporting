import { RemoveInvolvementsPage } from '../abstract'

// eslint-disable-next-line import/prefer-default-export
export class RemovePrisonerInvolvementsPage extends RemoveInvolvementsPage {
  constructor(prisonerNumber: string, name: string) {
    super(`Are you sure you want to remove ${prisonerNumber}: ${name}?`, 'Remove prisoner from report')
  }
}
