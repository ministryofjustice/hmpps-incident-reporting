import type FormWizard from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  removePrisoner: {
    label: 'Are you sure you want to remove this prisoner?',
    component: 'govukRadios',
    validate: ['required'],
    name: 'removePrisoner',
    items: [
      {
        value: 'yes',
        label: 'Yes',
      },
      {
        value: 'no',
        label: 'No',
      },
    ],
  },
}

export default fields
