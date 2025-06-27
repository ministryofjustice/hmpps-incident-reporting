import { parseFieldName } from './utils'

describe('Question form wizard field names', () => {
  it.each([
    { fieldName: '123', expectedResult: { questionCode: '123' } },
    { fieldName: 'q_5', expectedResult: { questionCode: 'q_5' } },
    {
      fieldName: '123-321-comment',
      expectedResult: { questionCode: '123', responseCode: '321', conditionalField: 'comment' },
    },
    {
      fieldName: '123-324-date',
      expectedResult: { questionCode: '123', responseCode: '324', conditionalField: 'date' },
    },
    {
      fieldName: 'q_5-r_1-comment',
      expectedResult: { questionCode: 'q_5', responseCode: 'r_1', conditionalField: 'comment' },
    },
    { fieldName: '', expectedResult: null },
    { fieldName: '123-321', expectedResult: null },
    { fieldName: 'q-5', expectedResult: null },
    { fieldName: '123-321-person', expectedResult: null },
    { fieldName: '100--comment', expectedResult: null },
  ])('“$fieldName” should be parsed correctly', ({ fieldName, expectedResult }) => {
    expect(parseFieldName(fieldName)).toEqual(expectedResult)
  })
})
