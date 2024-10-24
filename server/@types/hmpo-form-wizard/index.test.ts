/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-function */

// eslint-disable-next-line max-classes-per-file
import type Express from 'express'
import FormWizard from 'hmpo-form-wizard'

// NB: fields defition must not have a type annotation! but it's helpful to ensure it satisfies the fields requirement
const fields = {
  name: {},
  emails: { multiple: true },
} satisfies FormWizard.Fields

// the type of values handled by the form wizard can be derived
type Values = FormWizard.ValuesFromFields<typeof fields>

it('Deriving controller values type', () => {
  // controller for a step which only deals with the `name` field (not `emails`)
  class TypedController1 extends FormWizard.Controller<Values, 'name'> {
    saveValues(req: FormWizard.Request<Values, 'name'>, res: Express.Response, next: Express.NextFunction): void {
      // `name` exists in this step as derived by FormWizard.ValuesFromFields
      // `name` must be a string value otherwise the next line would fail type checking
      mustBeString(req.form.values.name)

      // `emails` cannot exist on this step so expect an error
      // @ts-expect-error if `emails` existed, the next line would fail type checking
      mustNotExist(req.form.values.emails)

      super.saveValues(req, res, next)
    }
  }

  // controller for a step which only deals with the `emails` field (not `name`)
  class TypedController2 extends FormWizard.Controller<Values, 'emails'> {
    saveValues(req: FormWizard.Request<Values, 'emails'>, res: Express.Response, next: Express.NextFunction): void {
      // `emails` exists in this step as derived by FormWizard.ValuesFromFields
      // `emails` must be a string array value otherwise the next line would fail type checking
      mustBeStringArray(req.form.values.emails)

      // `name` cannot exist on this step so expect an error
      // @ts-expect-error if `name` existed, the next line would fail type checking
      mustNotExist(req.form.values.name)

      super.saveValues(req, res, next)
    }
  }

  function mustBeString(_value: string): void {}

  function mustBeStringArray(_values: string[]): void {}

  function mustNotExist(_nothing: never): void {}
})
