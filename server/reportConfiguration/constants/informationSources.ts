// Generated with ./scripts/importDpsConstants.ts at 2024-10-23T09:57:39.114Z

/** Whether the report was first created in DPS or NOMIS */
export const informationSources = [
  { code: 'DPS', description: 'DPS' },
  { code: 'NOMIS', description: 'NOMIS' },
] as const

/** Whether the report was first created in DPS or NOMIS */
export type InformationSourceDetails = (typeof informationSources)[number]

/** Codes for whether the report was first created in dps or nomis */
export type InformationSource = InformationSourceDetails['code']

/** Lookup for whether the report was first created in dps or nomis */
export function getInformationSourceDetails(code: string): InformationSourceDetails | null {
  return informationSources.find(item => item.code === code) ?? null
}
