import { parseFieldName } from './utils'

describe('Question form wizard field names', () => {
  it.each([
    { fieldName: '123', expectedResult: { question: 123 } },
    { fieldName: '123-321-comment', expectedResult: { question: 123, response: 321, conditionalField: 'comment' } },
    { fieldName: '123-324-date', expectedResult: { question: 123, response: 324, conditionalField: 'date' } },
    { fieldName: '', expectedResult: null },
    { fieldName: 'a', expectedResult: null },
    { fieldName: '0', expectedResult: null },
    { fieldName: '123-321', expectedResult: null },
    { fieldName: '100--100', expectedResult: null },
    { fieldName: '123-321-person', expectedResult: null },
  ])('“$fieldName” should be parsed correctly', ({ fieldName, expectedResult }) => {
    expect(parseFieldName(fieldName)).toEqual(expectedResult)
  })
})
