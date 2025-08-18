import type { RequestHandler } from 'express'
import { ServiceUnavailable } from 'http-errors'

import logger from '../../logger'
import { fromAgency, pecsRegions } from '../data/pecsRegions'
import { PrisonApi } from '../data/prisonApi'
import type { Services } from '../services'

/** Load PECS regions from prison-api if none are already cached */
export default function setUpPecsRegions(services: Services): RequestHandler {
  const { hmppsAuthClient } = services

  return (_req, _res, next) => {
    if (pecsRegions.length === 0) {
      hmppsAuthClient
        .getToken()
        .then(systemToken => new PrisonApi(systemToken).getPecsRegions(false))
        .then(
          regionMap => {
            pecsRegions.push(
              ...Object.values(regionMap)
                .map(fromAgency)
                .sort((region1, region2) => {
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
