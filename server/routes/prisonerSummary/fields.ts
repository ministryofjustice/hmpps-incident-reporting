import type FormWizard from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  addPrisoner: {
    label: 'Do you want to add a prisoner?',
    component: 'govukRadios',
    validate: ['required'],
    name: 'addPrisoner',
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
