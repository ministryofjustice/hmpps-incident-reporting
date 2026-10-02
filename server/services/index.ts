import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'

import logger from '../../logger'
import config from '../config'
import { dataAccess } from '../data'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, manageUsersApiClient, frontendComponentsClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)
  const auditService = AuditServiceFactory.createInstance(config.sqs.audit, logger)

  return {
    applicationInfo,
    hmppsAuthClient,
    userService,
    auditService,
    frontendComponentsClient,
  }
}

export type Services = ReturnType<typeof services>
