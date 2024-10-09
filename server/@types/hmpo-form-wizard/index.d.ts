// eslint-disable-next-line max-classes-per-file
import type Express from 'express'

declare module 'hmpo-form-wizard' {
  import type { DefaultFormatter } from 'hmpo-form-wizard/lib/formatting'
  import type { DefaultValidator } from 'hmpo-form-wizard/lib/validation'
  import type { Local as LocalModel, LocalModelOptions } from 'hmpo-model'

  export function FormWizard(
    steps: FormWizard.Steps,
    fields: FormWizard.Fields,
    config: FormWizard.Config,
  ): Express.Router

  export namespace FormWizard {
    type NextStep =
      /** next can be a relative string path */
      | string
      /** next can be an array of conditions */
      | (
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
        )[]

    interface Step {
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
      fields?: string[]
      /** Specifies the template to render for GET requests to this step. Defaults to the route (without trailing slash) */
      template?: string
      /** Provides the location within app.get('views') that templates are stored. */
      templatePath?: string
      /** Specifies the location of the step previous to this one. */
      backLink?: string
      /** Specifies valid referrers that can be used as a back link. If this or backLink are not specified then an algorithm is applied which checks the previously visited steps which have the current step set as next. */
      backLinks?: string[]
      /** The constructor for the controller to be used for this step's request handling. The default is exported as a Controller property of this module. If custom behaviour is required for a particular form step then custom extensions can be defined */
      controller?: typeof Controller
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

    interface Steps {
      [path: string]: Step
    }

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

    interface Fields {
      [name: string]: Field
    }

    interface Config extends Step {
      name?: string
    }

    interface Request extends Express.Request {
      isEditing: boolean
      journeyModel: JourneyModel
      sessionModel: WizardModel
      form: Form
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

    interface Options extends Step {
      route: string
      steps: Steps
      fields: Fields
      allFields: Fields
      defaultFormatters: DefaultFormatter[]
    }

    interface Form {
      options: Options
      values: Values
      errors: Record<string, Error>
    }

    interface Callback {
      (err?: Error | undefined, values?: Values | undefined): void
    }

    interface Locals {
      errors: Record<string, Error>
      errorlist: Error[]
      values: Values
      options: Options
      action: string
      nextPage: Step
      isEditing: boolean
      editSuffix: string
      baseUrl: Request['baseUrl']
      backLink: string | undefined
      ['csrf-token']: string
    }

    /**
     * Base class which instantiates a request handler for each form step
     */
    abstract class BaseController {
      constructor(options: Options)

      static Error: typeof Error

      options: Options

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

      rejectUnsupportedMethods(req: Request, res: Express.Response, next: Express.NextFunction): void

      methodNotSupported(req: Request, res: Express.Response, next: Express.NextFunction): void

      configure(req: Request, res: Express.Response, next: Express.NextFunction): void

      get(req: Request, res: Express.Response, next: Express.NextFunction): void

      post(req: Request, res: Express.Response, next: Express.NextFunction): void

      getErrors(req: Request, res: Express.Response): Record<string, Error>

      getValues(req: Request, res: Express.Response, callback: Callback): void

      locals(req: Request, res: Express.Response, callback?: Callback): Partial<Locals>

      render(req: Request, res: Express.Response, next: Express.NextFunction): void

      setErrors(err: Record<string, Error>, req: Request, res: Express.Response): void

      process(req: Request, res: Express.Response, next: Express.NextFunction): void

      validateFields(req: Request, res: Express.Response, callback: Callback): void

      validateField(key: string, req: Request, res: Express.Response): Error | false | undefined

      validate(req: Request, res: Express.Response, next: Express.NextFunction): void

      saveValues(req: Request, res: Express.Response, next: Express.NextFunction): void

      successHandler(req: Request, res: Express.Response, next: Express.NextFunction): void

      isValidationError(err: unknown): err is Error

      errorHandler(err: Error, req: Request, res: Express.Response, next: Express.NextFunction): void
    }

    /**
     * Class with various mixins which instantiates a request handler for each form step
     */
    class Controller extends BaseController {
      validators: Record<string, Validator>

      formatters: Record<string, Formatter>

      resolvePath(base: string, url: string, forceRelative: boolean): void

      setBaseUrlLocal(req: Request, res: Express.Response, next: Express.NextFunction): void

      setTranslateEngine(req: Request, res: Express.Response, next: Express.NextFunction): void

      createJourneyModel(req: Request, res: Express.Response, next: Express.NextFunction): void

      createSessionModel(req: Request, res: Express.Response, next: Express.NextFunction): void

      resetSessionModel(req: Request, res: Express.Response, next: Express.NextFunction): void

      checkSession(req: Request, res: Express.Response, next: Express.NextFunction): void

      checkJourneyProgress(req: Request, res: Express.Response, next: Express.NextFunction): void

      checkProceedToNextStep(req: Request, res: Express.Response, next: Express.NextFunction): void

      walkJourneyHistory(
        req: Request,
        res: Express.Response,
        fn: (this: Controller, step: Step, next: Step | undefined) => boolean,
        stopAtInvalid: boolean = true,
        start: Step | null = null,
      ): Step | false

      completedJourneyStep(req: Request, res: Express.Response, path: string): Step | false

      allowedJourneyStep(req: Request, res: Express.Response, path: string): Step | false

      allowedPrereqStep(req: Request, res: Express.Response, prereqs: string[]): Step | false

      lastAllowedStep(req: Request, res: Express.Response): Step | false

      getJourneyFieldNames(
        req: Request,
        res: Express.Response,
        fields: string[],
        ignoreLocalFields = false,
        undefinedIfEmpty = false,
      )

      setStepComplete(req: Request, res: Express.Response, path: string): void

      addJourneyHistoryStep(req: Request, res: Express.Response, step: Step): void

      invalidateJourneyHistoryStep(req: Request, res: Express.Response, path: string): void

      removeJourneyHistoryStep(req: Request, res: Express.Response, path: string): void

      resetJourneyHistory(req: Request, res: Express.Response): void

      csrfGenerateSecret(req: Request, res: Express.Response, next: Express.NextFunction): void

      csrfGenerateSecret(req: Request, res: Express.Response, next: Express.NextFunction): void

      csrfSetToken(req: Request, res: Express.Response, next: Express.NextFunction): void

      checkJourneyInvalidations(req: Request, res: Express.Response, next: Express.NextFunction): void

      invalidateFields(req: Request, res: Express.Response, next: Express.NextFunction): void

      backlinksSetLocals(req: Request, res: Express.Response, next: Express.NextFunction): void

      backlinksSetLocals(req: Request, res: Express.Response): string | undefined

      decodeConditions(
        req: Request,
        res: Express.Response,
        nextStep: NextStep,
      ): { condition: NextStep | null; fields: string[]; url: string | null } | undefined

      getNextStepObject(req: Request, res: Express.Response): ReturnType<Controller['decodeConditions']>

      getNextStep(req: Request, res: Express.Response): string | undefined

      getErrorStep(err: Error, req: Request, res: Express.Response): string | undefined

      editing(req: Request, res: Express.Response, next: Express.NextFunction): void

      checkEditing(req: Request, res: Express.Response, next: Express.NextFunction): void

      clearEditing(req: Request, res: Express.Response): void

      getBackLink(req: Request, res: Express.Response): string | undefined
    }

    interface SessionModelOptions extends LocalModelOptions {
      /** req.session key */
      key: string
      req: Request | null
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    class SessionModel<Values = any, Opts = SessionModelOptions> extends LocalModel<Values, Opts> {
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
    class WizardModel<Values = any, Opts = WizardModelOptions> extends SessionModel<Values, Opts> {
      getJourneyKeys(): string[]

      getDefaults(): Record<string, unknown>
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    class JourneyModel<Values = any, Opts = SessionModelOptions> extends SessionModel<Values, Opts> {
      currentModels: WizardModel[]

      registerModel(model: WizardModel): void
    }

    /** A form value as submitted to the wizard */
    // TODO: this can be string[]; can it be anything else??
    type Value = string | undefined

    /** A form as submitted to the wizard; typically req.body */
    interface Values {
      [field: string]: Value
    }

    interface FormattingContext {
      sessionModel: SessionModel
      fields: Fields
      values: Values
    }

    interface Formatter<ReturnType = string> {
      (this: FormattingContext, value: Value, ...arguments: unknown[]): ReturnType
    }

    interface ValidationContext {
      sessionModel: SessionModel
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
  import FormWizard from 'hmpo-form-wizard'

  export function format<T>(
    fields: FormWizard.Fields,
    key: string,
    value: FormWizard.Value,
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

  type DefaultFormatter = keyof typeof formatters
}

declare module 'hmpo-form-wizard/lib/validation' {
  import FormWizard from 'hmpo-form-wizard'

  export function isAllowedDependent(fields: FormWizard.Fields, key: string, values: FormWizard.Values): boolean

  interface ValidationError {
    key: string
    errorGroup: string
    type: string
    arguments: unknown[]
  }

  export function validate(
    fields: FormWizard.Fields,
    key: string,
    value: FormWizard.Value,
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

  type DefaultValidator = keyof typeof validators
}
