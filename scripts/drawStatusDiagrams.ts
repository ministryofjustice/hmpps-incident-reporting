#!/usr/bin/env npx tsx
import fs from 'node:fs'
import path from 'node:path'

import { getStatusDetails, workLists } from '../server/reportConfiguration/constants'
import {
  type Transitions,
  prisonReportTransitions,
  pecsReportTransitions,
  userActions,
  userTypes,
} from '../server/middleware/permissions'
import { printText, red } from './utils'

const outputDir = path.resolve(__dirname, '../dist/status-diagrams')

function main(): void {
  printText('Drawing diagrams for report status transitions…')
  printText(red('NB: some diagrams are unreadable'))

  fs.mkdirSync(outputDir, { recursive: true })

  Object.entries({
    prison: prisonReportTransitions,
    PECS: pecsReportTransitions,
  }).forEach(([reportLocation, transitions]: [string, Transitions]) => {
    userTypes
      .map(userType => ({
        userType: userType.code,
        userDescription: userType.description,
        actions: transitions[userType.code],
      }))
      .filter(({ actions }) => actions)
      .forEach(({ userType, userDescription, actions }) => {
        const transitionEdges = Object.entries(actions)
          .map(([originStatus, allowedActions]) => {
            return Object.entries(allowedActions)
              .map(([action, { newStatus }]) => {
                const targetStatus = newStatus ?? originStatus
                const actionDescription = userActions.find(a => a.code === action).description
                let colour: string
                if (action === 'close' || action === 'requestReview') {
                  colour = 'forestgreen'
                } else if (userType === 'DATA_WARDEN') {
                  colour = 'dodgerblue'
                } else if (userType === 'REPORTING_OFFICER') {
                  colour = 'purple'
                } else {
                  // if red comes up, something is misconfigured
                  colour = 'red'
                }
                return `
                  ${originStatus} -> ${targetStatus} [label="${actionDescription}" color="${colour}"]
                `
              })
              .join('\n')
          })
          .join('\n')

        const title = `${userDescription} actions on ${reportLocation} reports`
        const graph = `
          digraph Statuses {
            label="${title}"
            fontname="Helvetica,Arial,sans-serif"
            fontsize=16
            node [shape="Mrecord" fontname="Helvetica,Arial,sans-serif" fontsize=14]
            edge [fontname="Helvetica,Arial,sans-serif" fontsize=12]
            rankdir="LR"
            ranksep="3.0"

            ${drawWorkListNodes()}
            ${transitionEdges}
          }
        `.trim()

        const filePath = path.join(outputDir, `${reportLocation}-${userType}.dot`)
        fs.writeFileSync(filePath, graph)
        printText(`Saved “${title}” to ${path.relative(process.cwd(), filePath)}`)
      })
  })
}

/** Status nodes grouped by work list */
function drawWorkListNodes(): string {
  return workLists
    .map((workList, index) => {
      const statuses = workList.statuses
        .map(getStatusDetails)
        .map(status => {
          return `
          ${status.code} [label = "${status.description}"]
          `
        })
        .join('')
      return `
    subgraph cluster${index} {
      label="${workList.description}"
      style="rounded"
      ${statuses}
    }
    `
    })
    .join('\n')
}

if (require.main === module) {
  main()
}
