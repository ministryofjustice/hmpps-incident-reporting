import { sortOptions, orderOptions } from '../data/offenderSearchApi'
import PrisonerSearchForm from './prisonerSearchForm'

describe('PrisonerSearchForm', () => {
  it.each([
    { scenario: 'the payload is empty', payload: {} },
    { scenario: 'the search query is blank', payload: { q: '', page: '1' } },
    { scenario: 'the search query only has whitespace', payload: { q: ' \t', page: '1' } },
    { scenario: 'the page is not specified', payload: { q: 'john' } },
    { scenario: 'the page is empty', payload: { q: 'john', page: '' } },
    { scenario: 'the page is 0', payload: { q: 'john', page: '0' } },
    { scenario: 'sort is invalid', payload: { q: 'john', page: '1', sort: 'age', order: 'ASC' } },
    { scenario: 'order is invalid', payload: { q: 'john', page: '1', sort: 'firstName', order: 'reversed' } },
    { scenario: 'scope is invalid', payload: { q: 'john', page: '1', scope: 'MDI' } },
  ])('should present errors when $scenario', ({ payload }) => {
    const form = new PrisonerSearchForm()
    form.submit(payload)
    expect(form.hasErrors).toBe(true)
  })

  it('should accept valid payloads', () => {
    const queries = ['John', 'John Adams', 'A1409AE', 'a1409ae']
    const scopes = [undefined, 'prison', 'global']
    scopes.forEach(scope => {
      queries.forEach((query, index) => {
        const form = new PrisonerSearchForm()
        const page = index + 1
        form.submit({ q: query, page: page.toString(), scope })

        expect(form.hasErrors).toBe(false)
        expect(form.fields.q.value).toEqual(query)
        expect(form.fields.page.value).toEqual(page)
        expect(form.fields.scope.value).toEqual(scope ?? 'prison')

        // sorting defaults to ascending by last name
        expect(form.fields.sort.value).toEqual('lastName')
        expect(form.fields.order.value).toEqual('ASC')
      })
    })
  })

  it('should accept various sorting options', () => {
    sortOptions.forEach(sort => {
      orderOptions.forEach(order => {
        const payload = {
          q: 'A1234BC',
          page: '1',
          sort,
          order,
        }
        const form = new PrisonerSearchForm()
        form.submit(payload)
        expect(form.hasErrors).toBe(false)
        expect(form.fields.sort.value).toEqual(sort)
        expect(form.fields.order.value).toEqual(order)
      })
    })
  })

  it('should trim whitespace from query', () => {
    const form = new PrisonerSearchForm()
    form.submit({ q: 'A1234AA ', page: '1' })
    expect(form.hasErrors).toBe(false)
    expect(form.fields.q.value).toEqual('A1234AA')
  })
})
