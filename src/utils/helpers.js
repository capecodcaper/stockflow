// ─── Shared Utilities ───────────────────────────────────────
// Centralized helpers used across multiple components/pages.
// Import from here instead of redefining in each file.

/**
 * Format a number as USD currency string.
 * currency(1234.5) → "$1,234.50"
 */
export function currency(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Format a number as a percentage string.
 * pct(45.678) → "45.7%"
 */
export function pct(n) {
  return (n || 0).toFixed(1) + '%'
}

/**
 * Calculate how many days ago a date string was.
 */
export function daysAgo(dateStr) {
  if (!dateStr) return 0
  const diff = Date.now() - new Date(dateStr).getTime()
  return Math.max(0, Math.floor(diff / 86400000))
}

/**
 * Status badge colors (full pill style — bg + text for light & dark).
 * Used on ProductCard, ProductDetailPanel, Inventory list rows, etc.
 */
export const statusBadgeColors = {
  Sourced: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'In Hand': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Listed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Sold: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
}

/**
 * Status dot colors (simple solid color — used in Reports charts/breakdowns).
 */
export const statusDotColors = {
  Sourced: 'bg-yellow-500',
  'In Hand': 'bg-blue-500',
  Listed: 'bg-green-500',
  Sold: 'bg-purple-500',
}

/**
 * Get the badge color classes for any status, with a fallback for custom statuses.
 */
export function getStatusBadgeColor(status) {
  return statusBadgeColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

/**
 * Get the dot color class for any status, with a fallback.
 */
export function getStatusDotColor(status) {
  return statusDotColors[status] || 'bg-gray-400'
}

/**
 * Format a date string as short display format: "1 Mar 26"
 */
export function shortDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const day = d.getDate()
  const month = d.toLocaleString('en-US', { month: 'short' })
  const year = String(d.getFullYear()).slice(2)
  return `${day} ${month} ${year}`
}
