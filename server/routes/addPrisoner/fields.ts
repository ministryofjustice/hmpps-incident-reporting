const fields = {
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
        text: 'Please select one',
        selected: true,
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
        text: 'Please select one',
        selected: true,
      },
    ],
  },
  prisonerComment: {
    component: 'govukInput',
    id: 'prisonerComment',
    name: 'prisonerComment',
    classes: 'govuk-!-width-three-quarters',
    fieldset: {
      legend: {
        text: 'Any additional comment?',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    label: {
      text: 'Any additional comment?',
      classes: 'govuk-fieldset__legend--m',
    },
    autocomplete: 'off',
  },
}

export default fields
