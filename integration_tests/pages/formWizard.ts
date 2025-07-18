import Page, { type PageElement } from './page'

export default abstract class FormWizardPage extends Page {
  /**
   * Find the form on a form wizard layout page
   */
  protected get form(): PageElement<HTMLFormElement> {
    return cy.get('form#form-wizard')
  }

  /**
   * Current form values of field name to all-value arrays
   */
  get formValues(): Cypress.Chainable<Record<string, string[]>> {
    return this.form.then(form => {
      const formElement = form.get()[0]
      const formData = new FormData(formElement)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore FormData does have a keys function that returns an Iterable with a map function,
      // which, according to MDN, is well-supported and does work in Cypress’s Electron browser
      const fieldNames = formData.keys() as Array<string>
      return Object.fromEntries(fieldNames.map(fieldName => [fieldName, formData.getAll(fieldName) as string[]]))
    })
  }

  private findFormInput<T extends HTMLElement>(name: string): PageElement<T> {
    return this.form.find<T>(`[name="${name}"]`)
  }

  /**
   * Find a regular text input box by name
   */
  protected textInput(name: string): PageElement<HTMLInputElement> {
    return this.findFormInput<HTMLInputElement>(name).should('have.class', 'govuk-input')
  }

  /**
   * Find a text input box with a date picker by name
   */
  protected dateInput(name: string): PageElement<HTMLInputElement> {
    return this.findFormInput<HTMLInputElement>(name).should('have.class', 'moj-js-datepicker-input')
  }

  /**
   * Find one of the text input boxes for time input by name
   */
  protected timeInput(name: string, part: 'hours' | 'minutes'): PageElement<HTMLInputElement> {
    return this.findFormInput<HTMLInputElement>(`_${name}-${part}`).should('have.class', 'govuk-date-input__input')
  }

  /**
   * Find a textarea box by name
   */
  protected textareaInput(name: string): PageElement<HTMLTextAreaElement> {
    return this.findFormInput<HTMLTextAreaElement>(name).should('have.class', 'govuk-textarea')
  }

  /**
   * Find a select input by name
   */
  protected selectInput(name: string): PageElement<HTMLSelectElement> {
    return this.findFormInput<HTMLSelectElement>(name).should('have.class', 'govuk-select')
  }

  /**
   * Find the label for a radio or checkbox button
   */
  protected radioOrCheckboxButton(name: string, label: string): PageElement<HTMLLabelElement> {
    return this.form.find(`#${name}`).find<HTMLLabelElement>('label').contains(label)
  }

  /**
   * Get the labels and values for a radio or checkbox button group
   */
  protected radioOrCheckboxChoices(name: string) {
    return FormWizardPage.choicesFromRadioInputs(this.findFormInput<HTMLInputElement>(name))
  }

  protected saveAndContinueText = 'Continue'

  /**
   * Save & continue button
   */
  get saveButton(): PageElement<HTMLButtonElement> {
    return this.form.find<HTMLButtonElement>('.govuk-button').contains(this.saveAndContinueText)
  }

  protected saveAndExitText = 'Save and exit'

  /**
   * Save & exit button
   * NB: sometimes it’s a link!
   */
  get saveAndExitButton(): PageElement<HTMLButtonElement | HTMLAnchorElement> {
    return this.form.find<HTMLButtonElement | HTMLAnchorElement>('.govuk-button').contains(this.saveAndExitText)
  }

  /**
   * Submit the form and continue
   */
  submit(): void {
    this.saveButton.click()
  }

  /**
   * Submit the form and exit
   */
  submitAndExit(): void {
    this.saveAndExitButton.click()
  }
}
