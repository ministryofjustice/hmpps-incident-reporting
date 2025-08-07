import type FormWizard from 'hmpo-form-wizard'

import type { Values } from './fields'

export const steps: FormWizard.Steps<Values> = {
  '/': {
    entryPoint: true,
    fields: ['q', 'page'],
  },
}
