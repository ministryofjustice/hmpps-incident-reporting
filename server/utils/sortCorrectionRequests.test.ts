import { sortCorrectionRequests } from './sortCorrectionRequests'

describe('Sorting correction requests', () => {
  it('should work on empty lists', () => {
    const result = sortCorrectionRequests([])
    expect(result).toEqual([])
  })

  it('should sort comments', () => {
    const result = sortCorrectionRequests([
      {
        descriptionOfChange: 'Firstly, change X',
        userAction: null,
        userType: null,
        originalReportReference: null,
        correctionRequestedBy: 'lev79n',
        correctionRequestedAt: new Date(2023, 11, 5, 12, 34, 56),
      },
      {
        descriptionOfChange: 'Secondly, change Y',
        userAction: null,
        userType: null,
        originalReportReference: null,
        correctionRequestedBy: 'abc12a',
        correctionRequestedAt: new Date(2023, 11, 6, 9, 10, 20),
      },
      {
        descriptionOfChange: 'Thirdly, change Z',
        userAction: null,
        userType: null,
        originalReportReference: null,
        correctionRequestedBy: 'abc12a',
        correctionRequestedAt: new Date(2023, 11, 6, 13),
      },
    ])
    expect(result).toEqual([
      {
        descriptionOfChange: 'Thirdly, change Z',
        userAction: null,
        userType: null,
        originalReportReference: null,
        correctionRequestedBy: 'abc12a',
        correctionRequestedAt: new Date(2023, 11, 6, 13),
      },
      {
        descriptionOfChange: 'Secondly, change Y',
        userAction: null,
        userType: null,
        originalReportReference: null,
        correctionRequestedBy: 'abc12a',
        correctionRequestedAt: new Date(2023, 11, 6, 9, 10, 20),
      },
      {
        descriptionOfChange: 'Firstly, change X',
        userAction: null,
        userType: null,
        originalReportReference: null,
        correctionRequestedBy: 'lev79n',
        correctionRequestedAt: new Date(2023, 11, 5, 12, 34, 56),
      },
    ])
  })

  it('should preserve the order of comments with the same timestamp', () => {
    const result = sortCorrectionRequests([
      {
        descriptionOfChange: 'Change X',
        userAction: null,
        userType: null,
        originalReportReference: null,
        correctionRequestedBy: 'lev79n',
        correctionRequestedAt: new Date(2023, 11, 5, 12, 34, 56),
      },
      {
        descriptionOfChange: 'Change Y',
        userAction: null,
        userType: null,
        originalReportReference: null,
        correctionRequestedBy: 'lev79n',
        correctionRequestedAt: new Date(2023, 11, 5, 12, 34, 56),
      },
    ])
    expect(result.map(comment => comment.descriptionOfChange)).toEqual(['Change X', 'Change Y'])
  })
})
