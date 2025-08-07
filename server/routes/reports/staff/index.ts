import express from 'express'

import { populateStaffMember } from '../../../middleware/populateStaffMember'
import { addRouter } from './involvement/add'
import { manualAddRouter } from './involvement/manual/add'
import { editRouter } from './involvement/edit'
import { searchRouter } from './search'
import { summaryRouter } from './summary'
import { removeRouter } from './remove'

export const staffInvolvementRouter = express.Router({ mergeParams: true })
// NB: staffInvolvementRouter is unprotected with permissions checks

// add a new staff involvement
staffInvolvementRouter.use('/search', searchRouter)
staffInvolvementRouter.use('/add/manual', manualAddRouter)
staffInvolvementRouter.use('/add/username/:username', populateStaffMember(), addRouter)

// remove existing staff involvement (index starts at 1)
staffInvolvementRouter.use('/remove/:index', removeRouter)

// edit existing staff involvement (index starts at 1)
staffInvolvementRouter.use('/:index', editRouter)

// list existing staff involvements
staffInvolvementRouter.use('/', summaryRouter)
