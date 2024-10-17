import type FormWizard from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  prisonerRole: {
    component: 'govukRadios',
    validate: ['required'],
    errorMessages: { required: "Select the person's role in this incident." },
    id: 'prisonerRole',
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
    id: 'prisonerOutcome',
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
    id: 'prisonerComment',
    name: 'prisonerComment',
    label: 'Any additional comment?',
    autocomplete: 'off',
  },
}

export default fields
