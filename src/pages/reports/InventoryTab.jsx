import { DollarSign, TrendingUp, Package, PieChart, Layers, Clock, AlertTriangle } from 'lucide-react'
import { currency } from '../../utils/helpers'
import { getStatusDotColor } from '../../utils/helpers'
import { StatCard, Section, BarFill } from './ReportWidgets'

export default function InventoryTab({ data }) {
  const maxCatUnits = Math.max(...Object.values(data.byCategory).map(c => c.units), 1)
  const maxStatusUnits = Math.max(...Object.values(data.byStatus).map(s => s.units), 1)

  return (
    <div className="space-y-5">
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard icon={Package} label="Total Products" value={data.totalUnits}
          sub={`${Object.keys(data.byCategory).length} categories`}
          color="text-blue-600 dark:text-blue-400" bgColor="bg-blue-50 dark:bg-blue-900/30"
        />
        <StatCard icon={DollarSign} label="Total Invested" value={currency(data.totalInvested)}
          sub="Cost of all inventory"
        />
        <StatCard icon={Layers} label="Unsold Stock" value={`${data.unsoldUnits} units`}
          sub={`${currency(data.unsoldValue)} tied up`}
          color="text-amber-600 dark:text-amber-400" bgColor="bg-amber-50 dark:bg-amber-900/30"
        />
        <StatCard icon={TrendingUp} label="Potential Revenue" value={currency(data.potentialRevenue)}
          sub="If all sells at listing price"
          color="text-emerald-600 dark:text-emerald-400" bgColor="bg-emerald-50 dark:bg-emerald-900/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By category */}
        <Section title="Breakdown by Category" icon={PieChart}>
          <div className="space-y-4">
            {Object.entries(data.byCategory)
              .sort(([, a], [, b]) => b.units - a.units)
              .map(([cat, d]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-900 dark:text-white">{cat}</span>
                    <div className="flex gap-3 text-gray-500 dark:text-gray-400">
                      <span>{d.units} units</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{currency(d.invested)}</span>
                    </div>
                  </div>
                  <BarFill value={d.units} max={maxCatUnits} color="bg-indigo-500" />
                  <div className="flex gap-4 mt-1 text-xs text-gray-400">
                    <span>{d.count} product{d.count !== 1 ? 's' : ''}</span>
                    <span>{d.sold} sold</span>
                    <span>{d.units - d.sold} remaining</span>
                  </div>
                </div>
              ))}
          </div>
        </Section>

        {/* By status */}
        <Section title="Breakdown by Status" icon={Layers}>
          <div className="space-y-4">
            {Object.entries(data.byStatus)
              .sort(([, a], [, b]) => b.units - a.units)
              .map(([status, d]) => (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(status)}`} />
                      <span className="font-medium text-gray-900 dark:text-white">{status}</span>
                    </div>
                    <div className="flex gap-3 text-gray-500 dark:text-gray-400">
                      <span>{d.units} unit{d.units !== 1 ? 's' : ''}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{currency(d.value)}</span>
                    </div>
                  </div>
                  <BarFill value={d.units} max={maxStatusUnits} color={getStatusDotColor(status)} />
                </div>
              ))}
          </div>
        </Section>
      </div>

      {/* Inventory aging */}
      <Section title="Inventory Aging — How Long Stock Has Been Sitting" icon={Clock}>
        <div className="space-y-4">
          {Object.entries(data.agingBuckets).map(([bucket, items]) => {
            const totalValue = items.reduce((s, i) => s + i.investedValue, 0)
            const totalUnits = items.reduce((s, i) => s + i.remaining, 0)
            return (
              <div key={bucket}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{bucket}</span>
                  <div className="flex gap-3 text-gray-500 dark:text-gray-400">
                    <span>{totalUnits} unit{totalUnits !== 1 ? 's' : ''}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{currency(totalValue)}</span>
                  </div>
                </div>
                {items.length > 0 ? (
                  <div className="ml-2 space-y-1.5">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-xs py-1.5 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="min-w-0">
                          <span className="font-medium text-gray-700 dark:text-gray-300 truncate block">{item.name}</span>
                          <span className="text-gray-400">{item.remaining} unit{item.remaining !== 1 ? 's' : ''} · {item.daysHeld} days</span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 font-medium ml-3 flex-shrink-0">{currency(item.investedValue)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 ml-2">No items</p>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      {/* Slow movers alert */}
      {data.aging.filter(p => p.daysHeld > 30 && p.status === 'Listed').length > 0 && (
        <Section title="Slow Movers — Listed Over 30 Days" icon={AlertTriangle}>
          <p className="text-xs text-gray-400 mb-3">These items have been listed for over 30 days without selling. Consider lowering the price or trying a different platform.</p>
          <div className="space-y-2">
            {data.aging
              .filter(p => p.daysHeld > 30 && p.status === 'Listed')
              .map(item => (
                <div key={item.id} className="flex items-center justify-between py-2.5 px-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Listed {item.daysHeld} days ago · {item.platform || 'No platform'} · Listing: {currency(item.listingPrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 flex-shrink-0 ml-3">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-medium">{item.daysHeld}d</span>
                  </div>
                </div>
              ))}
          </div>
        </Section>
      )}
    </div>
  )
}
