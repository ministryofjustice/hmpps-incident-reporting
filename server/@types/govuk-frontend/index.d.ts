/**
 * GOV.UK Frontend types based on v5.14.0
 * NB: this was recreated manually from javascript sources and remains incomplete!
 * For example, no concrete component classes are included like Accordion or Radios.
 */

declare module 'govuk-frontend' {
  /**
   * Create all instances of a specific component on the page
   *
   * Uses the `data-module` attribute to find all elements matching the specified
   * component on the page, creating instances of the component object for each
   * of them.
   *
   * Any component errors will be caught and logged to the console.
   */
  export function createAll<T extends Component>(
    component: typeof T,
    config?: ConstructorParameters<T>[1],
    createAllOptions?:
      | {
          scope?: HTMLElement
          onError?: ErrorCallback
        }
      | HTMLElement
      | ErrorCallback,
  ): void
}
