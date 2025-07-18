// eslint-disable-next-line max-classes-per-file
import { type Type, getTypeDetails } from '../../../server/reportConfiguration/constants'
import FormWizardPage from '../formWizard'
import type { PageElement } from '../page'

export class ChangeTypeConfirmationPage extends FormWizardPage {
  constructor() {
    super('Most of your answers will be deleted')
  }
}

export class TypePage extends FormWizardPage {
  constructor() {
    super('Select the incident type')
  }

  get typeChoices() {
    return this.radioOrCheckboxChoices('type')
  }

  selectType(type: Type): PageElement<HTMLLabelElement> {
    return this.radioOrCheckboxButton('type', getTypeDetails(type).description).click()
  }
}
