import type FormWizard from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  addStaff: {
    label: 'Do you want to add a member of staff?',
    component: 'govukRadios',
    validate: ['required'],
    name: 'addStaff',
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
