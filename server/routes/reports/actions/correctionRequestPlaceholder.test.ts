import { isCorrectionRequestPlaceholder, placeholderForCorrectionRequest } from './correctionRequestPlaceholder'

describe('Correction request placeholders', () => {
  it('should work for requesting marking as not reportable', () => {
    const descriptionOfChange = placeholderForCorrectionRequest('REQUEST_NOT_REPORTABLE')
    expect(descriptionOfChange).toEqual('(Not reportable)')
    const hide = isCorrectionRequestPlaceholder(descriptionOfChange)
    expect(hide).toBe(true)
  })

  it('should work for marking as not reportable', () => {
    const descriptionOfChange = placeholderForCorrectionRequest('MARK_NOT_REPORTABLE')
    expect(descriptionOfChange).toEqual('(Not reportable)')
    const hide = isCorrectionRequestPlaceholder(descriptionOfChange)
    expect(hide).toBe(true)
  })

  it('should work for requesting marking as duplicate', () => {
    const descriptionOfChange = placeholderForCorrectionRequest('REQUEST_DUPLICATE', '1242')
    expect(descriptionOfChange).toEqual('(Report is a duplicate of 1242)')
    const hide = isCorrectionRequestPlaceholder(descriptionOfChange)
    expect(hide).toBe(true)
  })

  it('should work for marking as duplicate', () => {
    const descriptionOfChange = placeholderForCorrectionRequest('MARK_DUPLICATE', '1242')
    expect(descriptionOfChange).toEqual('(Report is a duplicate of 1242)')
    const hide = isCorrectionRequestPlaceholder(descriptionOfChange)
    expect(hide).toBe(true)
  })

  it('should work for reopening', () => {
    // NB: at present, no RECALL transition posts a correction request
    const descriptionOfChange = placeholderForCorrectionRequest('RECALL')
    expect(descriptionOfChange).toEqual('(Reopened)')
    const hide = isCorrectionRequestPlaceholder(descriptionOfChange)
    expect(hide).toBe(true)
  })

  it.each(['Not reportable', 'Duplicate', 'Reopened', '(Report is a duplicate)'])(
    'should not consider “” as a placeholder',
    descriptionOfChange => {
      const hide = isCorrectionRequestPlaceholder(descriptionOfChange)
      expect(hide).toBe(false)
    },
  )
})
