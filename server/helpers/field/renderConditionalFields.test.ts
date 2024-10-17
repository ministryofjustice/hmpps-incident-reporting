import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import nunjucksSetup from '../../utils/nunjucksSetup'
import * as utils from '../../utils/utils'
import renderConditionalFields, { type FieldEntry } from './renderConditionalFields'

jest.mock('../../utils/utils')

const req = {
  services: {},
} as unknown as FormWizard.Request

describe('Field helpers', () => {
  describe('#renderConditionalFields()', () => {
    beforeAll(() => {
      nunjucksSetup(express())
    })

    beforeEach(() => {
      const mockedUtils = utils as unknown as jest.Mocked<typeof utils>
      mockedUtils.getComponentString.mockImplementation(macroName => macroName)
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    describe("when field doesn't contain items", () => {
      it('should return the original field as object', () => {
        const field: FieldEntry = ['court', { name: 'court' }]
        const response = renderConditionalFields(req, field, [field])

        expect(response).toEqual(['court', { name: 'court' }])
      })
    })

    describe('when field contains items', () => {
      describe('when conditional is a string', () => {
        describe('when field exists', () => {
          const field: FieldEntry = [
            'field',
            {
              name: 'field',
              items: [
                {
                  value: '31b90233-7043-4633-8055-f24854545ead',
                  label: 'Item one',
                  conditional: 'conditional_field_one',
                },
                {
                  value: '31b90233-7043-4633-8055-f24854545eac',
                  label: 'Item two',
                  conditional: 'conditional_field_two',
                },
              ],
            },
          ]
          const fields: FieldEntry[] = [
            field,
            [
              'conditional_field_one',
              {
                component: 'govukInput',
              },
            ],
            [
              'conditional_field_two',
              {
                component: 'govukTextarea',
              },
            ],
          ]
          let response: ReturnType<typeof renderConditionalFields>

          beforeEach(() => {
            response = renderConditionalFields(req, field, fields)
          })

          it('should render conditional content', () => {
            expect((response[1] as FormWizard.Field).items).toEqual([
              {
                value: '31b90233-7043-4633-8055-f24854545ead',
                text: 'Item one',
                conditional: {
                  html: 'govukInput',
                },
              },
              {
                value: '31b90233-7043-4633-8055-f24854545eac',
                text: 'Item two',
                conditional: {
                  html: 'govukTextarea',
                },
              },
            ])
          })
        })

        describe('when field doesn’t exist', () => {
          const field: FieldEntry = [
            'field',
            {
              name: 'field',
              items: [
                {
                  value: '31b90233-7043-4633-8055-f24854545ead',
                  label: 'Item one',
                  conditional: 'doesnotexist',
                },
              ],
            },
          ]
          let response: ReturnType<typeof renderConditionalFields>

          beforeEach(() => {
            response = renderConditionalFields(req, field, [field])
          })

          it('should render original item', () => {
            expect((response[1] as FormWizard.Field).items).toEqual([
              {
                value: '31b90233-7043-4633-8055-f24854545ead',
                text: 'Item one',
                conditional: 'doesnotexist',
              },
            ])
          })
        })
      })

      describe('when conditional is not a string ', () => {
        const field: FieldEntry = [
          'field',
          {
            name: 'field',
            items: [
              {
                value: '31b90233-7043-4633-8055-f24854545ead',
                label: 'Item one',
                conditional: {
                  html: '<strong>HTML</strong> content',
                },
              },
            ],
          },
        ]
        let response: ReturnType<typeof renderConditionalFields>

        beforeEach(() => {
          response = renderConditionalFields(req, field, [field])
        })

        it('should render conditional content', () => {
          expect((response[1] as FormWizard.Field).items).toEqual([
            {
              value: '31b90233-7043-4633-8055-f24854545ead',
              text: 'Item one',
              conditional: {
                html: '<strong>HTML</strong> content',
              },
            },
          ])
        })
      })

      describe('when conditional is an array', () => {
        const field: FieldEntry = [
          'field',
          {
            name: 'field',
            items: [
              {
                value: '31b90233-7043-4633-8055-f24854545ead',
                label: 'Item one',
                conditional: ['conditional_field_one', 'conditional_field_two', 'unknown_field'],
              },
              {
                value: '31b90233-7043-4633-8055-f24854545eac',
                label: 'Item two',
              },
            ],
          },
        ]
        const fields: FieldEntry[] = [
          field,
          [
            'conditional_field_one',
            {
              component: 'govukInput',
            },
          ],
          [
            'conditional_field_two',
            {
              component: 'govukTextarea',
            },
          ],
        ]
        let response: ReturnType<typeof renderConditionalFields>

        beforeEach(() => {
          response = renderConditionalFields(req, field, fields)
        })

        it('should render conditional content', () => {
          expect((response[1] as FormWizard.Field).items).toEqual([
            {
              value: '31b90233-7043-4633-8055-f24854545ead',
              text: 'Item one',
              conditional: {
                html: 'govukInputgovukTextarea',
              },
            },
            {
              value: '31b90233-7043-4633-8055-f24854545eac',
              text: 'Item two',
            },
          ])
        })
      })
    })
  })
})
