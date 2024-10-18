import type FormWizard from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  incidentType: {
    component: 'govukSelect',
    validate: ['required'],
    name: 'incidentType',
    label: 'Incident type',
    items: [
      {
        value: 'ASSAULT',
        label: 'Assault',
      },
      {
        value: 'ABSCONDER',
        label: 'Absconder',
      },
    ],
  },
  incidentDate: {
    component: 'mojDatePicker',
    name: 'incidentDate',
    validate: ['required'],
    label: 'On which date did the incident occur?',
  },
  incidentTime: {
    component: 'govukInput',
    validate: ['required'],
    name: 'incidentTime',
    label: 'At what time did the incident occur?',
    autocomplete: 'off',
  },
  prisonId: {
    component: 'govukSelect',
    validate: ['required'],
    name: 'prisonId',
    label: 'Prison where incident occurred',
    items: [
      {
        label: 'Please select one',
        value: 'select',
      },
    ],
  },
  incidentTitle: {
    component: 'govukInput',
    validate: ['required'],
    name: 'incidentTitle',
    label: 'Title of incident',
    autocomplete: 'off',
  },
  incidentDescription: {
    component: 'govukTextarea',
    multiple: false,
    validate: ['required'],
    errorMessages: { required: 'A description is required for the incident in question.' },
    name: 'incidentDescription',
    label: 'Please can you provide a description of the incident',
    rows: '8',
  },
  prisonersInvolved: {
    component: 'govukInput',
    multiple: true,
    validate: ['alphanum'],
    name: 'prisonersInvolved',
    label: 'Prisoners involved',
    autocomplete: 'off',
  },
  staffInvolved: {
    component: 'govukInput',
    multiple: true,
    validate: ['alphanum'],
    name: 'staffInvolved',
    label: 'Staff involved',
    autocomplete: 'off',
  },
  policeInformed: {
    component: 'govukRadios',
    validate: ['required'],
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
