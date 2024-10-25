import { Component, createAll } from 'govuk-frontend'

import { DpsCard } from './dpsCard'

// eslint-disable-next-line import/prefer-default-export
export function initApplicationComponents() {
  try {
    Component.checkSupport()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e)
    return
  }

  const components: (typeof Component<HTMLElement>)[] = [
    // add DPS and application components here:
    DpsCard,
  ]
  components.forEach(component => createAll(component))
}
