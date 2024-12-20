import superagent from 'superagent'
import type { Request } from 'express'
import { sanitiseError } from '../sanitisedError'
import config from '../config'
import logger from '../../logger'

async function getApiClientToken(token: string): Promise<boolean> {
  try {
    const response = await superagent
      .post(`${config.apis.tokenVerification.url}/token/verify`)
      .auth(token, { type: 'bearer' })
      .timeout(config.apis.tokenVerification.timeout)
    return Boolean(response.body && response.body.active)
  } catch (error) {
    logger.error(sanitiseError(error), 'Error calling tokenVerificationApi')
    return false
  }
}

export type TokenVerifier = (request: Request) => Promise<boolean | void>

const tokenVerifier: TokenVerifier = async request => {
  const { user, verified } = request

  if (!config.apis.tokenVerification.enabled) {
    logger.debug('Token verification disabled, returning token is valid')
    return true
  }

  if (verified) {
    return true
  }

  logger.debug(`token request for user "${user.username}'`)

  const result = await getApiClientToken(user.token)
  if (result) {
    request.verified = true
  }
  return result
}

export default tokenVerifier
