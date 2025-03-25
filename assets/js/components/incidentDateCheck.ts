import { parseDateInput } from '../../../server/utils/parseDateTime'
import { Dialogue } from './dialogue'

// eslint-disable-next-line import/prefer-default-export
export class IncidentDateCheck extends Dialogue {
  static moduleName = 'incident-date-check'

  form: HTMLFormElement

  constructor(root: HTMLDialogElement) {
    super(root)

    const cutOffDate = new Date()
    cutOffDate.setFullYear(cutOffDate.getFullYear() - 1)

    const form = document.getElementById('form-wizard') as HTMLFormElement
    const dateField = form?.querySelector<HTMLInputElement>('[name=incidentDate]')
    if (!dateField) {
      // eslint-disable-next-line no-console
      console.error('Cannot find incident date field')
      return
    }

    form.addEventListener('submit', event => {
      if (root.open) {
        // form is being submitted from dialogue
        return
      }

      const dateString = dateField.value ?? ''
      let date: Date
      try {
        date = parseDateInput(dateString)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // let backend handle error messaging
        return
      }
      if (date < cutOffDate) {
        // cancel form submission
        event.preventDefault()
        // ask to confirm incident date
        this.open()
      }
    })
    this.form = form
  }

  onClose(): void {
    if (this.$root.returnValue === 'yes') {
      // submit form
      this.form.submit()
    }
  }
}
