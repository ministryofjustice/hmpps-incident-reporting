const fields = {
  incidentType:{
    component: 'govukSelect',
    validate: ['required'],
    id: 'incidentType',
    name: 'incidentType',
    label: {
      text: 'Incident type',
      classes: 'govuk-fieldset__legend--m',
    },
    items: [
      {
        text: 'Please select one',
        selected: true
      },
      {
        value: 'ASSAULT',
        text: 'Assault'
      },
      {
        value: 'ABSCONDER',
        text: 'Absconder'
      }
    ]
  },
  incidentDate: {
    component: 'mojDatePicker',
    id: 'incidentDate',
    name: 'incidentDate',
    validate: ['required'],
    label: {
      text: 'On which date did the incident occur?',
      classes: 'govuk-fieldset__legend--m',
    },
    leadingZeros: 1,
  },
  incidentTime: {
    component: 'govukInput',
    validate: ['required'],
    id: 'incidentTime',
    name: 'incidentTime',
    classes: 'govuk-input--width-5',
    label: {
      text: 'At what time did the incident occur?',
      classes: 'govuk-fieldset__legend--m',
    },
    hint: {
      text: 'Please give time as the following example: 10:35',
    },
    autocomplete: 'off',
  },
  prisonId:{
    component: 'govukSelect',
    validate: ['required'],
    id: 'prisonId',
    name: 'prisonId',
    label: {
      text: 'Prison where incident occurred',
      classes: 'govuk-fieldset__legend--m',
    },
    items: [
      {
        text: 'Please select one',
        selected: true
      },
    ]
  },
  incidentTitle: {
    component: 'govukInput',
    validate: ['required'],
    id: 'incidentTitle',
    name: 'incidentTitle',
    classes: 'govuk-!-width-three-quarters',
    label: {
      text: 'Title of incident',
      classes: 'govuk-fieldset__legend--m',
    },
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
    label: {
      text: 'Please can you provide a description of the incident',
      classes: 'govuk-fieldset__legend--m',
    },
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
    label: {
      text: 'Prisoners involved',
      classes: 'govuk-fieldset__legend--m',
    },
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
    label: {
      text: 'Staff involved',
      classes: 'govuk-fieldset__legend--m',
    },
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
    label: {
      text: 'Have the police been informed?',
      classes: 'govuk-fieldset__legend--m',
    },
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
          html: 'set during setup'
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
    classes: "govuk-!-width-one-third",
    label: {
      text: 'When were the police informed?',
      classes: 'govuk-fieldset__legend--m',
    },
    autocomplete: 'off',
    dependent: {
      field: 'policeInformed',
      value: 'yes',
    },
  },
}

export default fields
