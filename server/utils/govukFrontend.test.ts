import { type GovukErrorSummaryItem, findFieldInGovukErrorSummary } from './govukFrontend'

describe('findFieldInGovukErrorSummary', () => {
  it.each([undefined, null])('should return null if error list is %p', list => {
    expect(findFieldInGovukErrorSummary(list, 'field')).toBeNull()
  })

  it('should return null if error list is empty', () => {
    expect(findFieldInGovukErrorSummary([], 'field')).toBeNull()
  })

  const errorList: GovukErrorSummaryItem[] = [
    { text: 'Enter a number', href: '#field1' },
    { text: 'Enter a date', href: '#field3' },
  ]

  it('should return null if field is not found', () => {
    expect(findFieldInGovukErrorSummary(errorList, 'field2')).toBeNull()
  })

  it('should return error message if field is found', () => {
    expect(findFieldInGovukErrorSummary(errorList, 'field3')).toStrictEqual({ text: 'Enter a date' })
  })
})
