import { typeFamilies } from './typeFamilies'
import { type Type, type TypeDetails, types } from './types'

/** Returns the list of types for a type family */
export function typesForFamily(typeFamily: string): Type[] | undefined {
  return familyToTypesMapping[typeFamily]
}

const familyToTypesMapping = Object.fromEntries(
  Object.values(typeFamilies).map(({ code: familyCode }) => [
    familyCode,
    (Object.entries(types) as [Type, TypeDetails][])
      .filter(([, { familyCode: someFamilyCode }]) => someFamilyCode === familyCode)
      .map(([typeCode]) => typeCode),
  ]),
)
