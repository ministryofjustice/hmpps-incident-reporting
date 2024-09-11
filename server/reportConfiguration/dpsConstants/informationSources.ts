// Generated with ./scripts/importDpsConstants.ts 2024-09-11T10:04:08.780Z

export const informationSources = [
  /** DPS */
  'DPS',
  /** NOMIS */
  'NOMIS',
] as const

export type InformationSource = (typeof informationSources)[number]
