import format from '../../../server/utils/format'
import FormWizardPage from '../formWizard'

export default class DetailsPage extends FormWizardPage {
  constructor() {
    super('Incident summary')
  }

  enterDate(date: Date | string): void {
    const value = date instanceof Date ? format.shortDate(date) : date
    this.dateInput('incidentDate').clear().type(value)
  }

  enterTime(hours: string, minutes: string): void {
    this.timeInput('incidentTime', 'hours').clear().type(hours)
    this.timeInput('incidentTime', 'minutes').clear().type(minutes)
  }

  enterDescription(description: string): void {
    this.textareaInput('description').clear().type(description)
  }
}
