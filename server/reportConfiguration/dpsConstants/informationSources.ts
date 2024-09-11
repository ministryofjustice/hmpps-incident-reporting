// Generated with ./scripts/importDpsConstants.ts at 2024-09-11T16:52:03.831Z

/** Whether the report was first created in DPS or NOMIS */
export const informationSources = [
  /** DPS */
  'DPS',
  /** NOMIS */
  'NOMIS',
] as const

/** Whether the report was first created in DPS or NOMIS */
export type InformationSource = (typeof informationSources)[number]
