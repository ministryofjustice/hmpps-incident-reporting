/**
 * DPS cards that have a heading link only accept clinks on the heading text itself.
 * This forwards a click anywhere inside the card to this heading link.
 */
// eslint-disable-next-line import/prefer-default-export
export function initDpsCards() {
  const clickableCards = document.getElementsByClassName('dps-card--clickable')
  for (const card of clickableCards) {
    const links = card.getElementsByClassName('dps-card__link')
    const link = links.item(0)
    if (link) {
      card.addEventListener('click', event => {
        if (event.target.nodeName !== 'A') {
          event.stopPropagation()
          const divertedEvent = new event.constructor(event.type, event)
          link.dispatchEvent(divertedEvent)
        }
      })
    }
  }
}
