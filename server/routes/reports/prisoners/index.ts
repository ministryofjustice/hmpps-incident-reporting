import express from 'express'

import { logoutIf } from '../../../middleware/permissions'
import { populatePrisoner } from '../../../middleware/populatePrisoner'
import { populateReport } from '../../../middleware/populateReport'
import { cannotEditReport } from '../permissions'
import { addRouter } from './involvement/add'
import { editRouter } from './involvement/edit'
import { summaryRouter } from './summary'

// eslint-disable-next-line import/prefer-default-export
export const prisonerInvolvementRouter = express.Router({ mergeParams: true })

// require report-editing permissions
prisonerInvolvementRouter.use(populateReport(true), logoutIf(cannotEditReport))

// add a new prisoner involvement
prisonerInvolvementRouter.use('/add/:prisonerNumber', populatePrisoner(), addRouter)

// remove existing staff involvement (index starts at 1)
prisonerInvolvementRouter.use('/remove/:index', (_req, res) => {
  res.send('REMOVE')
})

// edit existing prisoner involvement (index starts at 1)
prisonerInvolvementRouter.use('/:index', editRouter)

// list existing prisoner involvements
prisonerInvolvementRouter.use('/', summaryRouter)
