import type FormWizard from 'hmpo-form-wizard'

import { types, typeHints, type Type } from '../../../reportConfiguration/constants'

export const typeFields = {
  type: {
    label: 'Select the incident type',
    validate: ['required'],
    component: 'govukRadios',
    items: types
      .filter(type => type.active)
      .sort(({ code: code1 }, { code: code2 }) => {
        if (code1.startsWith('MISCELLANEOUS_')) {
          return 1
        }
        if (code2.startsWith('MISCELLANEOUS_')) {
          return -1
        }
        return code1 < code2 ? -1 : 1
      })
      .map(
        type =>
          ({
            label: type.description,
            value: type.code,
            hint: typeHints[type.code],
          }) satisfies FormWizard.FieldItem,
      ),
  },
} satisfies FormWizard.Fields
export type TypeValues = FormWizard.ValuesFromFields<typeof typeFields> & {
  type: Type
}

export const typeFieldNames = ['type'] as const satisfies (keyof typeof typeFields)[]
export type TypeFieldNames = (typeof typeFieldNames)[number]
