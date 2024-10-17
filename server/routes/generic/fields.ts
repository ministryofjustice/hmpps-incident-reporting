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
        label: 'Abscond',
      },
      {
        value: 'ASSAULT',
        label: 'Assault',
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_COURT',
        label: 'Attempted escape from escort',
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_ESTABLISHMENT',
        label: 'Attempted escape from establishment',
      },
      {
        value: 'BOMB',
        label: 'Bomb explosion or threat',
      },
      {
        value: 'BREACH',
        label: 'Breach or attempted breach of security',
      },
      {
        value: 'CLOSE_DOWN_SEARCH',
        label: 'Close down search',
      },
      {
        value: 'DEATH_OF_OTHER_PERSON',
        label: 'Death of other person',
      },
      {
        value: 'DEATH_OF_PRISONER',
        label: 'Death of prisoner',
      },
      {
        value: 'DELIBERATE_DAMAGE',
        label: 'Deliberate damage to prison property (being removed Sept TBC)',
      },
      {
        value: 'DISORDER',
        label: 'Disorder',
      },
      {
        value: 'DRONE_SIGHTING',
        label: 'Drone sighting',
      },
      {
        value: 'ESCAPE_FROM_COURT',
        label: 'Escape from escort',
      },
      {
        value: 'ESCAPE_FROM_ESTABLISHMENT',
        label: 'Escape from establishment',
      },
      {
        value: 'FIND_OF_ILLICIT_ITEMS',
        label: 'Find of illicit items',
      },
      {
        value: 'FIRE',
        label: 'Fire',
      },
      {
        value: 'FOOD_OR_LIQUID_REFUSAL',
        label: 'Food or liquid refusual',
      },
      {
        value: 'KEY_OR_LOCK_COMPROMISE',
        label: 'Key or lock compromise',
      },
      {
        value: 'MISCELLANEOUS',
        label: 'Miscellaneous',
      },
      {
        value: 'RADIO_COMPROMISE',
        label: 'Radio compromise',
      },
      {
        value: 'RELEASE_IN_ERROR',
        label: 'Release in error',
      },
      {
        value: 'SELF_HARM',
        label: 'Self harm',
      },
      {
        value: 'TEMPORARY_RELEASE_FAILURE',
        label: 'Temporary release failure',
      },
      {
        value: 'TOOL_OR_IMPLEMENT_LOSS',
        label: 'Tool or implement loss',
      },
    ],
  },
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
  staffType: {
    component: 'govukRadios',
    validate: ['required'],
    id: 'staffType',
    name: 'staffType',
    label: 'What type of staff is [person name]',
    items: [
      {
        value: 'NON-DIRECTLY',
        label: 'Non-directly employed staff',
      },
      {
        value: 'NON-OPERATIONAL',
        label: 'Non-operational staff',
      },
      {
        value: 'PRISON_OFFICER',
        label: 'Prison officer',
      },
      {
        value: 'OTHER_OPERATIONAL_STAFF',
        label: 'Other operational staff',
      },
    ],
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
  seriousInjuries: {
    component: 'govukCheckboxes',
    validate: ['required'],
    id: 'seriousInjuries',
    name: 'seriousInjuries',
    label: 'Select any serious injuries',
    items: [
      {
        value: 'ABSCOND',
        label: 'Bite - skin broken',
      },
      {
        value: 'ASSAULT',
        label: 'Black eye',
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_COURT',
        label: 'Blindness - temporary or permanent',
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_ESTABLISHMENT',
        label: 'Broken nose',
      },
      {
        value: 'BOMB',
        label: 'Broken teeth',
      },
      {
        value: 'BREACH',
        label: 'Bruising - extensive or multiple',
      },
      {
        value: 'CLOSE_DOWN_SEARCH',
        label: 'Burn or scald',
      },
      {
        value: 'DEATH_OF_OTHER_PERSON',
        label: 'Crushing',
      },
      {
        value: 'DEATH_OF_PRISONER',
        label: 'Cut requiring sutures',
      },
      {
        value: 'DELIBERATE_DAMAGE',
        label: 'Deafness - temporary or permanent',
      },
      {
        value: 'DISORDER',
        label: 'Fracture',
      },
      {
        value: 'DRONE_SIGHTING',
        label: 'Gunshot wound',
      },
      {
        value: 'ESCAPE_FROM_COURT',
        label: 'Stabbing',
      },
      {
        value: 'or',
        label: 'or',
        divider: 'or',
      },
      {
        value: 'ESCAPE_FROM_ESTABLISHMENT',
        label: 'No serious injuries',
        behaviour: 'exclusive',
      },
    ],
  },
  minorInjuries: {
    component: 'govukCheckboxes',
    validate: ['required'],
    id: 'minorInjuries',
    name: 'minorInjuries',
    label: 'Select any minor injuries',
    items: [
      {
        value: 'ABSCOND',
        label: 'Bruising - minor',
      },
      {
        value: 'ASSAULT',
        label: 'Cut - superficial',
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_COURT',
        label: 'Graze, scratch or abrasion',
      },
      {
        value: 'ATTEMPTED_ESCAPE_FROM_ESTABLISHMENT',
        label: 'Swelling',
      },
      {
        value: 'BOMB',
        label: 'Other',
      },
      {
        value: 'or',
        label: 'or',
        divider: 'or',
      },
      {
        value: 'ESCAPE_FROM_ESTABLISHMENT',
        label: 'No minor injuries',
        behaviour: 'exclusive',
      },
    ],
  },
  medicalTreatment: {
    component: 'govukRadios',
    validate: ['required'],
    id: 'medicalTreatment',
    name: 'medicalTreatment',
    label: 'Did they need medical treatment for concussion or internal injuries?',
    items: [
      {
        value: 'YES',
        label: 'Yes',
      },
      {
        value: 'NO',
        label: 'No',
      },
      {
        value: 'UNKNOWN',
        label: 'Unknown',
      },
    ],
  },
  outsideHospital: {
    component: 'govukRadios',
    validate: ['required'],
    id: 'outsideHospital',
    name: 'outsideHospital',
    label: 'Did they go to outside hospital as a result of their injuries?',
    items: [
      {
        value: 'YES',
        label: 'Yes',
      },
      {
        value: 'NO',
        label: 'No',
      },
      {
        value: 'UNKNOWN',
        label: 'Unknown',
      },
    ],
  },
}

export default fields
