#!/usr/bin/env npx tsx

/*
Generates the JSON payload required by Prison API to update an incident type configuration in NOMIS.

Usage:
  ./scripts/buildNomisIncidentTypePayload.ts <dpsTypeCode>

Where <dpsTypeCode> is one of the codes from server/reportConfiguration/constants/types.ts
  e.g. DIRTY_PROTEST_1, ASSAULT_5, FIND_6, ...

It prints to stdout the JSON body you can use with:
  PUT ${HMPPS_PRISON_API_URL}/incidents/configuration/<NOMIS_CODE>
*/

import { printText } from './utils'
import { types } from '../server/reportConfiguration/constants'
import { getIncidentTypeConfiguration } from '../server/reportConfiguration/types'
import type {
  IncidentTypeConfiguration as DpsIncidentTypeConfiguration,
  QuestionConfiguration as DpsQuestionConfiguration,
  AnswerConfiguration as DpsAnswerConfiguration,
} from '../server/data/incidentTypeConfiguration/types'

interface Arguments {
  scriptName: string
  dpsTypeCode: string
}

main()

async function main() {
  const { scriptName, dpsTypeCode } = parseArgs()

  const typeMeta = types.find(t => t.code === dpsTypeCode)
  if (!typeMeta) {
    printText(`Type '${dpsTypeCode}' not found in server/reportConfiguration/constants/types.ts`)
    printHelpAndExit(scriptName)
    return
  }

  const dpsConfig = await getIncidentTypeConfiguration(dpsTypeCode)
  const payload = toPrisonApiUpdatePayload({ dpsConfig, description: typeMeta.description, active: typeMeta.active })

  // Helpful info for the caller
  printText(`Endpoint: PUT {HMPPS_PRISON_API_URL}/incidents/configuration/${typeMeta.nomisCode}`)
  printText(JSON.stringify(payload, null, 2))
}

function toPrisonApiUpdatePayload({
  dpsConfig,
  description,
  active,
}: {
  dpsConfig: DpsIncidentTypeConfiguration
  description: string
  active: boolean
}) {
  const orderedQuestions = orderQuestionsByFlow(dpsConfig)
  const questionsArray = orderedQuestions.map(q => ({
    code: q.code,
    active: q.active,
    question: q.question,
    multipleAnswers: q.multipleAnswers,
    answers: q.answers.slice().map(ans => ({
      code: ans.code,
      response: ans.response,
      active: ans.active,
      commentRequired: ans.commentRequired,
      dateRequired: ans.dateRequired,
      nextQuestionCode: ans.nextQuestionCode,
    })),
  }))

  return {
    incidentTypeDescription: description,
    active,
    questions: questionsArray,
    prisonerRoles: dpsConfig.prisonerRoles.map(pr => ({
      prisonerRole: pr.prisonerRole,
      onlyOneAllowed: pr.onlyOneAllowed,
      active: pr.active,
    })),
  }
}

/**
 * Orders questions to match the order a user would typically be presented with:
 * - Start at the configured startingQuestionCode
 * - Follow nextQuestionCode links from answers (preserving the order of answers)
 * - Avoid revisiting questions (handles cycles)
 * - Append any remaining questions not reachable from the start in a stable order
 */
function orderQuestionsByFlow(dpsConfig: DpsIncidentTypeConfiguration): DpsQuestionConfiguration[] {
  const questionsByCode = dpsConfig.questions
  const visited = new Set<string>()
  const orderedCodes: string[] = []

  const dfs = (code: string | null | undefined) => {
    if (!code) return
    const q = questionsByCode[code]
    if (!q) return
    if (visited.has(code)) return
    visited.add(code)
    orderedCodes.push(code)

    // Determine the next questions from the current question's ACTIVE answers, preserving answer order
    const seenNext = new Set<string>()
    q.answers.forEach(ans => {
      if (!ans.active) return
      const next = ans.nextQuestionCode
      if (!next) return
      if (!questionsByCode[next]) return
      if (seenNext.has(next)) return
      seenNext.add(next)
      dfs(next)
    })
  }

  // Traverse from the configured starting question
  dfs(dpsConfig.startingQuestionCode)

  // Append any remaining questions (unreachable from start) in a stable order
  const remaining = Object.keys(questionsByCode).filter(code => !visited.has(code))
  const compareCodes = (a: string, b: string) => {
    const ai = parseInt(a, 10)
    const bi = parseInt(b, 10)
    if (!Number.isNaN(ai) && !Number.isNaN(bi)) return ai - bi
    return a.localeCompare(b)
  }
  remaining.sort(compareCodes)

  const finalCodes = [...orderedCodes, ...remaining]
  return finalCodes.map(code => questionsByCode[code]).filter(Boolean)
}

function parseArgs(): Arguments {
  const [, fullPath, dpsTypeCode] = process.argv
  const scriptName = `./scripts/${fullPath?.split('/').pop()}`
  if (!dpsTypeCode) {
    printHelpAndExit(scriptName)
  }
  return { scriptName, dpsTypeCode }
}

function printHelpAndExit(scriptName: string): never {
  const help = `
Generate Prison API update JSON for a given DPS incident type.

Usage:
  ${scriptName} <dpsTypeCode>

Example:
  ${scriptName} DIRTY_PROTEST_1
`
  printText(help.trim())
  process.exit(1)
}
