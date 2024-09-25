import FrontendComponentsService from './frontendComponentsService'
import FrontendComponentsClient, { FrontendComponentsResponse } from '../data/frontendComponentsClient'

jest.mock('../data/feComponentsClient')

const token = 'some token'

describe('Components service', () => {
  let componentsClient: jest.Mocked<FrontendComponentsClient>
  let componentsService: FrontendComponentsService

  describe('getComponent', () => {
    beforeEach(() => {
      componentsClient = jest.mocked(new FrontendComponentsClient())
      componentsService = new FrontendComponentsService(componentsClient)
    })

    it('Retrieves and returns requested component', async () => {
      const caseLoad = {
        caseLoadId: 'TST',
        description: 'Leeds (HMP)',
        type: 'INST',
        caseloadFunction: 'GENERAL',
        currentlyActive: true,
      }

      const componentValue: FrontendComponentsResponse = {
        header: {
          html: '<header></header>',
          css: [],
          javascript: [],
        },
        footer: {
          html: '<footer></footer>',
          css: [],
          javascript: [],
        },
        meta: {
          activeCaseLoad: caseLoad,
          caseLoads: [caseLoad],
          services: [],
        },
      }

      componentsClient.getComponents.mockResolvedValue(componentValue)

      const result = await componentsService.getComponents(['header'], token)

      expect(result).toEqual(componentValue)
    })

    it('Propagates error', async () => {
      componentsClient.getComponents.mockRejectedValue(new Error('some error'))

      await expect(componentsService.getComponents(['header'], token)).rejects.toEqual(new Error('some error'))
    })
  })
})
