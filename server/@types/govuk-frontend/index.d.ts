/**
 * GOV.UK Frontend types based on v5.8.0
 * NB: this is incomplete! For example, no concrete components are included
 */

// eslint-disable-next-line max-classes-per-file
declare module 'govuk-frontend' {
  abstract class Component<Root extends HTMLElement = HTMLElement> {
    static checkSupport(): void

    static abstract moduleName: string

    static elementType: typeof HTMLElement

    protected constructor($root: Root)

    get $root(): Root

    checkInitialised(): void
  }

  abstract class ConfigurableComponent<
    Root extends HTMLElement = HTMLElement,
    Config = object,
  > extends Component<Root> {
    protected constructor($root: Root, config: Config)

    [Symbol.for('configOverride')](param: object): object

    get config(): Config
  }

  function isSupported(scope?: HTMLElement): boolean

  interface ErrorCallback {
    onError: (error: Error) => void
  }

  function initAll(config?: { onError?: ErrorCallback; scope?: HTMLElement } & Record<string, object>): void

  function createAll<T extends Component>(
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
