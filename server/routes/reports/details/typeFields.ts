import type FormWizard from 'hmpo-form-wizard'

import { types, typeHints, isTypeActive, type TypeDetails, type Type } from '../../../reportConfiguration/constants'
import config from '../../../config'

export function typeFieldItems() {
  const isActive = (type: TypeDetails) => isTypeActive(type.code) || config.incidentTypesOverride.has(type.code)

  const byDescription = ({ description: description1 }: TypeDetails, { description: description2 }: TypeDetails) => {
    if (description1.startsWith('Miscellaneous')) {
      return 1
    }
    if (description2.startsWith('Miscellaneous')) {
      return -1
    }
    return description1 < description2 ? -1 : 1
  }

  const toFieldItem = (type: TypeDetails) => ({
    label: type.description,
    value: type.code,
    hint: typeHints[type.code],
  })

  return types.filter(isActive).sort(byDescription).map(toFieldItem)
}

export const typeFields = {
  type: {
    label: 'Select the incident type',
    validate: ['required'],
    component: 'govukRadios',
    items: typeFieldItems(),
  },
} satisfies FormWizard.Fields
export type TypeValues = FormWizard.ValuesFromFields<typeof typeFields> & {
  type: Type
}

export const typeFieldNames = ['type'] as const satisfies (keyof typeof typeFields)[]
export type TypeFieldNames = (typeof typeFieldNames)[number]
