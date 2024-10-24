import { isSupported } from 'govuk-frontend/dist/govuk/common/index.mjs'
import { SupportError } from 'govuk-frontend/dist/govuk/errors/index.mjs'

import { DpsCard } from './dpsCard'

// eslint-disable-next-line import/prefer-default-export
export function initApplicationComponents() {
  if (!isSupported()) {
    // eslint-disable-next-line no-console
    console.log(new SupportError())
    return
  }

  const components = [DpsCard]
  for (const Component of components) {
    const elements = document.querySelectorAll(`[data-module="${Component.moduleName}"]`)
    for (const element of elements) {
      // eslint-disable-next-line no-new
      new Component(element)
    }
  }
}
