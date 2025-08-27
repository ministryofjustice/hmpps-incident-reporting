import FormWizard from 'hmpo-form-wizard'

export const pecsRegionFields = {
  pecsRegion: {
    label: 'In which region did the incident happen?',
    validate: ['required'],
    component: 'govukRadios',
    items: <FormWizard.FieldItem[]>[
      // NB: PECS regions are lazy-loaded so choices cannot be built statically
    ],
  },
} satisfies FormWizard.Fields
export type PecsRegionValues = FormWizard.ValuesFromFields<typeof pecsRegionFields>

export const pecsRegionFieldNames = ['pecsRegion'] as const satisfies (keyof typeof pecsRegionFields)[]
export type PecsRegionFieldNames = (typeof pecsRegionFieldNames)[number]
