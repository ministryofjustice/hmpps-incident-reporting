import { type Type, getTypeDetails } from '../../../server/reportConfiguration/constants'
import FormWizardPage from '../formWizard'
import type { PageElement } from '../page'

export default class TypePage extends FormWizardPage {
  constructor() {
    super('Select the incident type')
  }

  selectType(type: Type): PageElement<HTMLLabelElement> {
    return this.radioOrCheckboxButton('type', getTypeDetails(type).description).click()
  }
}
