import {
  defaultClient,
  DistributedTracingModes,
  getCorrelationContext,
  setup,
  type TelemetryClient,
} from 'applicationinsights'
import { RequestHandler } from 'express'
import type { ApplicationInfo } from '../applicationInfo'
import applicationInfo from '../applicationInfo'

const requestPrefixesToIgnore = ['GET /assets/', 'GET /health', 'GET /ping', 'GET /info', 'GET /metrics']
const dependencyPrefixesToIgnore = ['sqs']

let processorsRegistered = false

export function defaultName(): string {
  const { applicationName: name } = applicationInfo()
  return name
}

export function initialiseAppInsights(): void {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    if (!process.env.APPLICATIONINSIGHTS_ROLE_NAME) {
      const name = process.env.OTEL_SERVICE_NAME || defaultName()
      if (name) {
        process.env.APPLICATIONINSIGHTS_ROLE_NAME = name
        if (!process.env.OTEL_SERVICE_NAME) process.env.OTEL_SERVICE_NAME = name
      }
    }
    // eslint-disable-next-line no-console
    console.log(`Setting up App Insights with role name: ${process.env.APPLICATIONINSIGHTS_ROLE_NAME}`)

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cloudRoleProcessor(envelope: any): boolean {
  if (envelope?.tags && !envelope.tags['ai.cloud.role']) {
    const roleName = process.env.APPLICATIONINSIGHTS_ROLE_NAME || process.env.OTEL_SERVICE_NAME
    if (roleName) {
      // eslint-disable-next-line no-param-reassign
      envelope.tags['ai.cloud.role'] = roleName
    }
  }
  return true
}

export function buildAppInsightsClient(
  { applicationName, buildNumber }: ApplicationInfo,
  overrideName?: string,
): TelemetryClient | null {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    defaultClient.context.tags['ai.cloud.role'] = overrideName || applicationName
    defaultClient.context.tags['ai.application.ver'] = buildNumber

    if (!processorsRegistered) {
      defaultClient.addTelemetryProcessor(addOperationNameProcessor)
      defaultClient.addTelemetryProcessor(cloudRoleProcessor)
      defaultClient.addTelemetryProcessor(ignoredRequestsProcessor)
      defaultClient.addTelemetryProcessor(ignoredDependenciesProcessor)
      processorsRegistered = true
    }
    return defaultClient
  }
  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addOperationNameProcessor(envelope: any, contextObjects: any) {
  const operationNameOverride = contextObjects?.correlationContext?.customProperties?.getProperty('operationName')
  if (
    operationNameOverride &&
    envelope?.tags &&
    envelope?.data?.baseData &&
    typeof envelope.data.baseData === 'object'
  ) {
    /* eslint-disable no-param-reassign */
    envelope.tags['ai.operation.name'] = operationNameOverride
    envelope.data.baseData.name = operationNameOverride
    /* eslint-enable no-param-reassign */
  }
  return true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ignoredRequestsProcessor(envelope: any) {
  if (envelope?.data?.baseType !== 'RequestData') return true
  const telemetryItem = envelope.data.baseData
  return !(
    telemetryItem?.success &&
    typeof telemetryItem.name === 'string' &&
    requestPrefixesToIgnore.some(prefix => telemetryItem.name.startsWith(prefix))
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ignoredDependenciesProcessor(envelope: any) {
  if (envelope?.data?.baseType !== 'RemoteDependencyData') return true
  const telemetryItem = envelope.data.baseData
  return !(
    telemetryItem?.success &&
    typeof telemetryItem.target === 'string' &&
    dependencyPrefixesToIgnore.some(prefix => telemetryItem.target.startsWith(prefix))
  )
}

export function appInsightsMiddleware(): RequestHandler {
  return (req, res, next) => {
    res.prependOnceListener('finish', () => {
      const context = getCorrelationContext()
      if (context && req.route) {
        const path = req.route?.path
        const pathToReport = Array.isArray(path) ? `"${path.join('" | "')}"` : path
        context.customProperties.setProperty('operationName', `${req.method} ${pathToReport}`)
      }
    })
    next()
  }
}
