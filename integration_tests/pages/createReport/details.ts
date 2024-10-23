import format from '../../../server/utils/format'
import FormWizardPage from '../formWizard'

export default class DetailsPage extends FormWizardPage {
  constructor() {
    super('Incident details')
  }

  enterDate(date: Date | string): void {
    const value = date instanceof Date ? format.shortDate(date) : date
    this.dateInput('incidentDate').type(value)
  }

  enterTime(hours: string, minutes: string): void {
    this.timeInput('incidentTime', 'hours').type(hours)
    this.timeInput('incidentTime', 'minutes').type(minutes)
  }

  enterDescription(description: string): void {
    this.textareaInput('description').type(description)
  }

  submit(): void {
    this.saveButton().click()
  }
}
