import { AgentConfig } from '@ministryofjustice/hmpps-rest-client'

const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (name in process.env) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

const auditConfig = () => {
  const auditEnabled = get('AUDIT_ENABLED', 'false') === 'true'
  return {
    enabled: auditEnabled,
    queueUrl: get(
      'AUDIT_SQS_QUEUE_URL',
      'http://localhost:4566/000000000000/mainQueue',
      auditEnabled && requiredInProduction,
    ),
    serviceName: get('AUDIT_SERVICE_NAME', 'UNASSIGNED', auditEnabled && requiredInProduction),
    region: get('AUDIT_SQS_REGION', 'eu-west-2'),
  }
}

export default {
  productId: get('PRODUCT_ID', 'UNASSIGNED', requiredInProduction),
  buildNumber: get('BUILD_NUMBER', '1_0_0', requiredInProduction),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  branchName: get('GIT_BRANCH', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  environment: process.env.ENVIRONMENT || 'local',
  production, // NB: this is true in _all_ deployed environments and when running locally in docker
  https: process.env.NO_HTTPS === 'true' ? false : production,
  staticResourceCacheDuration: '1h',
  redis: {
    enabled: get('REDIS_ENABLED', 'false', requiredInProduction) === 'true',
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsIncidentReportingApi: {
      url: get('HMPPS_INCIDENT_REPORTING_API_URL', 'http://localhost:2999', requiredInProduction),
      healthPath: '/health/ping',
      externalUrl: get(
        'HMPPS_INCIDENT_REPORTING_API_EXTERNAL_URL',
        get('HMPPS_INCIDENT_REPORTING_API_URL', 'http://localhost:2999'),
      ),
      timeout: {
        response: Number(get('HMPPS_INCIDENT_REPORTING_API_TIMEOUT_RESPONSE', 60000)),
        deadline: Number(get('HMPPS_INCIDENT_REPORTING_API_TIMEOUT_DEADLINE', 60000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_INCIDENT_REPORTING_API_TIMEOUT_RESPONSE', 60000))),
    },
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      healthPath: '/health/ping',
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    hmppsPrisonApi: {
      url: get('HMPPS_PRISON_API_URL', 'http://localhost:8080', requiredInProduction),
      healthPath: '/health/ping',
      externalUrl: get('HMPPS_PRISON_API_EXTERNAL_URL', get('HMPPS_PRISON_API_URL', 'http://localhost:8080')),
      timeout: {
        response: Number(get('HMPPS_PRISON_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_PRISON_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_PRISON_API_TIMEOUT_RESPONSE', 10000))),
    },
    manageUsersApi: {
      url: get('MANAGE_USERS_API_URL', 'http://localhost:9091', requiredInProduction),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('MANAGE_USERS_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('MANAGE_USERS_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('MANAGE_USERS_API_TIMEOUT_RESPONSE', 10000))),
    },
    offenderSearchApi: {
      url: get('OFFENDER_SEARCH_API_URL', 'http://localhost:8082', requiredInProduction),
      healthPath: '/health/ping',
      externalUrl: get('OFFENDER_SEARCH_API_EXTERNAL_URL', get('OFFENDER_SEARCH_API_URL', 'http://localhost:8082')),
      timeout: {
        response: Number(get('OFFENDER_SEARCH_API_TIMEOUT_RESPONSE', 8000)),
        deadline: Number(get('OFFENDER_SEARCH_API_TIMEOUT_DEADLINE', 8000)),
      },
      agent: new AgentConfig(Number(get('OFFENDER_SEARCH_API_TIMEOUT_RESPONSE', 8000))),
    },
    nomisUserRolesApi: {
      url: get('NOMIS_USER_ROLES_API_URL', 'http://localhost:8081', requiredInProduction),
      healthPath: '/health/ping',
      externalUrl: get('NOMIS_USER_ROLES_API_EXTERNAL_URL', get('NOMIS_USER_ROLES_API_URL', 'http://localhost:8081')),
      timeout: {
        response: Number(get('NOMIS_USER_ROLES_API_TIMEOUT_RESPONSE', 8000)),
        deadline: Number(get('NOMIS_USER_ROLES_API_TIMEOUT_DEADLINE', 8000)),
      },
      agent: new AgentConfig(Number(get('NOMIS_USER_ROLES_API_TIMEOUT_RESPONSE', 8000))),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    frontendComponents: {
      url: get('COMPONENT_API_URL', 'http://localhost:8083', requiredInProduction),
      healthPath: '/ping',
      timeout: {
        response: Number(get('COMPONENT_API_TIMEOUT_SECONDS', 5000)),
        deadline: Number(get('COMPONENT_API_TIMEOUT_SECONDS', 5000)),
      },
      agent: new AgentConfig(Number(get('COMPONENT_API_TIMEOUT_SECONDS', 5000))),
    },
  },
  sqs: {
    audit: auditConfig(),
  },
  googleAnalyticsMeasurementId: get('GOOGLE_ANALYTICS_MEASUREMENT_ID', ''),
  loadReportDefinitionsOnStartup: get('LOAD_DPR_ON_STARTUP', 'false') === 'true',
  ingressUrl: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  dpsUrl: get('DPS_URL', 'http://dps.local', requiredInProduction),
  supportUrl: get('SUPPORT_URL', 'http://support.dps.local', requiredInProduction),
}
