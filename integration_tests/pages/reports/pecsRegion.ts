import FormWizardPage from '../formWizard'
import type { PageElement } from '../page'

export class PecsRegionPage extends FormWizardPage {
  constructor() {
    super('In which region did the incident happen?')
  }

  get pecsRegionChoices() {
    return this.radioOrCheckboxChoices('pecsRegion')
  }

  selectPecsRegion(label: string): PageElement<HTMLLabelElement> {
    return this.radioOrCheckboxButton('pecsRegion', label).click()
  }
}
