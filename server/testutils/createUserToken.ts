import jwt from 'jsonwebtoken'

import type { AuthToken } from '../services/userService'

export default function createUserToken(roles: string[]) {
  const authorities = roles.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`))
  const payload: AuthToken = {
    user_name: 'user1',
    scope: ['read', 'write'],
    auth_source: 'nomis',
    authorities,
    jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
    client_id: 'clientid',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}
