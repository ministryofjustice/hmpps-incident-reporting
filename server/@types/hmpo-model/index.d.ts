// eslint-disable-next-line max-classes-per-file
declare module 'hmpo-model/lib/local-model' {
  import type { EventEmitter } from 'node:events'

  interface SetOptions {
    silent?: boolean
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface LocalModelOptions {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export default class LocalModel<Values = any, Options = LocalModelOptions> extends EventEmitter {
    constructor(attributes?: Values | null, options?: Options)

    options: Options

    attributes: Values

    get<Key extends keyof Values>(key: Key): Values[Key]

    set<Key extends keyof Values>(key: Key, value: Values[Key], options?: SetOptions): this

    set(values: Partial<Values>, options?: SetOptions): this

    unset(fields: string | string[], options?: SetOptions): this

    reset(options?: SetOptions): void

    increment<Key extends keyof Values = string>(key: Key, amount?: number): this

    toJSON(bare = false): Values
  }
}

declare module 'hmpo-model/lib/remote-model' {
  import type LocalModel from 'hmpo-model/lib/local-model'
  import type { LocalModelOptions } from 'hmpo-model/lib/local-model'

  export interface RemoteModelOptions extends LocalModelOptions {
    label?: string
    url?: string
    // NB: many options omitted!
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export default class RemoteModel<Values = any, Options = RemoteModelOptions> extends LocalModel<Values, Options> {
    requestConfig<Config = object>(config: Config, args: object): Config & { url: string }
    // NB: many methods omitted!
  }
}

declare module 'hmpo-model' {
  import type LocalModel from 'hmpo-model/lib/local-model'
  import type RemoteModel from 'hmpo-model/lib/remote-model'

  export default RemoteModel
  export { LocalModel as Local, RemoteModel as Remote }
}
