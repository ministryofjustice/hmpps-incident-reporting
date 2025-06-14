import {
  type GovukErrorSummaryItem,
  type GovukRadiosItem,
  type GovukSelectItem,
  findFieldInGovukErrorSummary,
  govukSelectInsertDefault,
  govukSelectSetSelected,
  govukCheckedItems,
  govukMultipleCheckedItems,
  govukCheckedItemsConditional,
  govukCheckedItemsDivider,
} from './govukFrontend'
import { buildArray } from './utils'

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

describe('govukCheckedItems and govukMultipleCheckedItems', () => {
  const items: GovukRadiosItem[] = [
    { text: 'A', value: 'a' },
    { text: 'B', value: 'b' },
    { text: 'C', value: 'c' },
  ]

  it('should mark a single item as checked', () => {
    expect(govukCheckedItems(items, 'b')).toEqual([
      { text: 'A', value: 'a', checked: false },
      { text: 'B', value: 'b', checked: true },
      { text: 'C', value: 'c', checked: false },
    ])
  })

  it('should mark a multiple items as checked', () => {
    expect(govukMultipleCheckedItems(items, ['b', 'c'])).toEqual([
      { text: 'A', value: 'a', checked: false },
      { text: 'B', value: 'b', checked: true },
      { text: 'C', value: 'c', checked: true },
    ])
  })

  it('should mark no items as checked when none match single value', () => {
    expect(govukCheckedItems(items, undefined)).toEqual([
      { text: 'A', value: 'a', checked: false },
      { text: 'B', value: 'b', checked: false },
      { text: 'C', value: 'c', checked: false },
    ])

    expect(govukCheckedItems(items, 'x')).toEqual([
      { text: 'A', value: 'a', checked: false },
      { text: 'B', value: 'b', checked: false },
      { text: 'C', value: 'c', checked: false },
    ])
  })

  it('should throw an error when govukMultipleCheckedItems is not called with an Array nor undefined', () => {
    expect(() => {
      // NOTE: Tricking the typecheck so that function can be invoked with a string
      govukMultipleCheckedItems(items, 'A' as unknown as string[])
    }).toThrow('govukMultipleCheckedItems: multipleValues argument must be an Array or undefined')
  })

  it('should mark no items as checked when none match multiple values', () => {
    expect(govukMultipleCheckedItems(items, undefined)).toEqual([
      { text: 'A', value: 'a', checked: false },
      { text: 'B', value: 'b', checked: false },
      { text: 'C', value: 'c', checked: false },
    ])
    expect(govukMultipleCheckedItems(items, [])).toEqual([
      { text: 'A', value: 'a', checked: false },
      { text: 'B', value: 'b', checked: false },
      { text: 'C', value: 'c', checked: false },
    ])
    expect(govukMultipleCheckedItems(items, ['x'])).toEqual([
      { text: 'A', value: 'a', checked: false },
      { text: 'B', value: 'b', checked: false },
      { text: 'C', value: 'c', checked: false },
    ])
  })

  it('should leave dividers alone', () => {
    const itemsWithDivider: GovukRadiosItem[] = [
      { text: 'A', value: 'a' },
      { divider: 'or' },
      { text: 'B', value: 'b' },
    ]
    expect(govukCheckedItems(itemsWithDivider, 'a').at(1)).toStrictEqual({ divider: 'or' })
    expect(govukMultipleCheckedItems(itemsWithDivider, ['a', 'b']).at(1)).toStrictEqual({ divider: 'or' })
  })
})

describe('govukCheckedItemsConditional', () => {
  const items: GovukRadiosItem[] = [
    { text: 'A', value: 'a' },
    { text: 'B', value: 'b' },
    { text: 'C', value: 'c' },
  ]

  it.each([undefined, null, {}])('should ignore %p conditional', conditional => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(govukCheckedItemsConditional(items, conditional as any)).toStrictEqual(items)
  })

  it('should add conditional html property to item matching by value', () => {
    expect(govukCheckedItemsConditional(items, { value: 'b', html: '<strong>info</strong>' })).toStrictEqual<
      GovukRadiosItem[]
    >([
      { text: 'A', value: 'a' },
      { text: 'B', value: 'b', conditional: { html: '<strong>info</strong>' } },
      { text: 'C', value: 'c' },
    ])
  })

  it('should append content if item already has conditional html', () => {
    const itemsWithConditionalHtml: GovukRadiosItem[] = [
      { text: 'A', value: 'a', conditional: { html: 'Comment on A' } },
      { text: 'B', value: 'b', conditional: { html: 'Comment on B' } },
    ]
    expect(
      govukCheckedItemsConditional(itemsWithConditionalHtml, { value: 'b', html: '<strong>info</strong>' }),
    ).toStrictEqual<GovukRadiosItem[]>([
      { text: 'A', value: 'a', conditional: { html: 'Comment on A' } },
      { text: 'B', value: 'b', conditional: { html: 'Comment on B<strong>info</strong>' } },
    ])
  })

  it('should not add conditional html property if no items match by value', () => {
    expect(govukCheckedItemsConditional(items, { value: 'd', html: '<strong>info</strong>' })).toStrictEqual(items)
  })
})

describe('govukCheckedItemsDivider', () => {
  function makeItems(length: number): GovukRadiosItem[] {
    return buildArray(length, i => ({ text: i.toString(), value: i.toString() }))
  }

  it('should leave short items lists alone', () => {
    const items = makeItems(3)
    expect(govukCheckedItemsDivider(items)).toStrictEqual(items)
  })

  it('should add a divider to long items lists', () => {
    const items = makeItems(5)
    const newItems = govukCheckedItemsDivider(items)
    expect(newItems).toHaveLength(6)
    expect(newItems.at(-2)).toStrictEqual({ divider: 'or' })
  })

  it('should be customisable', () => {
    const items = makeItems(3)
    const newItems = govukCheckedItemsDivider(items, 2, 'neu')
    expect(newItems).toHaveLength(4)
    expect(newItems.at(-2)).toStrictEqual({ divider: 'neu' })
  })
})

describe('govukSelectInsertDefault', () => {
  it.each([undefined, null])('should ignore item list %p', list => {
    expect(govukSelectInsertDefault(list, 'Select an option…')).toStrictEqual(list)
  })

  it('should insert a blank item at the beginning', () => {
    const list: GovukSelectItem[] = [{ text: 'Red' }, { text: 'Blue', value: 'blue' }]
    const newList = govukSelectInsertDefault(list, 'Select an option…')
    expect(newList).toHaveLength(3)
    expect(newList[0]).toStrictEqual<GovukSelectItem>({ text: 'Select an option…', value: '', selected: true })
  })

  it('should insert a blank item into an empty list', () => {
    const list: GovukSelectItem[] = []
    const newList = govukSelectInsertDefault(list, 'Choose one')
    expect(newList).toHaveLength(1)
    expect(newList[0]).toStrictEqual<GovukSelectItem>({ text: 'Choose one', value: '', selected: true })
  })
})

describe('govukSelectSetSelected', () => {
  it.each([undefined, null])('should ignore item list %p', list => {
    expect(govukSelectSetSelected(list, 'red')).toStrictEqual(list)
  })

  it('should only leave `selected` as true for item that is found by-value', () => {
    const list: GovukSelectItem[] = [
      { text: 'Red', value: 'red' },
      { text: 'Blue', value: 'blue' },
    ]
    const newList = govukSelectSetSelected(list, 'blue')
    expect(newList).toHaveLength(2)
    expect(newList.map(item => item.selected)).toStrictEqual([false, true])
  })

  it('should set `selected` of all items to false if item is not found by-value', () => {
    const list: GovukSelectItem[] = [
      { text: 'Red', value: 'red' },
      { text: 'Blue', value: 'blue' },
    ]
    const newList = govukSelectSetSelected(list, 'green')
    expect(newList).toHaveLength(2)
    expect(newList.map(item => item.selected)).toStrictEqual([false, false])
  })

  it('should NOT set `selected` on any items if value being selected is undefined', () => {
    const list: GovukSelectItem[] = [
      { text: 'Red', value: 'red' },
      { text: 'Blue', value: 'blue' },
    ]
    const newList = govukSelectSetSelected(list, undefined)
    expect(newList).toHaveLength(2)
    expect(newList.map(item => item.selected)).toStrictEqual([undefined, undefined])
  })

  it('should fall back to matching on `text` property if item `value` is not set', () => {
    const list: GovukSelectItem[] = [{ text: 'Red' }, { text: 'Blue' }]
    const newList = govukSelectSetSelected(list, 'Blue')
    expect(newList).toHaveLength(2)
    expect(newList.map(item => item.selected)).toStrictEqual([false, true])
  })
})
