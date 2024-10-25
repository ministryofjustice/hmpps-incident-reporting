import { Component } from 'govuk-frontend'

/**
 * DPS cards that have a heading link only accept clinks on the heading text itself.
 * This forwards a click anywhere inside the card to this heading link.
 */
// eslint-disable-next-line import/prefer-default-export
export class DpsCard extends Component<HTMLDivElement> {
  static moduleName = 'dps-card'

  private link: HTMLAnchorElement | undefined

  constructor(root: HTMLDivElement) {
    super(root)

    const links = root.getElementsByClassName('dps-card__link')
    const link = links.item(0)
    if (link instanceof HTMLAnchorElement) {
      this.link = link
      const boundOnClick = this.onClick.bind(this)
      root.addEventListener('click', boundOnClick)
    }
  }

  onClick(event: MouseEvent) {
    if (event.target instanceof HTMLElement && event.target.nodeName !== 'A') {
      event.stopPropagation()
      const divertedEvent = new (event.constructor as typeof MouseEvent)(event.type, event)
      this.link.dispatchEvent(divertedEvent)
    }
  }
}
