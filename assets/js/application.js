import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'

import { initDpsCards } from './components/dpsCard'

govukFrontend.initAll()
mojFrontend.initAll()

initDpsCards()
