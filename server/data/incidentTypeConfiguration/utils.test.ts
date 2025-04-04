import { parseFieldName } from './utils'

describe('Question form wizard field names', () => {
  it.each([
    { fieldName: '123', expectedResult: { questionId: '123' } },
    { fieldName: 'q_5', expectedResult: { questionId: 'q_5' } },
    {
      fieldName: '123-321-comment',
      expectedResult: { questionId: '123', responseId: '321', conditionalField: 'comment' },
    },
    { fieldName: '123-324-date', expectedResult: { questionId: '123', responseId: '324', conditionalField: 'date' } },
    {
      fieldName: 'q_5-r_1-comment',
      expectedResult: { questionId: 'q_5', responseId: 'r_1', conditionalField: 'comment' },
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
