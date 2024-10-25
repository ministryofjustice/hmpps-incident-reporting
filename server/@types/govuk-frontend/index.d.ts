declare module 'govuk-frontend' {
  abstract class Component<Root extends HTMLElement = HTMLElement> {
    static checkSupport(): void

    static abstract moduleName: string

    static elementType: HTMLElement

    protected constructor(root: Root)

    get $root(): Root

    checkInitialised(): void
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
