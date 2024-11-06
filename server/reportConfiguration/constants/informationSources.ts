// Generated with ./scripts/importDpsConstants.ts at 2024-11-06T10:46:40.442Z

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
