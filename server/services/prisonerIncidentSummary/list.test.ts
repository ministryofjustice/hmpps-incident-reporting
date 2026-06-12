import type { IncidentReportingApi, Question, ReportWithDetails, Response } from '../../data/incidentReportingApi'
import type { PrisonApi } from '../../data/prisonApi'
import { getPrisonerIncidentList } from './list'

const PRISONER_NUMBER = 'A1111AA'

function response(
  code: string,
  value: string,
  additionalInformation: string | null = null,
  label: string = value,
): Response {
  return {
    code,
    response: value,
    label,
    responseDate: null,
    additionalInformation,
    recordedBy: 'user1',
    recordedAt: new Date('2025-01-01T00:00:00Z'),
  }
}

function question(code: string, responses: Response[]): Question {
  return { code, question: code, label: code, additionalInformation: null, responses }
}

interface ReportConfig {
  id: string
  reference: string
  type: string
  status?: string
  location?: string
  date: string
  questions?: Question[]
  role?: string
}

function report({
  id,
  reference,
  type,
  status = 'AWAITING_REVIEW',
  location = 'MDI',
  date,
  questions = [],
  role = 'PERPETRATOR',
}: ReportConfig): ReportWithDetails {
  return {
    id,
    reportReference: reference,
    type,
    status,
    location,
    incidentDateAndTime: new Date(date),
    questions,
    prisonersInvolved: [
      {
        prisonerNumber: PRISONER_NUMBER,
        firstName: 'ANDREW',
        lastName: 'ARNOLD',
        prisonerRole: role,
        outcome: null,
        comment: null,
      },
      // an unrelated prisoner who must not produce a row
      {
        prisonerNumber: 'B2222BB',
        firstName: 'BARRY',
        lastName: 'BENCH',
        prisonerRole: 'VICTIM',
        outcome: null,
        comment: null,
      },
    ],
  } as unknown as ReportWithDetails
}

function mockApis(reports: ReportWithDetails[]): { api: IncidentReportingApi; prisonApi: PrisonApi } {
  const byId = new Map(reports.map(r => [r.id, r]))
  const api = {
    getReports: jest.fn().mockResolvedValue({
      content: reports.map(r => ({ id: r.id })),
      totalPages: 1,
    }),
    getReportWithDetailsById: jest.fn((id: string) => Promise.resolve(byId.get(id))),
  } as unknown as IncidentReportingApi
  const prisonApi = {
    getAgency: jest.fn((agencyId: string) => Promise.resolve({ description: `${agencyId} prison` })),
  } as unknown as PrisonApi
  return { api, prisonApi }
}

describe('getPrisonerIncidentList', () => {
  it('maps an active assault report to a row with subtype, role, extra info, reason, location and establishment', async () => {
    const assault = report({
      id: '1',
      reference: '6001',
      type: 'ASSAULT_5',
      date: '2025-06-01T09:15:00Z',
      role: 'ASSAILANT',
      questions: [
        question('61287', [response('213115', 'PRISONER ON PRISONER', null, 'Prisoner on prisoner')]), // subtype
        question('61298', [response('213159', 'YES')]), // serious injury
        question('61285', [response('213111', 'YES')]), // sexual assault
        question('61290', [response('213126', 'YES')]), // spitting
        question('61311', [response('999', 'YES', 'Debt')]), // apparent reason (free text)
        question('61284', [response('213083', 'GYM', null, 'Gym')]), // location
      ],
    })
    const { api, prisonApi } = mockApis([assault])

    const { rows } = await getPrisonerIncidentList(api, prisonApi, PRISONER_NUMBER)

    expect(rows).toHaveLength(1) // only this prisoner, not the unrelated involvement
    expect(rows[0]).toMatchObject({
      reportReference: '6001',
      typeDescription: 'Assault',
      subtype: 'Prisoner on prisoner',
      role: 'Assailant',
      reason: 'Debt',
      location: 'Gym',
      establishment: 'MDI prison',
      status: 'Awaiting review',
    })
    expect(rows[0].extraInformation).toContain('Serious injury')
    expect(rows[0].extraInformation).toContain('Sexual assault')
    expect(rows[0].extraInformation).toContain('Spitting')
  })

  it('maps a self-harm report to its methods', async () => {
    const selfHarm = report({
      id: '1',
      reference: '6002',
      type: 'SELF_HARM_1',
      date: '2025-05-01T09:15:00Z',
      questions: [
        question('44753', [response('181110', 'YES')]), // cutting
        question('45167', [response('182616', 'YES')]), // burning
        question('45051', [response('182179', 'ORDINARY', 'A-1-2-34', 'Ordinary')]), // location with comment
      ],
    })
    const { api, prisonApi } = mockApis([selfHarm])

    const { rows } = await getPrisonerIncidentList(api, prisonApi, PRISONER_NUMBER)

    expect(rows[0].extraInformation).toBe('Cutting, Burning')
    expect(rows[0].location).toBe('Ordinary (A-1-2-34)')
  })

  it('lists the items found for a FIND_6 multiple-types find', async () => {
    const find = report({
      id: '1',
      reference: '6003',
      type: 'FIND_6',
      date: '2025-04-01T09:15:00Z',
      role: 'IN_POSSESSION',
      questions: [
        question('67187', [response('218783', 'MULTIPLE TYPES', null, 'Multiple types')]), // subtype
        question('67207', [response('218965', 'YES')]), // drugs found
        question('67213', [response('219014', 'YES')]), // mobile phone
        question('67215', [response('219040', 'ONE SIM')]), // sim card (not the "none" code)
      ],
    })
    const { api, prisonApi } = mockApis([find])

    const { rows } = await getPrisonerIncidentList(api, prisonApi, PRISONER_NUMBER)

    expect(rows[0].subtype).toBe('Multiple types')
    expect(rows[0].role).toBe('In possession')
    expect(rows[0].extraInformation).toBe('Drugs, Mobile phone, SIM card')
  })

  it('shows core columns but blank derived columns for an older report version', async () => {
    const oldAssault = report({
      id: '1',
      reference: '6004',
      type: 'ASSAULT_4',
      date: '2025-03-01T09:15:00Z',
      questions: [question('44367', [response('179730', 'PRISONER ON PRISONER')])],
    })
    const { api, prisonApi } = mockApis([oldAssault])

    const { rows } = await getPrisonerIncidentList(api, prisonApi, PRISONER_NUMBER)

    expect(rows[0]).toMatchObject({ reportReference: '6004', role: 'Perpetrator', establishment: 'MDI prison' })
    expect(rows[0].subtype).toBeUndefined()
    expect(rows[0].extraInformation).toBeUndefined()
    expect(rows[0].location).toBeUndefined()
  })

  it('orders rows by incident date-time, most recent first', async () => {
    const reports = [
      report({ id: '1', reference: 'OLD', type: 'FIRE_1', date: '2025-01-01T09:00:00Z' }),
      report({ id: '2', reference: 'NEW', type: 'FIRE_1', date: '2025-06-01T09:00:00Z' }),
      report({ id: '3', reference: 'MID', type: 'FIRE_1', date: '2025-03-01T09:00:00Z' }),
    ]
    const { api, prisonApi } = mockApis(reports)

    const { rows } = await getPrisonerIncidentList(api, prisonApi, PRISONER_NUMBER)

    expect(rows.map(row => row.reportReference)).toEqual(['NEW', 'MID', 'OLD'])
  })
})
