import HmppsAuditClient from '../data/hmppsAuditClient'
import AuditService, { Page } from './auditService'

jest.mock('../data/hmppsAuditClient')

describe('Audit service', () => {
  let hmppsAuditClient: jest.Mocked<HmppsAuditClient>
  let auditService: AuditService

  beforeEach(() => {
    const testConfig = {
      queueUrl: 'http://localhost:4566/000000000000/mainQueue',
      region: 'eu-west-2',
      serviceName: 'hmpps-service',
      enabled: true,
    }
    hmppsAuditClient = new HmppsAuditClient(testConfig) as jest.Mocked<HmppsAuditClient>
    auditService = new AuditService(hmppsAuditClient)
  })

  describe('logAuditEvent', () => {
    it('sends audit message using audit client', async () => {
      await auditService.logAuditEvent({
        what: 'AUDIT_EVENT',
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith({
        what: 'AUDIT_EVENT',
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })
    })
  })

  describe('logPageView', () => {
    it('sends page view event audit message using audit client', async () => {
      await auditService.logPageView(Page.HOME_PAGE, {
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith({
        what: 'PAGE_VIEW_HOME_PAGE',
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })
    })
  })
})
