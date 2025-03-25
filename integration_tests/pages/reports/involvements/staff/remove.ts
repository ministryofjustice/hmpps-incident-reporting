import { RemoveInvolvementsPage } from '../abstract'

// eslint-disable-next-line import/prefer-default-export
export class RemoveStaffInvolvementsPage extends RemoveInvolvementsPage {
  constructor(name: string) {
    super(`Are you sure you want to remove ${name}?`, 'Remove member of staff from report')
  }
}
