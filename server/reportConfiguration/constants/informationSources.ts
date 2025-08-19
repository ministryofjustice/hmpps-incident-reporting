// Generated with ./scripts/importDpsConstants.ts at 2025-08-19T16:38:57.926Z

/** Whether the report was first created in DPS or NOMIS */
export const informationSources = [
  { code: 'DPS', description: 'DPS' },
  { code: 'NOMIS', description: 'NOMIS' },
] as const

/** Whether the report was first created in DPS or NOMIS */
type InformationSourceDetails = (typeof informationSources)[number]

/** Codes for whether the report was first created in dps or nomis */
export type InformationSource = InformationSourceDetails['code']

/** Code to description mapping for whether the report was first created in dps or nomis */
export const informationSourcesDescriptions: Record<InformationSource, string> = {
  DPS: 'DPS',
  NOMIS: 'NOMIS',
}

/** Lookup for whether the report was first created in dps or nomis */
export function getInformationSourceDetails(code: string): InformationSourceDetails | null {
  return informationSources.find(item => item.code === code) ?? null
}
