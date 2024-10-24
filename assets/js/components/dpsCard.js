import { Component } from 'govuk-frontend'

/**
 * DPS cards that have a heading link only accept clinks on the heading text itself.
 * This forwards a click anywhere inside the card to this heading link.
 */
// eslint-disable-next-line import/prefer-default-export
export class DpsCard extends Component {
  /** @param {HTMLDivElement} root */
  constructor(root) {
    super(root)

    /** @type {HTMLCollectionOf<HTMLAnchorElement>} */
    const links = root.getElementsByClassName('dps-card__link')
    /** @type {HTMLAnchorElement | undefined} */
    const link = links.item(0)
    if (link) {
      this.link = link
      const boundOnClick = this.onClick.bind(this)
      root.addEventListener('click', boundOnClick)
    }
  }

  /** @param {MouseEvent} event */
  onClick(event) {
    if (event.target.nodeName !== 'A') {
      event.stopPropagation()
      const divertedEvent = new event.constructor(event.type, event)
      this.link.dispatchEvent(divertedEvent)
    }
  }
}

DpsCard.moduleName = 'dps-card'
DpsCard.elementType = HTMLDivElement
