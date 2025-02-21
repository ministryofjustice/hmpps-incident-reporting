import express from 'express'

import { logoutIf } from '../../../middleware/permissions'
import { populateReport } from '../../../middleware/populateReport'
import { populateStaffMember } from '../../../middleware/populateStaffMember'
import { cannotEditReport } from '../permissions'
import { addRouter } from './involvement/add'
import { editRouter } from './involvement/edit'
import { summaryRouter } from './summary'

// eslint-disable-next-line import/prefer-default-export
export const staffInvolvementRouter = express.Router({ mergeParams: true })

// require report-editing permissions
staffInvolvementRouter.use(populateReport(true), logoutIf(cannotEditReport))

// add a new staff involvement
// TODO: staffInvolvementRouter.use('/add/manual', addRouter)
staffInvolvementRouter.use('/add/username/:username', populateStaffMember(), addRouter)

// remove existing staff involvement (index starts at 1)
staffInvolvementRouter.use('/remove/:index', (_req, res) => {
  res.send('REMOVE')
})

// edit existing staff involvement (index starts at 1)
staffInvolvementRouter.use('/:index', editRouter)

// list existing staff involvements
staffInvolvementRouter.use('/', summaryRouter)
