import flattenConditionalFields from './flattenConditionalFields'
import type { FieldEntry } from './renderConditionalFields'

describe('Field helpers', () => {
  describe('#flattenConditionalFields()', () => {
    describe('when field does not have items', () => {
      it('should return original field', () => {
        const field: FieldEntry = ['court', { name: 'court' }]
        const response = flattenConditionalFields(field)

        expect(response).toEqual(['court', { name: 'court' }])
      })
    })

    describe('when field has items', () => {
      describe('with no conditional items', () => {
        it('should return original field', () => {
          const field: FieldEntry = [
            'court',
            {
              name: 'options-field',
              items: [
                {
                  label: 'Item one',
                  value: 'item-one',
                },
              ],
            },
          ]
          const response = flattenConditionalFields(field)

          expect(response).toEqual([
            'court',
            {
              name: 'options-field',
              items: [
                {
                  label: 'Item one',
                  value: 'item-one',
                },
              ],
            },
          ])
        })
      })

      describe('with conditional items', () => {
        describe('when conditional is a string', () => {
          it('should return original field', () => {
            const field: FieldEntry = [
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: 'conditional-one',
                  },
                ],
              },
            ]
            const response = flattenConditionalFields(field)

            expect(response).toEqual([
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: ['conditional-one'],
                  },
                ],
              },
            ])
          })
        })

        describe('when conditional is an object', () => {
          it('should flatten conditional', () => {
            const field: FieldEntry = [
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: {
                      name: 'conditional-obj',
                      id: 'conditional-obj',
                    },
                  },
                ],
              },
            ]
            const response = flattenConditionalFields(field)

            expect(response).toEqual([
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: ['conditional-obj'],
                  },
                ],
              },
            ])
          })
        })

        describe('when conditionals is an array', () => {
          it('should flatten conditionals', () => {
            const field: FieldEntry = [
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: [
                      'conditional-string',
                      {
                        name: 'conditional-obj',
                        id: 'conditional-obj',
                      },
                    ],
                  },
                ],
              },
            ]
            const response = flattenConditionalFields(field)

            expect(response).toEqual([
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: ['conditional-string', 'conditional-obj'],
                  },
                ],
              },
            ])
          })
        })
      })
    })
  })
})
