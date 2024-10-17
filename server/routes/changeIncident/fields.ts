import type FormWizard from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  incidentDate: {
    component: 'mojDatePicker',
    id: 'incidentDate',
    name: 'incidentDate',
    validate: ['required'],
    label: 'On which date did the incident occur?',
  },
  incidentTime: {
    component: 'govukInput',
    validate: ['required'],
    id: 'incidentTime',
    name: 'incidentTime',
    label: 'At what time did the incident occur?',
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
        label: 'overwritten during runtime',
        value: 'overwritten during runtime',
      },
    ],
  },
  incidentTitle: {
    component: 'govukInput',
    validate: ['required'],
    id: 'incidentTitle',
    name: 'incidentTitle',
    label: 'Title of incident',
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
  },
  prisonersInvolved: {
    component: 'govukInput',
    multiple: true,
    validate: ['alphanum'],
    id: 'prisonersInvolved',
    name: 'prisonersInvolved',
    label: 'Prisoners involved',
    autocomplete: 'off',
  },
  staffInvolved: {
    component: 'govukInput',
    multiple: true,
    validate: ['alphanum'],
    id: 'staffInvolved',
    name: 'staffInvolved',
    label: 'Staff involved',
    autocomplete: 'off',
  },
  policeInformed: {
    component: 'govukRadios',
    validate: ['required'],
    id: 'policeInformed',
    name: 'policeInformed',
    label: 'Have the police been informed?',
    items: [
      {
        label: 'Yes',
        value: 'yes',
        conditional: {
          html: 'set during setup',
        },
      },
      {
        value: 'no',
        label: 'No',
      },
    ],
  },
  policeInformedDate: {
    component: 'govukInput',
    id: 'policeInformedDate',
    name: 'policeInformedDate',
    label: 'When were the police informed?',
    autocomplete: 'off',
    dependent: {
      field: 'policeInformed',
      value: 'yes',
    },
  },
}

export default fields
