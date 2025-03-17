import FormWizardPage from '../formWizard'

export default class ReportPage extends FormWizardPage {
  constructor(reference: string, unsubmitted = false) {
    super(
      unsubmitted ? `Check your answers – incident reference ${reference}` : `Incident reference ${reference}`,
      `Incident reference ${reference}`,
    )
  }
}
