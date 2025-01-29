/**
 * GOV.UK Frontend types based on v5.8.0
 * NB: this was recreated manually from javascript sources and remains incomplete!
 * For example, no concrete component classes are included.
 */

// eslint-disable-next-line max-classes-per-file
declare module 'govuk-frontend/dist/govuk/govuk-frontend-component' {
  export abstract class GOVUKFrontendComponent<
    RootElementType extends Element & { dataset: DOMStringMap } = HTMLElement,
  > {
    static checkSupport(): void

    static abstract moduleName: string

    static elementType: new () => RootElementType = HTMLElement

    protected constructor($root: RootElementType)

    get $root(): RootElementType

    checkInitialised(): void
  }
}

declare module 'govuk-frontend/dist/govuk/common/configuration' {
  import type { GOVUKFrontendComponent } from 'govuk-frontend/dist/govuk/govuk-frontend-component'

  export const configOverride: unique symbol

  interface SchemaProperty {
    type: 'string' | 'boolean' | 'number' | 'object'
  }

  interface Schema {
    properties: Record<string, SchemaProperty | undefined>
    anyOf?: { required: string[]; errorMessage: string }[]
  }

  type ObjectNested = Record<string, string | boolean | number | ObjectNested | undefined>

  export abstract class ConfigurableComponent<
    RootElementType extends Element & { dataset: DOMStringMap } = HTMLElement,
    Config extends ObjectNested = Record<string, never>,
  > extends GOVUKFrontendComponent<RootElementType> {
    static abstract schema: Schema

    static abstract defaults: Config

    protected constructor($root: RootElementType, config?: Config)

    [configOverride](param: Config): object

    get config(): Config
  }

  export function normaliseString(value: string, property?: SchemaProperty): string | boolean | number | undefined

  export function normaliseDataset(Component: typeof ConfigurableComponent, dataset: DOMStringMap): ObjectNested

  export function mergeConfigs(...configObjects: Record<string, unknown>[]): Record<string, unknown>

  export function validateConfig(schema: Schema, config: Record<string, unknown>): string[]

  export function extractConfigByNamespace(
    schema: Schema,
    dataset: DOMStringMap,
    namespace: string,
  ): ObjectNested | undefined
}

declare module 'govuk-frontend' {
  // eslint-disable-next-line import/no-unresolved
  export { GOVUKFrontendComponent as Component } from 'govuk-frontend/dist/govuk/govuk-frontend-component'
  // eslint-disable-next-line import/no-unresolved
  export { ConfigurableComponent } from 'govuk-frontend/dist/govuk/common/configuration'

  export function isSupported(scope?: HTMLElement): boolean

  interface ErrorCallback {
    onError: (error: Error) => void
  }

  export function initAll(config?: { onError?: ErrorCallback; scope?: HTMLElement } & Record<string, object>): void

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
