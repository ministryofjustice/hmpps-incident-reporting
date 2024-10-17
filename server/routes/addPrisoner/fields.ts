import type FormWizard from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  prisonerRole: {
    component: 'govukRadios',
    validate: ['required'],
    errorMessages: { required: "Select the person's role in this incident." },
    name: 'prisonerRole',
    items: [
      {
        label: 'overwritten during runtime',
        value: 'overwritten during runtime',
      },
    ],
  },
  prisonerOutcome: {
    component: 'govukRadios',
    name: 'prisonerOutcome',
    items: [
      {
        label: 'overwritten during runtime',
        value: 'overwritten during runtime',
      },
    ],
  },
  prisonerComment: {
    component: 'govukInput',
    name: 'prisonerComment',
    label: 'Any additional comment?',
    autocomplete: 'off',
  },
}

export default fields
