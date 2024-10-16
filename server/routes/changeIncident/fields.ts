import type FormWizard from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  incidentDate: {
    component: 'mojDatePicker',
    id: 'incidentDate',
    name: 'incidentDate',
    validate: ['required'],
    label: 'On which date did the incident occur?',
    leadingZeros: 'true',
  },
  incidentTime: {
    component: 'govukInput',
    validate: ['required'],
    id: 'incidentTime',
    name: 'incidentTime',
    classes: 'govuk-input--width-5',
    label: 'At what time did the incident occur?',
    hint: {
      text: 'Please give time as the following example: 10:35',
    },
    autocomplete: 'off',
  },
  prisonId: {
    component: 'govukSelect',
    validate: ['required'],
    id: 'prisonId',
    name: 'prisonId',
    label: 'Prison where incident occurred',
    items: [
      {
        text: 'overwritten during runtime',
        value: 'overwritten during runtime',
      },
    ],
  },
  incidentTitle: {
    component: 'govukInput',
    validate: ['required'],
    id: 'incidentTitle',
    name: 'incidentTitle',
    classes: 'govuk-!-width-three-quarters',
    label: 'Title of incident',
    hint: {
      text: 'Please give a title that covers the subject of this incident.',
    },
    autocomplete: 'off',
  },
  incidentDescription: {
    component: 'govukTextarea',
    multiple: false,
    validate: ['required'],
    errorMessages: { required: 'A description is required for the incident in question.' },
    id: 'incidentDescription',
    name: 'incidentDescription',
    label: 'Please can you provide a description of the incident',
    rows: '8',
    fieldset: {
      legend: {
        text: 'Prison governor approval for change',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'Please provide as much detail as you can.',
    },
  },
  prisonersInvolved: {
    component: 'govukInput',
    multiple: true,
    validate: ['alphanum'],
    id: 'prisonersInvolved',
    name: 'prisonersInvolved',
    classes: 'govuk-input--width-20',
    label: 'Prisoners involved',
    hint: {
      text: 'Please list all prisoners involved in this incident.',
    },
    autocomplete: 'off',
  },
  staffInvolved: {
    component: 'govukInput',
    multiple: true,
    validate: ['alphanum'],
    id: 'staffInvolved',
    name: 'staffInvolved',
    classes: 'govuk-input--width-20',
    label: 'Staff involved',
    hint: {
      text: 'Please list all staff members involved in this incident.',
    },
    autocomplete: 'off',
  },
  policeInformed: {
    component: 'govukRadios',
    validate: ['required'],
    id: 'policeInformed',
    name: 'policeInformed',
    label: 'Have the police been informed?',
    fieldset: {
      legend: {
        text: 'Have the police been informed?',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: 'Select one option.',
    },
    items: [
      {
        text: 'Yes',
        value: 'yes',
        conditional: {
          html: 'set during setup',
        },
      },
      {
        value: 'no',
        text: 'No',
      },
    ],
  },
  policeInformedDate: {
    component: 'govukInput',
    id: 'policeInformedDate',
    name: 'policeInformedDate',
    classes: 'govuk-!-width-one-third',
    label: 'When were the police informed?',
    autocomplete: 'off',
    dependent: {
      field: 'policeInformed',
      value: 'yes',
    },
  },
}

export default fields
