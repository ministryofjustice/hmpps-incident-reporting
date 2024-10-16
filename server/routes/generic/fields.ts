import type FormWizard from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  incidentType: {
    component: 'govukRadios',
    validate: ['required'],
    id: 'incidentType',
    name: 'incidentType',
    label: 'Incident type',
    items: [
      {
        value: 'ABSCOND',
        text: 'Abscond',
      },
      {
        value: 'ASSAULT',
        text: 'Assault',
        hint: {
          text: 'Includes fights and suspected assaults.',
        },
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_COURT',
        text: 'Attempted escape from escort',
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_ESTABLISHMENT',
        text: 'Attempted escape from establishment',
      },
      {
        value: 'BOMB',
        text: 'Bomb explosion or threat',
      },
      {
        value: 'BREACH',
        text: 'Breach or attempted breach of security',
      },
      {
        value: 'CLOSE_DOWN_SEARCH',
        text: 'Close down search',
        hint: {
          text: 'Any finds must be reported using the Find type.',
        },
      },
      {
        value: 'DEATH_OF_OTHER_PERSON',
        text: 'Death of other person',
      },
      {
        value: 'DEATH_OF_PRISONER',
        text: 'Death of prisoner',
      },
      {
        value: 'DELIBERATE_DAMAGE',
        text: 'Deliberate damage to prison property (being removed Sept TBC)',
      },
      {
        value: 'DISORDER',
        text: 'Disorder',
        hint: {
          text: 'Includes barricade, concerted indiscipline, hostage, and incident at height.',
        },
      },
      {
        value: 'DRONE_SIGHTING',
        text: 'Drone sighting',
        hint: {
          text: 'Drones must have been seen by staff.',
        },
      },
      {
        value: 'ESCAPE_FROM_COURT',
        text: 'Escape from escort',
      },
      {
        value: 'ESCAPE_FROM_ESTABLISHMENT',
        text: 'Escape from establishment',
      },
      {
        value: 'FIND_OF_ILLICIT_ITEMS',
        text: 'Find of illicit items',
        hint: {
          text: 'Items must be recovered, not just seen.',
        },
      },
      {
        value: 'FIRE',
        text: 'Fire',
      },
      {
        value: 'FOOD_OR_LIQUID_REFUSAL',
        text: 'Food or liquid refusual',
      },
      {
        value: 'KEY_OR_LOCK_COMPROMISE',
        text: 'Key or lock compromise',
      },
      {
        value: 'MISCELLANEOUS',
        text: 'Miscellaneous',
        hint: {
          text: 'Includes dirty protest, failure of IT or telephony, large scale evacuation, late release or unlawful detention, loss of essential services, public demonstration, secondary exposure to airborne contaminants and any other incident not listed.',
        },
      },
      {
        value: 'RADIO_COMPROMISE',
        text: 'Radio compromise',
      },
      {
        value: 'RELEASE_IN_ERROR',
        text: 'Release in error',
      },
      {
        value: 'SELF_HARM',
        text: 'Self harm',
        hint: {
          text: 'Includes suspected and reported self-harm. Do not use to report a noose, unless it’s around the neck or applying pressure.',
        },
      },
      {
        value: 'TEMPORARY_RELEASE_FAILURE',
        text: 'Temporary release failure',
      },
      {
        value: 'TOOL_OR_IMPLEMENT_LOSS',
        text: 'Tool or implement loss',
        hint: {
          text: 'Do not use for radio and key or lock compromises. They are separate incident types.',
        },
      },
    ],
  },
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
  staffType: {
    component: 'govukRadios',
    validate: ['required'],
    id: 'staffType',
    name: 'staffType',
    label: 'What type of staff is [person name]',
    items: [
      {
        value: 'NON-DIRECTLY',
        text: 'Non-directly employed staff',
      },
      {
        value: 'NON-OPERATIONAL',
        text: 'Non-operational staff',
      },
      {
        value: 'PRISON_OFFICER',
        text: 'Prison officer',
      },
      {
        value: 'OTHER_OPERATIONAL_STAFF',
        text: 'Other operational staff',
      },
    ],
  },
  policeInformed: {
    component: 'govukRadios',
    classes: 'govuk-radios--inline',
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
  seriousInjuries: {
    component: 'govukCheckboxes',
    fieldset: {
      legend: {
        text: 'Select any serious injuries',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    validate: ['required'],
    id: 'seriousInjuries',
    name: 'seriousInjuries',
    label: 'Select any serious injuries',
    items: [
      {
        value: 'ABSCOND',
        text: 'Bite - skin broken',
      },
      {
        value: 'ASSAULT',
        text: 'Black eye',
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_COURT',
        text: 'Blindness - temporary or permanent',
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_ESTABLISHMENT',
        text: 'Broken nose',
      },
      {
        value: 'BOMB',
        text: 'Broken teeth',
      },
      {
        value: 'BREACH',
        text: 'Bruising - extensive or multiple',
      },
      {
        value: 'CLOSE_DOWN_SEARCH',
        text: 'Burn or scald',
      },
      {
        value: 'DEATH_OF_OTHER_PERSON',
        text: 'Crushing',
      },
      {
        value: 'DEATH_OF_PRISONER',
        text: 'Cut requiring sutures',
      },
      {
        value: 'DELIBERATE_DAMAGE',
        text: 'Deafness - temporary or permanent',
      },
      {
        value: 'DISORDER',
        text: 'Fracture',
      },
      {
        value: 'DRONE_SIGHTING',
        text: 'Gunshot wound',
      },
      {
        value: 'ESCAPE_FROM_COURT',
        text: 'Stabbing',
      },
      {
        value: 'or',
        text: 'or',
        divider: 'or',
      },
      {
        value: 'ESCAPE_FROM_ESTABLISHMENT',
        text: 'No serious injuries',
        behaviour: 'exclusive',
      },
    ],
  },
  minorInjuries: {
    component: 'govukCheckboxes',
    fieldset: {
      legend: {
        text: 'Select any minor injuries',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    validate: ['required'],
    id: 'minorInjuries',
    name: 'minorInjuries',
    label: 'Select any minor injuries',
    items: [
      {
        value: 'ABSCOND',
        text: 'Bruising - minor',
      },
      {
        value: 'ASSAULT',
        text: 'Cut - superficial',
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_COURT',
        text: 'Graze, scratch or abrasion',
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_ESTABLISHMENT',
        text: 'Swelling',
      },
      {
        value: 'BOMB',
        text: 'Other',
      },
      {
        value: 'or',
        text: 'or',
        divider: 'or',
      },
      {
        value: 'ESCAPE_FROM_ESTABLISHMENT',
        text: 'No minor injuries',
        behaviour: 'exclusive',
      },
    ],
  },
  medicalTreatment: {
    component: 'govukRadios',
    fieldset: {
      legend: {
        text: 'Did they need medical treatment for concussion or internal injuries?',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    validate: ['required'],
    id: 'medicalTreatment',
    name: 'medicalTreatment',
    label: 'Did they need medical treatment for concussion or internal injuries?',
    items: [
      {
        value: 'YES',
        text: 'Yes',
      },
      {
        value: 'NO',
        text: 'No',
      },
      {
        value: 'UNKNOWN',
        text: 'Unknown',
      },
    ],
  },
  outsideHospital: {
    component: 'govukRadios',
    fieldset: {
      legend: {
        text: 'Did they go to outside hospital as a result of their injuries?',
        classes: 'govuk-fieldset__legend--m',
      },
    },
    validate: ['required'],
    id: 'outsideHospital',
    name: 'outsideHospital',
    label: 'Did they go to outside hospital as a result of their injuries?',
    items: [
      {
        value: 'YES',
        text: 'Yes',
      },
      {
        value: 'NO',
        text: 'No',
      },
      {
        value: 'UNKNOWN',
        text: 'Unknown',
      },
    ],
  },
}

export default fields
