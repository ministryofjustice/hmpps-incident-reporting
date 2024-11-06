import Page, { type PageElement } from './page'

export default abstract class FormWizardPage extends Page {
  /**
   * Find the form on a form wizard layout page
   */
  protected get form(): PageElement<HTMLFormElement> {
    return cy.get('form#form-wizard')
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
   * Find a save button by label
   */
  protected saveButton(label = 'Save and continue'): PageElement<HTMLButtonElement> {
    return this.form.find<HTMLButtonElement>('.govuk-button').contains(label)
  }
}
