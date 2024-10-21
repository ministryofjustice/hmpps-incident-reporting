// eslint-disable-next-line max-classes-per-file
import type Express from 'express'

declare module 'hmpo-form-wizard' {
  import type { DefaultFormatter } from 'hmpo-form-wizard/lib/formatting'
  import type { DefaultValidator } from 'hmpo-form-wizard/lib/validation'
  import type { Local as LocalModel, LocalModelOptions } from 'hmpo-model'

  export function FormWizard<V extends object = FormWizard.Values>(
    steps: FormWizard.Steps<V>,
    fields: FormWizard.Fields<V>,
    config: FormWizard.Config<V>,
  ): Express.Router

  export namespace FormWizard {
    /** String submitted to a form field that does not allow multiple values */
    type Value = string | undefined

    /** String or strings submitted to a form field that allows multiple values */
    type MultiValue = Value | string[]

    /** Use in simple generic forms that do not allow multiple values in any fields; have no checkbox components */
    type Values = Record<string, Value>

    /** Use in complex generic forms that might allow multiple values in any fields; have checkbox components */
    type MultiValues = Record<string, MultiValue>

    /** Possible conditions for next steps */
    type NextStepCondition =
      | {
          /** field, op and value. op defaults to '===' */
          field: string
          op?: '>' | '>=' | '<' | '<=' | '==' | '===' | '!=' | 'before' | 'after' | 'in' | 'all' | 'some'
          value: Value
          next: string
        }
      | {
          /** an operator can be a function */
          field: string
          op: (fieldValue: Value, req: Request, res: Express.Response, con: unknown) => boolean
          value: Value
          next: string
        }
      | {
          /** next can be an array of conditions */
          field: string
          value: Value
          next: NextStep[]
        }
      | {
          /** a condition can be a function specified by fn */
          fn: (req: Request, res: Express.Response, con: unknown) => boolean
          next: string
        }
      | {
          /** a condition can be a controller method specified by name */
          fn: string
          next: string
        }
      | {
          /** the next option can be a function to return a dynamic next step */
          field: string
          value: Value
          next: (req: Request, res: Express.Response, con: unknown) => string
        }
      /** use a string as a default next step */
      | string

    type NextStep =
      /** next can be a relative string path */
      | string
      /** next can be an array of conditions */
      | NextStepCondition[]

    interface Step<V extends object = Values, K extends keyof V = keyof V> {
      /** The next step for each step can be a relative path, an external URL, or an array of conditional next steps. Each condition next step can contain a next location, a field name, operator and value, or a custom condition function */
      next?: NextStep
      /** A namespace identifier for the wizard. This is used to store wizard data on the session. This defaults to a unique value for a wizard. */
      name?: string
      /** A namespace identifier for the entire journey. This is used to store journey-wide data such as step history on the session. Defaults to "default". */
      journeyName?: string
      /** Allows a user to navigate to this step with no journey step history. Defaults to false. */
      entryPoint?: boolean
      /** Check if the session has expired. Defaults to true. */
      checkSession?: boolean
      /** Check if session has expired on entry points. Defaults to false */
      checkEntryPointSession?: boolean
      /** Check this step is allowed based on the journey step history. If this step is not allowed the user is redirected to the last allowed step, or an error is returned if no step is allowed. Defaults to true. */
      checkJourney?: boolean
      /** Set to false to disable cross-site request forgery protection */
      csrf?: boolean
      /** Reset the wizard sessionModel when this step is accessed. Defaults to false. */
      reset?: boolean
      /** Reset the journey journeyModel when this step is accessed. */
      resetJourney?: boolean
      /** A template is not rendered on a GET request. The post() lifecycle is called instead. Defaults to false. */
      skip?: boolean
      /** Only allow POST requests. The get method is set to null */
      noGet?: boolean
      /** Don't allow posting to this step. The post method is set to null and the step is completed if there is a next step */
      noPost?: boolean
      /** forward the query params when internally redirecting. Defaults to false. */
      forwardQuery?: boolean
      /** This step is editable. This allows accessing this step with the editSuffix and sets the back link and next step to the editBackStep. Defaults to false. */
      editable?: boolean
      /** Suffix to use for editing steps. Defaults to "/edit". */
      editSuffix?: string
      /** Location to return to after editing a step. Defaults to "confirm" */
      editBackStep?: string
      /** While editing, if the step marked with this is evaluated to be the next step, continue to editing it instead of returning to editBackStep. Defaults to false. */
      continueOnEdit?: boolean
      /** specifies which of the fields from the field definition list are applied to this step. Form inputs which are not named on this list will not be processed. Default: [] */
      fields?: readonly K[]
      /** Specifies the template to render for GET requests to this step. Defaults to the route (without trailing slash) */
      template?: string
      /** Provides the location within app.get('views') that templates are stored. */
      templatePath?: string
      /** Specifies the location of the step previous to this one. */
      backLink?: string
      /** Specifies valid referrers that can be used as a back link. If this or backLink are not specified then an algorithm is applied which checks the previously visited steps which have the current step set as next. */
      backLinks?: string[]
      /** The constructor for the controller to be used for this step's request handling. The default is exported as a Controller property of this module. If custom behaviour is required for a particular form step then custom extensions can be defined */
      controller?: typeof Controller<V, K>
      /** Additional fields that we be recorded as being part of this step's routing decision. Default: [] */
      decisionFields?: string[]
      /** Show this page instead of only recalculating the routing if this page is marked invalid. Default: false */
      revalidate?: boolean
      /** Show this page instead of only recalculating the routing if one of these values is changed. Default: [] */
      revalidateIf?: string[]
      /** provide a function for translating validation error codes into usable messages. Previous implementations have used i18next to do translations. */
      translate?: (string) => string
      /** Define express parameters for the route for supporting additional URL parameters. */
      params?: string
    }

    type Steps<V extends object = Values> = Record<string, Step<V, string>>

    interface Field {
      /** Name of the cross-wizard field storage name. To facilitate sharing form values between wizards in the same journey a field can be specified to save into the journeyModel instead of the sessionModel using the journeyKey property */
      journeyKey?: string
      /** A default value for a field can be specified with the default property. This is used if the value loaded from the session is missing or undefined. */
      default?: string
      /** Allow multiple incomming values for a field. The result is presented as an array */
      multiple?: boolean
      /** Array of formatter names for this field in addition to the default formatter set, or formatter objects */
      formatter?:
        | DefaultFormatter[]
        | (
            | {
                /** Formatter name */
                type: DefaultFormatter
                /** Array of formatter arguments, eg. { type: 'truncate', arguments: [24] } */
                arguments?: unknown[]
              }
            | {
                /** Formatter function */
                fn: Formatter
              }
          )[]

      /** Disables the default set of formatters for this field */
      ['ignore-defaults']?: boolean
      /** An array of validator names, or validator objects */
      validate?:
        | DefaultValidator[]
        | (
            | {
                /** Validator name */
                type: DefaultValidator
                /** Array of validator arguments, eg. { type: 'minlength', arguments: [24] } */
                arguments?: unknown[]
              }
            | {
                /** Custom validator name */
                type?: string
                /** Validator function */
                fn: Validator
              }
          )[]
      /** Array of select box or radio button options */
      items?: FieldItem[]
      /** Name of field to make this field conditional upon. This field will not be validated or stored if this condition is not met. Can also also be an object to specify a specific value instead of the default of true: */
      dependent?:
        | string
        | {
            /** Field name */
            field: string
            /** Field value */
            value: Value
          }
      /** an array of field names that will be 'invalidated' when this field value is set or changed. Any fields specified in the invalidates array will be removed from the sessionModel. Future steps that have used this value to make a branching decision will also be invalidated, making the user go through those steps and decisions again. */
      invalidates?: string[]
      /** localisation key to use for this field instead of the field name */
      contentKey?: string
    }

    interface FieldItem {
      /** Item value */
      value: Value
    }

    /** Definition of fields in a form across all steps */
    type Fields<V extends object = Values> = Record<keyof V, Field>

    /** Base configuration for all steps */
    interface Config<V extends object = Values> extends Step<V> {
      name?: string
    }

    interface Request<V extends object = Values, K extends keyof V = keyof V> extends Express.Request {
      isEditing: boolean
      journeyModel: JourneyModel<JourneyValues>
      sessionModel: WizardModel<
        V & {
          'csrf-secret': string
          errors?: Errors<K>
          errorValues?: Partial<Pick<V, K>>
        }
      >
      form: Form<V, K>
    }

    /** Represents form errors; does not extend native Error class */
    class Error {
      constructor(
        key: string | undefined | null,
        options: {
          key?: string
          errorGroup?: string
          field?: string
          type?: string
          redirect?: string
          message?: string
          headerMessage?: string
          arguments?: unknown
        } = {},
        req?: Request,
      )

      key: string

      errorGroup: string | undefined

      field: string | undefined

      type: 'default' | string

      redirect: string | undefined

      url: string | undefined

      message: string | undefined

      headerMessage: string | undefined

      args: { [type: string]: unknown }
    }

    /** Possible errors in one step */
    type Errors<K extends string = string> = Partial<Record<K, Error>>

    /** Configuration for a controller of one step */
    interface Options<V extends object = Values, K extends keyof V = keyof V> extends Step<V, K> {
      route: string
      steps: Steps<V>
      fields: Fields<Pick<V, K>>
      allFields?: Fields<V>
      defaultFormatters?: DefaultFormatter[]
    }

    interface Form<V extends object = Values, K extends keyof V = keyof V> {
      options: Options<V, K>
      values: Partial<Pick<V, K>>
      errors: Errors<K>
    }

    interface Callback<V extends object = Values> {
      (err?: Error | undefined, values?: V | undefined): void
    }

    interface Locals<V extends object = Values, K extends keyof V = keyof V> {
      errors: Errors<K>
      errorlist: Error[]
      values: V
      options: Options<V, K>
      action: string
      nextPage: Step<V>
      isEditing: boolean
      editSuffix: string
      baseUrl: Express.Request['baseUrl']
      backLink: string | undefined
      ['csrf-token']: string
    }

    /**
     * Base class which instantiates a request handler for each form step.
     * Generic parameter V is optional and specifies the types of all fields’ values across all steps;
     * the default allows only non-multiple values but does not specify which fields exist.
     * Generic parameter K specifies the keys of V which are used in this step only, defaulting to all of V.
     */
    abstract class BaseController<V extends object = Values, K extends keyof V = keyof V> {
      constructor(options: Options<V, K>)

      static Error: typeof Error

      options: Options<V, K>

      router: Express.Router

      middlewareSetup(): void

      middlewareChecks(): void

      middlewareActions(): void

      middlewareLocals(): void

      middlewareMixins(): void

      use(...requestHandlers: Express.RequestHandler[]): void

      useWithMethod(
        method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head',
        ...requestHandlers: Express.RequestHandler[]
      ): void

      requestHandler(): Express.Router

      rejectUnsupportedMethods(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      methodNotSupported(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      configure(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      get(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      post(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      getErrors(req: Request<V, K>, res: Express.Response): Errors<K>

      getValues(req: Request<V, K>, res: Express.Response, callback: Callback<V>): void

      locals(req: Request<V, K>, res: Express.Response, callback?: Callback<V>): Partial<Locals<V, K>>

      render(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      setErrors(err: Errors<K> | null, req: Request<V, K>, res: Express.Response): void

      process(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      validateFields(req: Request<V, K>, res: Express.Response, callback: Callback<V>): void

      validateField(key: K, req: Request<V, K>, res: Express.Response): Error | false | undefined

      validate(req: Request<Pick<V, K>>, res: Express.Response, next: Express.NextFunction): void

      saveValues(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      successHandler(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      isValidationError(err: unknown): err is Record<string, Error>

      errorHandler(
        err: Errors<K> | undefined,
        req: Request<V, K>,
        res: Express.Response,
        next: Express.NextFunction,
      ): void
    }

    /**
     * Class with various mixins which instantiates a request handler for each form step.
     * Generic parameter V is optional and specifies the types of all fields’ values across all steps;
     * the default allows only non-multiple values but does not specify which fields exist.
     * Generic parameter K specifies the keys of V which are used in this step only, defaulting to all of V.
     */
    class Controller<V extends object = Values, K extends keyof V = keyof V> extends BaseController<V, K> {
      static validators: Record<DefaultValidator, Validator>

      static formatters: Record<DefaultFormatter, Formatter>

      resolvePath(base: string, url: string, forceRelative: boolean): void

      setBaseUrlLocal(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      setTranslateEngine(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      createJourneyModel(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      createSessionModel(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      resetSessionModel(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      checkSession(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      checkJourneyProgress(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      checkProceedToNextStep(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      walkJourneyHistory(
        req: Request<V, K>,
        res: Express.Response,
        fn: (this: Controller, step: Step<V>, next: Step<V> | undefined) => boolean,
        stopAtInvalid: boolean = true,
        start: Step<V> | null = null,
      ): Step<V> | false

      completedJourneyStep(req: Request<V, K>, res: Express.Response, path: string): Step<V> | false

      allowedJourneyStep(req: Request<V, K>, res: Express.Response, path: string): Step<V> | false

      allowedPrereqStep(req: Request<V, K>, res: Express.Response, prereqs: string[]): Step<V> | false

      lastAllowedStep(req: Request<V, K>, res: Express.Response): Step<V> | false

      getJourneyFieldNames(
        req: Request<V, K>,
        res: Express.Response,
        fields: (keyof V)[],
        ignoreLocalFields = false,
        undefinedIfEmpty = false,
      ): string[] | undefined

      setStepComplete(req: Request<V, K>, res: Express.Response, path?: string): void

      addJourneyHistoryStep(req: Request<V, K>, res: Express.Response, step: Step<V>): void

      invalidateJourneyHistoryStep(req: Request<V, K>, res: Express.Response, path: string): void

      removeJourneyHistoryStep(req: Request<V, K>, res: Express.Response, path: string): void

      resetJourneyHistory(req: Request<V, K>, res: Express.Response): void

      csrfGenerateSecret(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      csrfCheckToken(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      csrfSetToken(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      checkJourneyInvalidations(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      invalidateFields(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      backlinksSetLocals(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      getBackLink(req: Request<V, K>, res: Express.Response): string | undefined

      decodeConditions(
        req: Request<V, K>,
        res: Express.Response,
        nextStep: NextStep,
      ): { condition: NextStep | null; fields: (keyof V)[]; url: string | null } | undefined

      getNextStepObject(req: Request<V, K>, res: Express.Response): ReturnType<Controller['decodeConditions']>

      getNextStep(req: Request<V, K>, res: Express.Response): string | undefined

      getErrorStep(err: Errors<K>, req: Request<V, K>, res: Express.Response): string | undefined

      editing(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      checkEditing(req: Request<V, K>, res: Express.Response, next: Express.NextFunction): void

      clearEditing(req: Request<V, K>, res: Express.Response): void
    }

    interface SessionModelOptions extends LocalModelOptions {
      /** req.session key */
      key: string
      req: Request | null
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    class SessionModel<V = Record<string, any>, Opts = SessionModelOptions> extends LocalModel<V, Opts> {
      getSessionData(): object

      /** On-change listener */
      updateSessionData(changes: object): void

      /** On-reset listener */
      resetSessionData(): void

      save(callback?: (err: unknown) => void): void

      reload(callback?: (err: unknown) => void): void

      destroy(): void
    }

    interface WizardModelOptions extends SessionModelOptions {
      fields: Fields
      journeyModel: JourneyModel
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    class WizardModel<V = Record<string, any>, Opts = WizardModelOptions> extends SessionModel<V, Opts> {
      getJourneyKeys(): string[]

      getDefaults(): Record<string, unknown>
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    class JourneyModel<V = Record<string, any>, Opts = SessionModelOptions> extends SessionModel<V, Opts> {
      currentModels: WizardModel[]

      registerModel(model: WizardModel): void
    }

    interface JourneyValues {
      'registered-models': string[]
      lastVisited: string
      history: {
        wizard: string
        path: string
        next?: string
        fields?: string[]
        formFields?: string[]
      }[]
    }

    interface FormattingContext {
      sessionModel: WizardModel
      fields: Fields
      values: Values
    }

    interface Formatter<ReturnType = string> {
      (this: FormattingContext, value: Value, ...arguments: unknown[]): ReturnType
    }

    interface ValidationContext {
      sessionModel: WizardModel
      fields: Fields
      values: Values
    }

    interface Validator {
      (this: ValidationContext, value: Value, ...args: unknown[]): boolean
    }
  }

  export default FormWizard
}

declare module 'hmpo-form-wizard/lib/formatting' {
  import type FormWizard from 'hmpo-form-wizard'

  export function format<T>(
    fields: FormWizard.Fields,
    key: string,
    value: FormWizard.MultiValue,
    defaultFormatters: Record<string, FormWizard.Formatter>,
    context: FormWizard.FormattingContext,
  ): T

  declare let formatters: {
    trim(value: FormWizard.Value): string | undefined
    boolean(value: FormWizard.Value): boolean | undefined
    uppercase(value: FormWizard.Value): string | undefined
    lowercase(value: FormWizard.Value): string | undefined
    removespaces(value: FormWizard.Value): string | undefined
    singlespaces(value: FormWizard.Value): string | undefined
    hyphens(value: FormWizard.Value): string | undefined
    apostrophes(value: FormWizard.Value): string | undefined
    quotes(value: FormWizard.Value): string | undefined
    removeroundbrackets(value: FormWizard.Value): string | undefined
    removehyphens(value: FormWizard.Value): string | undefined
    removeslashes(value: FormWizard.Value): string | undefined
    ukphoneprefix(value: FormWizard.Value): string | undefined
    base64decode(value: FormWizard.Value): string
  } // satisfies Record<string, FormWizard.Formatter>

  export type DefaultFormatter = keyof typeof formatters
}

declare module 'hmpo-form-wizard/lib/validation' {
  import type FormWizard from 'hmpo-form-wizard'

  export function isAllowedDependent(fields: FormWizard.Fields, key: string, values: FormWizard.MultiValues): boolean

  interface ValidationError {
    key: string
    errorGroup: string
    type: string
    arguments: unknown[]
  }

  export function validate(
    fields: FormWizard.Fields,
    key: string,
    value: FormWizard.MultiValue,
    context: FormWizard.ValidationContext,
  ): ValidationError | false

  declare let validators: {
    string(value: FormWizard.Value): boolean
    regex(value: FormWizard.Value, match: string | RegExp): boolean
    required(value: FormWizard.Value): boolean
    email(value: FormWizard.Value): boolean
    minlength(value: FormWizard.Value, length: number): boolean
    maxlength(value: FormWizard.Value, length: number): boolean
    exactlength(value: FormWizard.Value, length: number): boolean
    alpha(value: FormWizard.Value): boolean
    alphaex(value: FormWizard.Value): boolean
    alphaex1(value: FormWizard.Value): boolean
    alphanum(value: FormWizard.Value): boolean
    alphanumex(value: FormWizard.Value): boolean
    alphanumex1(value: FormWizard.Value): boolean
    numeric(value: FormWizard.Value): boolean
    equal(value: FormWizard.Value, ...allowedValues: unknown[]): boolean
    phonenumber(value: FormWizard.Value): boolean
    ukmobilephone(value: FormWizard.Value): boolean
    date(value: FormWizard.Value): boolean
    'date-year': (value: FormWizard.Value) => boolean
    'date-month': (value: FormWizard.Value) => boolean
    'date-day': (value: FormWizard.Value) => boolean
    before(value: FormWizard.Value, date: string): boolean
    before(value: FormWizard.Value, years: number): boolean
    before(value: FormWizard.Value, diff: number, unit: string): boolean
    after(value: FormWizard.Value, date: string): boolean
    after(value: FormWizard.Value, years: number): boolean
    after(value: FormWizard.Value, diff: number, unit: string): boolean
    postcode(value: FormWizard.Value): boolean
    match(
      this: FormWizard.ValidationContext,
      value: FormWizard.Value,
      fieldName: string,
      fromSession?: boolean, // = false (forbidden by esbuild 0.23.1)
    ): boolean
    beforeField(
      this: FormWizard.ValidationContext,
      value: FormWizard.Value,
      fieldName: string,
      fromSession?: boolean, // = false (forbidden by esbuild 0.23.1)
    ): boolean
    afterField(
      this: FormWizard.ValidationContext,
      value: FormWizard.Value,
      fieldName: string,
      fromSession?: boolean, // = false (forbidden by esbuild 0.23.1)
    ): boolean
  } // satisfies Record<string, FormWizard.Validator>

  export type DefaultValidator = keyof typeof validators
}
