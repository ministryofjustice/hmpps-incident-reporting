import type { Request } from 'express'

/**
 * Form wizard helper to get URL of previous step
 */
// eslint-disable-next-line import/prefer-default-export
export function backUrl(
  req: Request,
  { fallbackUrl, nextStepUrl = '' }: { fallbackUrl: string; nextStepUrl?: string },
): string {
  let backLink
  const { referrerUrl } = req.session

  // Go back to the last page unless we already got here by clicking back from the next step
  if (!referrerUrl?.endsWith(nextStepUrl)) {
    backLink = referrerUrl
  }

  return backLink || fallbackUrl
}
