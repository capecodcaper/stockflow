// Shared UI pieces used across multiple Reports tabs.

/** Visual progress bar used in breakdowns. */
export function BarFill({ value, max, color = 'bg-indigo-500' }) {
  const width = max > 0 ? Math.max(2, (value / max) * 100) : 0
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${width}%` }} />
    </div>
  )
}

/** Stat card with icon, label, big value, and optional subtitle. */
export function StatCard({ icon: Icon, label, value, sub, color = 'text-indigo-600 dark:text-indigo-400', bgColor = 'bg-indigo-50 dark:bg-indigo-900/30' }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
          <p className={`text-xl lg:text-2xl font-bold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${bgColor} flex-shrink-0 ml-3`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  )
}

/** Section wrapper with title bar and icon. */
export function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 lg:px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-4 lg:p-5">{children}</div>
    </div>
  )
}
