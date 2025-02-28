import type FormWizard from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  removeStaff: {
    label: 'Are you sure you want to remove this staff member?',
    component: 'govukRadios',
    validate: ['required'],
    name: 'removeStaff',
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
