import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'

import { initApplicationComponents } from './components/initAll'

govukFrontend.initAll()
mojFrontend.initAll()

initApplicationComponents()
