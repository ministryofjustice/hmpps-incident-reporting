import { unauthorisedUser, user as reportingUser, approverUser, hqUser } from '../routes/testutils/appSetup'
import { Permissions } from './permissions'

describe('Permissions middleware', () => {
  it.each([
    { action: 'deny' as const, userType: 'missing user', user: undefined },
    { action: 'deny' as const, userType: 'user without roles', user: unauthorisedUser },
    { action: 'grant' as const, userType: 'reporting officer', user: reportingUser },
    { action: 'grant' as const, userType: 'data warden', user: approverUser },
    { action: 'grant' as const, userType: 'HQ read-only user', user: hqUser },
  ])('should $action access to the home page for $userType', ({ action, user }) => {
    const permissions = new Permissions(user)
    if (action === 'grant') {
      expect(permissions.canAccessHomePage).toBeTruthy()
    } else if (action === 'deny') {
      expect(permissions.canAccessHomePage).toBeFalsy()
    } else {
      throw new Error('not implemented')
    }
  })
})
