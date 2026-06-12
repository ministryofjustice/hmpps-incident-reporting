import type { Question, Response } from '../../data/incidentReportingApi'
import { assaultBreakdown, disorderBreakdown, selfHarmBreakdown, findBreakdown } from './breakdowns'

function response(code: string, value: string): Response {
  return {
    code,
    response: value,
    label: value,
    responseDate: null,
    additionalInformation: null,
    recordedBy: 'user1',
    recordedAt: new Date('2025-01-01T00:00:00Z'),
  }
}

function question(code: string, responses: Response[]): Question {
  return { code, question: code, label: code, additionalInformation: null, responses }
}

/** Count for a given row id in a list of breakdown rows. */
function count(rows: { id: string; count: number }[], id: string): number {
  return rows.find(row => row.id === id)?.count ?? 0
}

describe('assaultBreakdown', () => {
  it('counts assault types, and serious/sexual/spitting/concussion flags', () => {
    const reports = [
      // prisoner on prisoner, sexual, spitting
      [
        question('61287', [response('213115', 'PRISONER ON PRISONER')]),
        question('61285', [response('212000', 'YES')]),
        question('61290', [response('212001', 'YES')]),
      ],
      // prisoner on staff, serious + concussion
      [
        question('61287', [response('213116', 'PRISONER ON STAFF')]),
        question('61298', [response('212002', 'YES')]),
        question('61305', [response('212003', 'YES')]),
      ],
      // prisoner on other, all the yes/no questions answered NO
      [
        question('61287', [response('213117', 'PRISONER ON OTHER')]),
        question('61285', [response('212004', 'NO')]),
        question('61298', [response('212005', 'NO')]),
      ],
    ]

    const rows = assaultBreakdown(reports)
    expect(count(rows, 'prisonerOnPrisoner')).toBe(1)
    expect(count(rows, 'prisonerOnStaff')).toBe(1)
    expect(count(rows, 'prisonerOnOther')).toBe(1)
    expect(count(rows, 'serious')).toBe(1)
    expect(count(rows, 'sexual')).toBe(1)
    expect(count(rows, 'spitting')).toBe(1)
    expect(count(rows, 'concussion')).toBe(1)
  })

  it('returns zero counts when there are no reports', () => {
    expect(assaultBreakdown([]).every(row => row.count === 0)).toBe(true)
  })
})

describe('disorderBreakdown', () => {
  it('counts each disorder sub-type', () => {
    const reports = [
      [question('63179', [response('214684', 'BARRICADE/PREVENTION OF ACCESS')])],
      [question('63179', [response('214686', 'HOSTAGE')])],
      [question('63179', [response('214687', 'INCIDENT AT HEIGHT')])],
    ]

    const rows = disorderBreakdown(reports)
    expect(count(rows, 'barricade')).toBe(1)
    expect(count(rows, 'concertedIndiscipline')).toBe(0)
    expect(count(rows, 'hostage')).toBe(1)
    expect(count(rows, 'incidentAtHeight')).toBe(1)
  })
})

describe('selfHarmBreakdown', () => {
  it('counts cutting, combines strangulation/hanging, burning and other', () => {
    const reports = [
      [question('44753', [response('1', 'YES')])], // cutting
      [question('44207', [response('2', 'YES')])], // strangulation
      [question('44244', [response('3', 'YES')])], // hanging
      [
        question('45167', [response('4', 'YES')]), // burning
        question('44552', [response('5', 'YES')]), // other
      ],
    ]

    const rows = selfHarmBreakdown(reports)
    expect(count(rows, 'cutting')).toBe(1)
    expect(count(rows, 'strangulationOrHanging')).toBe(2)
    expect(count(rows, 'burning')).toBe(1)
    expect(count(rows, 'other')).toBe(1)
  })
})

describe('findBreakdown', () => {
  it('detects categories from the single-select path', () => {
    const reports = [
      [question('67187', [response('218784', 'ALCOHOL / HOOCH / DISTILLING EQUIPMENT')])],
      [question('67187', [response('218785', 'DRUG / DRUG EQUIPMENT')])],
      [question('67187', [response('218789', 'WEAPON')])],
    ]

    const { categories } = findBreakdown(reports)
    expect(count(categories, 'alcohol')).toBe(1)
    expect(count(categories, 'drugs')).toBe(1)
    expect(count(categories, 'weapons')).toBe(1)
  })

  it('detects categories from the multiple-types path', () => {
    const reports = [
      [
        question('67187', [response('218783', 'MULTIPLE TYPES (SEE FULL BELOW LIST BEFORE SELECTING)')]),
        question('67205', [response('218955', '1 LITRE TO LESS THAN 2 LITRES - (PLEASE STATE NUMBER IN COMMENTS)')]),
        question('67207', [response('218965', 'YES')]),
        question('67224', [response('218947', 'YES - BLUNT INSTRUMENT (COSH, ITEM IN SOCK, ETC)')]),
      ],
    ]

    const { categories } = findBreakdown(reports)
    expect(count(categories, 'alcohol')).toBe(1)
    expect(count(categories, 'drugs')).toBe(1)
    expect(count(categories, 'weapons')).toBe(1)
  })

  it('does not count alcohol when only a NIL quantity is recorded', () => {
    const reports = [
      [
        question('67187', [response('218783', 'MULTIPLE TYPES (SEE FULL BELOW LIST BEFORE SELECTING)')]),
        question('67205', [response('218953', 'NIL')]),
      ],
    ]

    const { categories } = findBreakdown(reports)
    expect(count(categories, 'alcohol')).toBe(0)
  })

  it('breaks drugs down by type across both drug questions, grouping cannabis/cocaine and bucketing others', () => {
    const reports = [
      [question('67190', [response('1', 'CANNABIS'), response('2', 'CANNABIS PLANT')])], // cannabis (once)
      [question('67208', [response('3', 'CRACK')])], // cocaine
      [question('67190', [response('4', 'NPS (NEW PSYCHOACTIVE SUBSTANCES)')])], // nps
      [question('67190', [response('5', 'HEROIN')])], // other
      [question('67190', [response('6', 'UNKNOWN')])], // unknown
      [question('67190', [response('7', 'NONE FOUND')])], // none -> no drug bucket
    ]

    const { drugs } = findBreakdown(reports)
    expect(count(drugs, 'cannabis')).toBe(1)
    expect(count(drugs, 'cocaine')).toBe(1)
    expect(count(drugs, 'nps')).toBe(1)
    expect(count(drugs, 'other')).toBe(1)
    expect(count(drugs, 'unknown')).toBe(1)
  })
})
