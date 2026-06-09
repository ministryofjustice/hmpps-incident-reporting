import { IncidentReportingApi, type Page, type Question, type ReportBasic } from '../../data/incidentReportingApi'
import type { Status, Type } from '../../reportConfiguration/constants'
import { getPrisonerIncidentSummary } from '.'

jest.mock('../../data/incidentReportingApi')

const api = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>

function basicReport(id: string, type: Type): ReportBasic {
  return { id, type } as ReportBasic
}

function page(content: ReportBasic[], totalPages = 1, number = 0): Page<ReportBasic> {
  return {
    content,
    number,
    size: content.length,
    numberOfElements: content.length,
    totalElements: content.length,
    totalPages,
    sort: [],
  }
}

function withQuestions(id: string, questions: Question[]) {
  return { id, questions } as Awaited<ReturnType<IncidentReportingApi['getReportWithDetailsById']>>
}

function question(code: string, responseCode: string, value: string): Question {
  return {
    code,
    question: code,
    label: code,
    additionalInformation: null,
    responses: [
      {
        code: responseCode,
        response: value,
        label: value,
        responseDate: null,
        additionalInformation: null,
        recordedBy: 'user1',
        recordedAt: new Date(),
      },
    ],
  }
}

beforeEach(() => {
  jest.resetAllMocks()
})

describe('getPrisonerIncidentSummary', () => {
  it('queries the API excluding DRAFT/DUPLICATE/NOT_REPORTABLE and filtering by prisoner and incident date', async () => {
    api.getReports.mockResolvedValue(page([]))

    await getPrisonerIncidentSummary(api, 'A1111AA')

    const query = api.getReports.mock.calls[0][0]
    expect(query.involvingPrisonerNumber).toBe('A1111AA')
    expect(query.incidentDateFrom).toBeInstanceOf(Date)
    const excluded: Status[] = ['DRAFT', 'DUPLICATE', 'NOT_REPORTABLE']
    excluded.forEach(status => expect(query.status).not.toContain(status))
    expect(query.status).toContain('CLOSED')
    expect(query.status).toContain('AWAITING_REVIEW')
    // roughly 12 months ago
    const monthsAgo = (Date.now() - (query.incidentDateFrom as Date).getTime()) / (1000 * 60 * 60 * 24 * 30)
    expect(monthsAgo).toBeGreaterThan(11)
    expect(monthsAgo).toBeLessThan(13)
  })

  it('groups reports by family ordered by description, with no breakdowns for plain families', async () => {
    api.getReports.mockResolvedValue(
      page([basicReport('1', 'MISCELLANEOUS_1'), basicReport('2', 'FIRE_1'), basicReport('3', 'FIRE_1')]),
    )

    const summary = await getPrisonerIncidentSummary(api, 'A1111AA')

    expect(summary.totalReports).toBe(3)
    expect(summary.overall).toEqual([
      { familyCode: 'FIRE', description: 'Fire', count: 2 },
      { familyCode: 'MISCELLANEOUS', description: 'Miscellaneous', count: 1 },
    ])
    expect(summary.assault).toBeUndefined()
    expect(summary.find).toBeUndefined()
    expect(api.getReportWithDetailsById).not.toHaveBeenCalled()
  })

  it('follows pagination', async () => {
    api.getReports
      .mockResolvedValueOnce(page([basicReport('1', 'FIRE_1')], 2, 0))
      .mockResolvedValueOnce(page([basicReport('2', 'FIRE_1')], 2, 1))

    const summary = await getPrisonerIncidentSummary(api, 'A1111AA')

    expect(api.getReports).toHaveBeenCalledTimes(2)
    expect(summary.totalReports).toBe(2)
    expect(summary.overall).toEqual([{ familyCode: 'FIRE', description: 'Fire', count: 2 }])
  })

  it('counts older type versions in the family total but only drills into the active version', async () => {
    api.getReports.mockResolvedValue(page([basicReport('new', 'ASSAULT_5'), basicReport('old', 'ASSAULT_1')]))
    api.getReportWithDetailsById.mockResolvedValue(
      withQuestions('new', [question('61287', '213115', 'PRISONER ON PRISONER')]),
    )

    const summary = await getPrisonerIncidentSummary(api, 'A1111AA')

    expect(summary.overall).toEqual([{ familyCode: 'ASSAULT', description: 'Assault', count: 2 }])
    // only the active ASSAULT_5 report is fetched with details
    expect(api.getReportWithDetailsById).toHaveBeenCalledTimes(1)
    expect(api.getReportWithDetailsById).toHaveBeenCalledWith('new')
    expect(summary.assault?.find(row => row.id === 'prisonerOnPrisoner')?.count).toBe(1)
  })

  it('produces a find breakdown with categories and drugs', async () => {
    api.getReports.mockResolvedValue(page([basicReport('f', 'FIND_6')]))
    api.getReportWithDetailsById.mockResolvedValue(
      withQuestions('f', [question('67187', '218785', 'DRUG / DRUG EQUIPMENT'), question('67190', '999', 'CANNABIS')]),
    )

    const summary = await getPrisonerIncidentSummary(api, 'A1111AA')

    expect(summary.find?.categories.find(row => row.id === 'drugs')?.count).toBe(1)
    expect(summary.find?.drugs.find(row => row.id === 'cannabis')?.count).toBe(1)
  })
})
