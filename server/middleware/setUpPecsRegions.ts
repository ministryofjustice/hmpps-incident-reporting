import type { RequestHandler } from 'express'
import { ServiceUnavailable } from 'http-errors'

import logger from '../../logger'
import { fromAgency, pecsRegions } from '../data/pecsRegions'
import { PrisonRegisterApi } from '../data/prisonRegisterApi'
import type { Services } from '../services'

/** Load PECS regions from Prison Register if none are already cached */
export default function setUpPecsRegions(services: Services): RequestHandler {
  const { hmppsAuthClient } = services

  return (_req, _res, next) => {
    if (pecsRegions.length === 0) {
      hmppsAuthClient
        .getToken()
        .then(systemToken => new PrisonRegisterApi(systemToken).getPecsRegions(false))
        .then(
          agencies => {
            pecsRegions.push(
              ...agencies.map(fromAgency).sort((region1, region2) => {
                if (region1.active !== region2.active) {
                  return region1.active ? -1 : 1
                }
                return region1.description.localeCompare(region2.description)
              }),
            )
            next()
          },
          error => {
            logger.error(error, 'Could not load PECS regions')
            next(new ServiceUnavailable())
          },
        )
    } else {
      next()
    }
  }
}
