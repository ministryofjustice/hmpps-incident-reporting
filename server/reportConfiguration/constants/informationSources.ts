// Generated with ./scripts/importDpsConstants.ts at 2024-09-12T13:42:31.293Z

/** Whether the report was first created in DPS or NOMIS */
export const informationSources = [
  { code: 'DPS', description: 'DPS' },
  { code: 'NOMIS', description: 'NOMIS' },
] as const

/** Whether the report was first created in DPS or NOMIS */
export type InformationSource = (typeof informationSources)[number]['code']
