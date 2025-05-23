import type { PageElement } from '../page'
import { IncidentDateTimePage } from './incidentDateTime'

export default class DetailsPage extends IncidentDateTimePage {
  constructor() {
    super('Incident summary')
  }

  enterDescription(description: string): PageElement<HTMLTextAreaElement> {
    return this.textareaInput('description').clear().type(description)
  }
}
