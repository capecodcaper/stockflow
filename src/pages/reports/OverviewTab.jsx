import { DollarSign, TrendingUp, Package, ShoppingCart, BarChart3, Award, Calendar } from 'lucide-react'
import { currency, pct } from '../../utils/helpers'
import { StatCard, Section, BarFill } from './ReportWidgets'

export default function OverviewTab({ data }) {
  return (
    <div className="space-y-5">
      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard icon={DollarSign} label="Net Profit" value={currency(data.netProfit)}
          sub={`${pct(data.profitMargin)} margin`}
          color={data.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}
          bgColor={data.netProfit >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-red-50 dark:bg-red-900/30'}
        />
        <StatCard icon={TrendingUp} label="Total Revenue" value={currency(data.totalRevenue)}
          sub={`${data.salesWithProfit.length} sales`}
        />
        <StatCard icon={Package} label="In Stock" value={`${data.unsoldUnits} units`}
          sub={`${currency(data.unsoldValue)} invested`}
          color="text-blue-600 dark:text-blue-400" bgColor="bg-blue-50 dark:bg-blue-900/30"
        />
        <StatCard icon={ShoppingCart} label="Sell-Through" value={pct(data.sellThrough)}
          sub={`${data.totalSoldUnits} of ${data.totalUnits} units`}
          color="text-amber-600 dark:text-amber-400" bgColor="bg-amber-50 dark:bg-amber-900/30"
        />
      </div>

      {/* Two-column: Revenue vs Expenses + ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Revenue vs. Expenses" icon={BarChart3}>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                <span className="font-semibold text-gray-900 dark:text-white">{currency(data.totalRevenue)}</span>
              </div>
              <BarFill value={data.totalRevenue} max={Math.max(data.totalRevenue, data.totalExpenses)} color="bg-emerald-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600 dark:text-gray-400">Cost of Goods</span>
                <span className="font-semibold text-gray-900 dark:text-white">{currency(data.totalCOGS)}</span>
              </div>
              <BarFill value={data.totalCOGS} max={Math.max(data.totalRevenue, data.totalExpenses)} color="bg-red-400" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600 dark:text-gray-400">Platform Fees</span>
                <span className="font-semibold text-gray-900 dark:text-white">{currency(data.totalFees)}</span>
              </div>
              <BarFill value={data.totalFees} max={Math.max(data.totalRevenue, data.totalExpenses)} color="bg-orange-400" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-semibold text-gray-900 dark:text-white">{currency(data.totalShipping)}</span>
              </div>
              <BarFill value={data.totalShipping} max={Math.max(data.totalRevenue, data.totalExpenses)} color="bg-blue-400" />
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-900 dark:text-white">Net Profit</span>
                <span className={`font-bold ${data.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {currency(data.netProfit)}
                </span>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Quick Stats" icon={Award}>
          <div className="space-y-3">
            {[
              { label: 'Return on Investment (ROI)', value: pct(data.roi), desc: 'Profit ÷ cost of goods sold' },
              { label: 'Avg. Sale Price', value: currency(data.avgSalePrice), desc: 'Average price per unit sold' },
              { label: 'Total Invested', value: currency(data.totalInvested), desc: 'Total cost of all inventory purchased' },
              { label: 'Potential Revenue', value: currency(data.potentialRevenue), desc: 'If all remaining stock sells at listing price' },
              { label: 'Fees as % of Revenue', value: pct(data.totalRevenue > 0 ? (data.totalFees / data.totalRevenue) * 100 : 0), desc: 'How much platforms take from your sales' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white ml-4">{item.value}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Monthly trend */}
      {Object.keys(data.byMonth).length > 0 && (
        <Section title="Monthly Trend" icon={Calendar}>
          <div className="space-y-3">
            {Object.entries(data.byMonth)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([month, d]) => {
                const label = new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                const maxRev = Math.max(...Object.values(data.byMonth).map(m => m.revenue))
                return (
                  <div key={month}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                      <div className="flex gap-4">
                        <span className="text-gray-500 dark:text-gray-400">{d.count} sale{d.count !== 1 ? 's' : ''}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{currency(d.revenue)}</span>
                        <span className={`font-semibold ${d.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          {currency(d.profit)} profit
                        </span>
                      </div>
                    </div>
                    <BarFill value={d.revenue} max={maxRev} color="bg-indigo-500" />
                  </div>
                )
              })}
          </div>
        </Section>
      )}
    </div>
  )
}
