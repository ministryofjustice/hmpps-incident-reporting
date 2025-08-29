import { now } from '../testutils/fakeClock'
import { getIncidentTypeConfiguration } from '../reportConfiguration/types'
import { generateSteps } from './incidentTypeConfiguration/formWizard'
import { QuestionProgress } from './incidentTypeConfiguration/questionProgress'
import type { ReportWithDetails } from './incidentReportingApi'
import { convertReportDates } from './incidentReportingApiUtils'
import { mockReport } from './testData/incidentReporting'
import { makeSimpleQuestion } from './testData/incidentReportingJest'
import { mockPecsRegions } from './testData/pecsRegions'
import { validateReport } from './reportValidity'

async function makeLocalsGeneratedByMiddleware(report: ReportWithDetails) {
  const reportUrl = `/reports/${report.id}` // used in error anchors, but doesn’t have to match what is on the site
  const reportConfig = await getIncidentTypeConfiguration(report.type)
  const questionsSteps = generateSteps(reportConfig)
  const questionProgress = new QuestionProgress(reportConfig, questionsSteps, report)
  const questionProgressSteps = Array.from(questionProgress)
  return { reportConfig, reportUrl, questionProgressSteps }
}

beforeAll(() => {
  mockPecsRegions()
})

describe.each([{ reportType: 'prison' as const }, { reportType: 'PECS' as const }])(
  'Checking that a $reportType report is valid',
  ({ reportType }) => {
    describe('when incident type requires staff and prisoner involvements', () => {
      let report: ReportWithDetails

      beforeEach(() => {
        report = convertReportDates(
          mockReport({
            reportReference: '6543',
            reportDateAndTime: now,
            location: reportType === 'prison' ? 'MDI' : 'NORTH',
            type: 'ASSAULT_5',
            status: 'DRAFT',
            withDetails: true,
          }),
        )
        report.id = '11111111-2222-3333-4444-55555555555A' // to make tests not dependent on randomness
        report.questions = [
          makeSimpleQuestion('61279', 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT', [
            'IEP REGRESSION',
            '213063',
          ]),
          makeSimpleQuestion('61280', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', ['NO', '213067']),
          makeSimpleQuestion('61281', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', ['NO', '213069']),
          makeSimpleQuestion('61282', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', ['NO', '213071']),
          makeSimpleQuestion('61283', 'IS THE LOCATION OF THE INCDENT KNOWN', ['NO', '213073']),
          makeSimpleQuestion('61285', 'WAS THIS A SEXUAL ASSAULT', ['NO', '213112']),
          makeSimpleQuestion('61286', 'DID THE ASSAULT OCCUR DURING A FIGHT', ['NO', '213114']),
          makeSimpleQuestion('61287', 'WHAT TYPE OF ASSAULT WAS IT', ['PRISONER ON STAFF', '213116']),
          makeSimpleQuestion('61289', 'DESCRIBE THE TYPE OF STAFF', ['OPERATIONAL STAFF - OTHER', '213122']),
          makeSimpleQuestion('61290', 'WAS SPITTING USED IN THIS INCIDENT', ['NO', '213125']),
          makeSimpleQuestion('61294', 'WERE ANY WEAPONS USED', ['NO', '213136']),
          makeSimpleQuestion('61296', 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT', ['NO', '213150']),
          makeSimpleQuestion('61306', 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT', [
            'NO',
            '213200',
          ]),
          makeSimpleQuestion('61307', 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT', ['NO', '213202']),
          makeSimpleQuestion('61308', 'DID THE ASSAULT OCCUR IN PUBLIC VIEW', ['YES', '213203']),
          makeSimpleQuestion('61309', 'IS THERE ANY AUDIO OR VISUAL FOOTAGE OF THE ASSAULT', ['NO', '213205']),
          makeSimpleQuestion('61311', 'WAS THERE AN APPARENT REASON FOR THE ASSAULT', ['NO', '213213']),
        ]
      })

      it('should not generate errors for a fully-completed report', async () => {
        const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
        const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

        const errors = Array.from(errorGenerator)
        expect(errors).toHaveLength(0)
      })

      it('should generate an error if staff involvements were skipped', async () => {
        report.staffInvolvementDone = false
        report.staffInvolved = []

        const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
        const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

        const errors = Array.from(errorGenerator)
        expect(errors).toHaveLength(1)
        const [error] = errors
        expect(error).toEqual({
          text: 'Please complete the staff involvement section',
          href: '/reports/11111111-2222-3333-4444-55555555555A/staff',
        })
      })

      if (reportType === 'prison') {
        it('should generate an error if staff involvements not added', async () => {
          report.staffInvolvementDone = true
          report.staffInvolved = []

          const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
          const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

          const errors = Array.from(errorGenerator)
          expect(errors).toHaveLength(1)
          const [error] = errors
          expect(error).toEqual({
            text: 'You need to add a member of staff',
            href: '/reports/11111111-2222-3333-4444-55555555555A/staff',
          })
        })
      } else {
        it('should not generate errors if staff involvements not added', async () => {
          report.staffInvolvementDone = true
          report.staffInvolved = []

          const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
          const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

          const errors = Array.from(errorGenerator)
          expect(errors).toHaveLength(0)
        })
      }

      it('should generate an error if prisoner involvements were skipped', async () => {
        report.prisonerInvolvementDone = false
        report.prisonersInvolved = []

        const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
        const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

        const errors = Array.from(errorGenerator)
        expect(errors).toHaveLength(1)
        const [error] = errors
        expect(error).toEqual({
          text: 'Please complete the prisoner involvement section',
          href: '/reports/11111111-2222-3333-4444-55555555555A/prisoners',
        })
      })

      if (reportType === 'prison') {
        it('should generate an error if prisoner involvements not added', async () => {
          report.prisonerInvolvementDone = true
          report.prisonersInvolved = []

          const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
          const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

          const errors = Array.from(errorGenerator)
          expect(errors).toHaveLength(1)
          const [error] = errors
          expect(error).toEqual({
            text: 'You need to add a prisoner',
            href: '/reports/11111111-2222-3333-4444-55555555555A/prisoners',
          })
        })
      } else {
        it('should not generate errors if prisoner involvements not added', async () => {
          report.prisonerInvolvementDone = true
          report.prisonersInvolved = []

          const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
          const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

          const errors = Array.from(errorGenerator)
          expect(errors).toHaveLength(0)
        })
      }

      it('should generate an error if no questions have been answered', async () => {
        report.questions = []

        const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
        const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

        const errors = Array.from(errorGenerator)
        expect(errors).toHaveLength(1)
        const [error] = errors
        expect(error).toEqual({
          text: 'You must answer question 1',
          href: '/reports/11111111-2222-3333-4444-55555555555A/questions/61279',
        })
      })

      it('should generate an error if questions have not been completed', async () => {
        report.questions.pop()

        const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
        const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

        const errors = Array.from(errorGenerator)
        expect(errors).toHaveLength(1)
        const [error] = errors
        expect(error).toEqual({
          text: 'You must answer question 17',
          href: '/reports/11111111-2222-3333-4444-55555555555A/questions/61311',
        })
      })

      it('should generate multiple errors if there are several problems', async () => {
        report.staffInvolvementDone = false
        report.staffInvolved = []
        report.prisonerInvolvementDone = false
        report.prisonersInvolved = []
        report.questions = []

        const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
        const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

        const errors = Array.from(errorGenerator)
        expect(errors).toHaveLength(3)
      })
    })

    describe('when incident type does not require staff and prisoner involvements', () => {
      let report: ReportWithDetails

      beforeEach(() => {
        report = convertReportDates(
          mockReport({
            reportReference: '6543',
            reportDateAndTime: now,
            type: 'FIND_6',
            status: 'DRAFT',
            withDetails: true,
          }),
        )
        report.id = '11111111-2222-3333-4444-55555555555A' // to make tests not dependent on randomness
        report.questions = [
          makeSimpleQuestion('67179', 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)', [
            'INFORMATION RECEIVED',
            '218695',
          ]),
          makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', ['NO', '218710']),
          makeSimpleQuestion('67182', 'DESCRIBE THE METHOD OF ENTRY INTO THE ESTABLISHMENT', ['UNKNOWN', '218741']),
          makeSimpleQuestion('67184', 'IF FOUND IN POSSESSION, WHOSE WAS IT FOUND IN?', ['NOT APPLICABLE', '218756']),
          makeSimpleQuestion('67186', 'WHAT WAS THE METHOD OF CONCEALMENT', ['IN HAND', '218774']),
          makeSimpleQuestion('67187', 'PLEASE SELECT CATEGORY OF FIND', [
            'OTHER REPORTABLE ITEMS (BY NATIONAL OR LOCAL POLICY)',
            '218790',
          ]),
          makeSimpleQuestion('67204', 'OTHER REPORTABLE ITEMS FOUND (BY NATIONAL OR LOCAL POLICY)', [
            'YES (NOOSE / LIGATURE)',
            '218951',
          ]),
          makeSimpleQuestion('67226', 'WERE THE ITEMS OBTAINED ON TEMPORARY RELEASE?', ['NO', '219123']),
        ]
      })

      it('should not generate errors when involvements were not added', async () => {
        report.staffInvolvementDone = true
        report.staffInvolved = []
        report.prisonerInvolvementDone = true
        report.prisonersInvolved = []

        const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
        const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

        const errors = Array.from(errorGenerator)
        expect(errors).toHaveLength(0)
      })

      it('should still generate an error if staff involvements were skipped', async () => {
        report.staffInvolvementDone = false
        report.staffInvolved = []

        const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
        const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

        const errors = Array.from(errorGenerator)
        expect(errors).toHaveLength(1)
        const [error] = errors
        expect(error).toEqual({
          text: 'Please complete the staff involvement section',
          href: '/reports/11111111-2222-3333-4444-55555555555A/staff',
        })
      })

      it('should still generate an error if prisoner involvements were skipped', async () => {
        report.prisonerInvolvementDone = false
        report.prisonersInvolved = []

        const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
        const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

        const errors = Array.from(errorGenerator)
        expect(errors).toHaveLength(1)
        const [error] = errors
        expect(error).toEqual({
          text: 'Please complete the prisoner involvement section',
          href: '/reports/11111111-2222-3333-4444-55555555555A/prisoners',
        })
      })

      it('should still generate an error if no questions have been answered', async () => {
        report.questions.pop()

        const { reportConfig, reportUrl, questionProgressSteps } = await makeLocalsGeneratedByMiddleware(report)
        const errorGenerator = validateReport(report, reportConfig, questionProgressSteps, reportUrl)

        const errors = Array.from(errorGenerator)
        expect(errors).toHaveLength(1)
        const [error] = errors
        expect(error).toEqual({
          text: 'You must answer question 8',
          href: '/reports/11111111-2222-3333-4444-55555555555A/questions/67226',
        })
      })
    })
  },
)
