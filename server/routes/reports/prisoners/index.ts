import express from 'express'

import { populatePrisoner } from '../../../middleware/populatePrisoner'
import { addRouter } from './involvement/add'
import { editRouter } from './involvement/edit'
import { searchRouter } from './search'
import { summaryRouter } from './summary'
import { removeRouter } from './remove'

// eslint-disable-next-line import/prefer-default-export
export const prisonerInvolvementRouter = express.Router({ mergeParams: true })
// NB: prisonerInvolvementRouter is unprotected with permissions checks

// add a new prisoner involvement
prisonerInvolvementRouter.use('/search', searchRouter)
prisonerInvolvementRouter.use('/add/:prisonerNumber', populatePrisoner(), addRouter)

// remove existing staff involvement (index starts at 1)
prisonerInvolvementRouter.use('/remove/:index', removeRouter)

// edit existing prisoner involvement (index starts at 1)
prisonerInvolvementRouter.use('/:index', editRouter)

// list existing prisoner involvements
prisonerInvolvementRouter.use('/', summaryRouter)
