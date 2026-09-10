import type FormWizard from 'hmpo-form-wizard'

import { types, isTypeActive, type TypeDetails, type Type } from '../../../reportConfiguration/constants'
import config from '../../../config'

export function typeFieldItems() {
  const isActive = ([typeCode]: [Type, TypeDetails]) => isTypeActive(typeCode) || config.incidentTypesOverride.has(typeCode)

  const byDescription = ([, { description: description1 }]: [Type, TypeDetails], [, { description: description2 }]: [Type, TypeDetails]) => {
    if (description1.startsWith('Miscellaneous')) {
      return 1
    }
    if (description2.startsWith('Miscellaneous')) {
      return -1
    }
    return description1 < description2 ? -1 : 1
  }

  const toFieldItem = ([code, details]: [Type, TypeDetails]) => ({
    label: details.description,
    value: code,
    hint: details.hint,
  })

  return (Object.entries(types) as [Type, TypeDetails][]).filter(isActive).sort(byDescription).map(toFieldItem)
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
