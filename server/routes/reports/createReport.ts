// eslint-disable-next-line max-classes-per-file
import type Express from 'express'
import FormWizard from 'hmpo-form-wizard'

import { types } from '../../reportConfiguration/constants'
import { BaseController } from '../../controllers'

class CreateReportTypes extends BaseController {
  locals(_req: FormWizard.Request, _res: Express.Response): Partial<FormWizard.Locals> {
    return {
      pageTitle: 'Select incident type',
      saveButtonText: 'Continue',
    }
  }
}

class CreateReportDetails extends BaseController {
  locals(_req: FormWizard.Request, _res: Express.Response): Partial<FormWizard.Locals> {
    return {
      pageTitle: 'Incident details',
    }
  }
}

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    fields: ['type'],
    template: 'types',
    controller: CreateReportTypes,
    backLink: '/',
    next: 'details',
  },
  '/details': {
    fields: ['incidentDate', 'incidentTime', 'description'],
    controller: CreateReportDetails,
  },
}

const fields: FormWizard.Fields = {
  type: {
    label: 'Select incident type',
    validate: ['required'],
    items: types
      .filter(type => type.active)
      .map(type => ({
        text: type.description,
        value: type.code,
      })),
  },
  incidentDate: {
    label: 'Date of incident',
    hint: 'For example, 17/05/2024',
    component: 'date',
    validate: ['required'],
  },
  incidentTime: {
    label: 'Time',
    hint: 'Use the 24 hour clock. For example, 09 08 or 17 32',
    component: 'time',
    validate: [], // TODO: 'required'
  },
  description: {
    label: 'Description',
    hint: 'Include enough detail that the description can stand alone as a report',
    component: 'textarea',
    validate: ['required'],
  },
}

const config: FormWizard.Config = {
  name: 'createReport',
  checkSession: false,
  csrf: false,
  templatePath: 'pages/createReport',
}

export default FormWizard(steps, fields, config)
