/**
 * Wraps localStorage.setItem, swallowing QuotaExceededError (this suite runs
 * ~10 sibling apps sharing the same origin-partitioned quota) and Safari
 * private-browsing exceptions instead of letting them propagate. Returns
 * whether the write actually succeeded, so callers can distinguish "saved"
 * from "silently discarded" instead of assuming success.
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}
