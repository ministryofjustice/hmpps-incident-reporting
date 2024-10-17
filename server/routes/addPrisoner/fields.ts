import type FormWizard from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  prisonerRole: {
    component: 'govukRadios',
    validate: ['required'],
    errorMessages: { required: "Select the person's role in this incident." },
    id: 'prisonerRole',
    name: 'prisonerRole',
    fieldset: {
      legend: {
        text: "What was this person's role in the incident?",
        classes: 'govuk-fieldset__legend--m',
      },
    },
    items: [
      {
        text: 'overwritten during runtime',
        value: 'overwritten during runtime',
      },
    ],
  },
  prisonerOutcome: {
    component: 'govukRadios',
    id: 'prisonerOutcome',
    name: 'prisonerOutcome',
    fieldset: {
      legend: {
        text: 'What was the outcome for this prisoner?',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    items: [
      {
        text: 'overwritten during runtime',
        value: 'overwritten during runtime',
      },
    ],
  },
  prisonerComment: {
    component: 'govukInput',
    id: 'prisonerComment',
    name: 'prisonerComment',
    fieldset: {
      legend: {
        text: 'Any additional comment?',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    label: 'Any additional comment?',
    autocomplete: 'off',
  },
}

export default fields
