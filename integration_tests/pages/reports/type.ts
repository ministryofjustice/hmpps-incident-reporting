import { type Type, getTypeDetails } from '../../../server/reportConfiguration/constants'
import FormWizardPage from '../formWizard'

export default class TypePage extends FormWizardPage {
  constructor() {
    super('Select the incident type')
  }

  selectType(type: Type) {
    this.radioOrCheckboxButton('type', getTypeDetails(type).description).click()
  }
}
