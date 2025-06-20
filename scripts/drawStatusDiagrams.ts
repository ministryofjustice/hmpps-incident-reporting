#!/usr/bin/env npx tsx
import fs from 'node:fs'
import path from 'node:path'

import { getStatusDetails, workLists } from '../server/reportConfiguration/constants'
import {
  type Transitions,
  prisonReportTransitions,
  pecsReportTransitions,
} from '../server/middleware/permissions/statusTransitions'
import { printText } from './utils'
import { userActions } from '../server/middleware/permissions/userActions'
import { userTypes } from '../server/middleware/permissions/userType'

const outputDir = path.resolve(__dirname, '../dist/status-diagrams')

function main(): void {
  fs.mkdirSync(outputDir, { recursive: true })

  const statusNodes = drawWorkListNodes()

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
                if (action === 'close') {
                  colour = 'darkgreen'
                } else if (userType === 'dataWarden') {
                  colour = 'blue'
                } else if (userType === 'reportingOfficer') {
                  colour = 'purple'
                } else {
                  colour = 'red'
                }
                return `
                  ${originStatus} -> ${targetStatus} [label="${actionDescription}" color="${colour}"]
                `
              })
              .join('\n')
          })
          .join('\n')
        const graph = `
          digraph Statuses {
            label="${userDescription} actions on ${reportLocation} reports"
            fontname="Helvetica,Arial,sans-serif"
            fontsize=16
            node [shape="Mrecord" fontname="Helvetica,Arial,sans-serif" fontsize=14]
            edge [fontname="Helvetica,Arial,sans-serif" fontsize=12]
            rankdir="LR"
            ranksep="3.0"

            ${statusNodes}
            ${transitionEdges}
          }
        `.trim()
        const filePath = path.join(outputDir, `${reportLocation}-${userType}.dot`)
        fs.writeFileSync(filePath, graph)
        printText(
          `Written status transition diagram for ${reportLocation} reports to ${path.relative(process.cwd(), filePath)}`,
        )
      })
  })
}

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
