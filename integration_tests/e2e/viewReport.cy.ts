import { mockReport } from '../../server/data/testData/incidentReporting'
import { andrew, barry } from '../../server/data/testData/offenderSearch'
import { moorland } from '../../server/data/testData/prisonApi'
import { now } from '../../server/testutils/fakeClock'
import Page from '../pages/page'
import { ReportPage } from '../pages/reports/report'

context('View report', () => {
  context('With only minimal details', () => {
    const reportWithDetails = mockReport({
      type: 'DISORDER_2',
      reportReference: '6544',
      reportDateAndTime: now,
      withDetails: true,
    })
    reportWithDetails.prisonersInvolved = []
    reportWithDetails.prisonerInvolvementDone = false
    reportWithDetails.staffInvolved = []
    reportWithDetails.staffInvolvementDone = false
    reportWithDetails.questions = []
    reportWithDetails.correctionRequests = []

    let reportPage: ReportPage

    beforeEach(() => {
      cy.resetBasicStubs()

      cy.signIn()
      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
      cy.task('stubPrisonApiMockPrison', moorland)
      cy.task('stubManageKnownUsers')
      cy.visit(`/reports/${reportWithDetails.id}`)

      reportPage = Page.verifyOnPage(ReportPage, '6544', true)
    })

    it('should show basic report info', () => {
      reportPage.checkLastBreadcrumb('Incident reports', '/reports')

      reportPage.location.should('contain.text', 'Moorland')
      reportPage.reportedBy.should('contain.text', 'John Smith')
      reportPage.status.should('contain.text', 'Draft')
    })

    it('should show no comments', () => {
      reportPage.commentsTimeline.should('not.exist')
    })

    it('should show report summary', () => {
      reportPage.summary.shouldNotHaveActionLinks()
      reportPage.summary.cardContents.then(rows => {
        expect(rows).to.have.lengthOf(3)
        const [typeRow, dateRow, descriptionRow] = rows

        expect(typeRow.value).to.contain('Disorder')
        expect(typeRow.actionLinks).to.have.lengthOf(1)
        expect(typeRow.actionLinks[0]).to.contain('Change')
        expect(typeRow.actionLinks[0]).attr('href').contains(`/reports/${reportWithDetails.id}/change-type`)

        expect(dateRow.value).to.contain(now.getFullYear())
        expect(dateRow.actionLinks).to.have.lengthOf(1)
        expect(dateRow.actionLinks[0]).to.contain('Change')
        expect(dateRow.actionLinks[0]).attr('href').contains(`/reports/${reportWithDetails.id}/update-details`)

        expect(descriptionRow.value).to.contain('A new incident created in the new service of type DISORDER')
        expect(descriptionRow.actionLinks).to.have.lengthOf(1)
        expect(descriptionRow.actionLinks[0]).to.contain('Change')
        expect(descriptionRow.actionLinks[0]).attr('href').contains(`/reports/${reportWithDetails.id}/update-details`)
        // TODO: add a variation with description addendums
      })
    })

    it('should show no prisoner involvements', () => {
      reportPage.prisonerInvolvements.shouldHaveActionLink(
        'Add a prisoner',
        `/reports/${reportWithDetails.id}/prisoners`,
      )
      reportPage.prisonerInvolvements.cardContents.then(rows => {
        expect(rows).to.have.lengthOf(1)
        const [row] = rows
        expect(row.key).to.contain('No prisoners added')
        expect(row.value.trim()).to.equal('')
        expect(row.actionLinks).to.have.lengthOf(0)
      })
    })

    it('should show no staff involvements', () => {
      reportPage.staffInvolvements.shouldHaveActionLink(
        'Add a member of staff',
        `/reports/${reportWithDetails.id}/staff`,
      )
      reportPage.staffInvolvements.cardContents.then(rows => {
        expect(rows).to.have.lengthOf(1)
        const [row] = rows
        expect(row.key).to.contain('No staff added')
        expect(row.value.trim()).to.equal('')
        expect(row.actionLinks).to.have.lengthOf(0)
      })
    })

    it('should show first unanswered question only', () => {
      reportPage.getQuestions('disorder').shouldNotHaveActionLinks()
      reportPage.getQuestions('disorder').cardContents.then(rows => {
        expect(rows).to.have.lengthOf(1)
        const [row] = rows
        expect(row.key).to.contain('1. What type of disorder incident was this?')
        expect(row.value.trim()).to.equal('')
        expect(row.actionLinks).to.have.lengthOf(1)
        expect(row.actionLinks[0]).to.contain('Continue')
        expect(row.actionLinks[0]).attr('href').contains(`/reports/${reportWithDetails.id}/questions/63179`)
      })
    })
  })

  context('With all sections filled in', () => {
    const reportWithDetails = mockReport({
      type: 'DISORDER_2',
      status: 'AWAITING_REVIEW',
      reportReference: '6543',
      reportDateAndTime: now,
      withDetails: true,
      withAddendums: true,
    })
    reportWithDetails.questions = [
      {
        code: '63179',
        question: 'WHAT TYPE OF DISORDER INCIDENT WAS THIS?',
        label: 'What type of disorder incident was this?',
        responses: [
          {
            code: '214687',
            response: 'INCIDENT AT HEIGHT',
            label: 'Incident at height',
            responseDate: null,
            additionalInformation: null,
            recordedBy: 'USER1',
            recordedAt: now.toISOString(),
          },
        ],
        additionalInformation: null,
      },
    ]

    let reportPage: ReportPage

    beforeEach(() => {
      cy.resetBasicStubs()

      cy.signIn()
      cy.task('stubIncidentReportingApiGetReportWithDetailsById', { report: reportWithDetails })
      cy.task('stubOffenderSearchByNumber', [andrew, barry])
      cy.task('stubPrisonApiMockPrison', moorland)
      cy.task('stubManageKnownUsers')
      cy.visit(`/reports/${reportWithDetails.id}`)

      reportPage = Page.verifyOnPage(ReportPage, '6543', false)
    })

    it('should show basic report info', () => {
      reportPage.checkLastBreadcrumb('Incident reports', '/reports')

      reportPage.location.should('contain.text', 'Moorland')
      reportPage.reportedBy.should('contain.text', 'John Smith')
      reportPage.status.should('contain.text', 'Awaiting review')
    })

    it('should show comments', () => {
      reportPage.commentsTimeline.should('exist')
      reportPage.commentsTimelineContents.then(timeline => {
        expect(timeline).to.have.lengthOf(1)
        const [comment] = timeline
        expect(comment.title).to.equal('Sent back')
        expect(comment.byLine).to.equal('by Mary Johnson')
        expect(comment.date).to.contain(now.getFullYear().toString())
        expect(comment.description).to.contain('Please amend question 2')
      })
    })

    it('should show report summary', () => {
      reportPage.summary.shouldNotHaveActionLinks()
      reportPage.summary.cardContents.then(rows => {
        expect(rows).to.have.lengthOf(3)
        const [typeRow, dateRow, descriptionRow] = rows

        expect(typeRow.value).to.contain('Disorder')
        expect(typeRow.actionLinks).to.have.lengthOf(1)
        expect(typeRow.actionLinks[0]).to.contain('Change')
        expect(typeRow.actionLinks[0]).attr('href').contains(`/reports/${reportWithDetails.id}/change-type`)

        expect(dateRow.value).to.contain(now.getFullYear())
        expect(dateRow.actionLinks).to.have.lengthOf(1)
        expect(dateRow.actionLinks[0]).to.contain('Change')
        expect(dateRow.actionLinks[0]).attr('href').contains(`/reports/${reportWithDetails.id}/update-details`)

        expect(descriptionRow.actionLinks).to.have.lengthOf(1)
        expect(descriptionRow.actionLinks[0]).to.contain('Change')
        expect(descriptionRow.actionLinks[0]).attr('href').contains(`/reports/${reportWithDetails.id}/update-details`)
      })
      reportPage.summary.descriptionChunks.then(chunks => {
        expect(chunks).to.have.lengthOf(3)
        const [chunk1, chunk2, chunk3] = chunks
        expect(chunk1).to.have.property('name', 'John Smith')
        expect(chunk1).to.have.property('text', 'A new incident created in the new service of type DISORDER_2')
        expect(chunk2).to.have.property('name', 'John Smith')
        expect(chunk2).to.have.property('text', 'Addendum #1')
        expect(chunk3).to.have.property('name', 'Jane Doe')
        expect(chunk3).to.have.property('text', 'Addendum #2')
      })
    })

    it('should show prisoner involvements', () => {
      reportPage.prisonerInvolvements.shouldHaveActionLink('Change', `/reports/${reportWithDetails.id}/prisoners`)
      reportPage.prisonerInvolvements.cardContents.then(rows => {
        expect(rows).to.have.lengthOf(2)
        const [row1, row2] = rows

        expect(row1.key).to.contain('Andrew Arnold')
        expect(row1.key).to.contain('A1111AA')
        expect(row1.value).to.contain('Role: Active involvement')
        expect(row1.value).to.contain('Details: Comment about A1111AA')
        expect(row1.actionLinks).to.have.lengthOf(0)

        expect(row2.key).to.contain('Barry Benjamin')
        expect(row2.key).to.contain('A2222BB')
        expect(row2.value).to.contain('Role: Suspected involved')
        expect(row2.value).to.contain('Details: No comment')
        expect(row2.actionLinks).to.have.lengthOf(0)
      })
    })

    it('should show staff involvements', () => {
      reportPage.staffInvolvements.shouldHaveActionLink('Change', `/reports/${reportWithDetails.id}/staff`)
      reportPage.staffInvolvements.cardContents.then(rows => {
        expect(rows).to.have.lengthOf(2)
        const [row1, row2] = rows

        expect(row1.key).to.contain('Mary Johnson')
        expect(row1.value).to.contain('Role: Actively involved')
        expect(row1.value).to.contain('Details: Comment about Mary')
        expect(row1.actionLinks).to.have.lengthOf(0)

        expect(row2.key).to.contain('Barry Harrison')
        expect(row2.value).to.contain('Role: Present at scene')
        expect(row2.value).to.contain('Details: No comment')
        expect(row2.actionLinks).to.have.lengthOf(0)
      })
    })

    it('should show answered questions', () => {
      reportPage.getQuestions('disorder').shouldNotHaveActionLinks()
      reportPage.getQuestions('disorder').cardContents.then(rows => {
        expect(rows).to.have.lengthOf(2)
        const [row1, row2] = rows

        expect(row1.key).to.contain('1. What type of disorder incident was this?')
        expect(row1.value).to.contain('Incident at height')
        expect(row1.actionLinks).to.have.lengthOf(1)
        expect(row1.actionLinks[0]).to.contain('Change')
        expect(row1.actionLinks[0]).attr('href').contains(`/reports/${reportWithDetails.id}/questions/63179`)

        expect(row2.key).to.contain('2. What was the main management outcome of this incident?')
        expect(row2.value.trim()).to.equal('')
        expect(row2.actionLinks).to.have.lengthOf(1)
        expect(row2.actionLinks[0]).to.contain('Continue')
        expect(row2.actionLinks[0]).attr('href').contains(`/reports/${reportWithDetails.id}/questions/63179`) // NB: still page 1
      })
    })
  })
})
