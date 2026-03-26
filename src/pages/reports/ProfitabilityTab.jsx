import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3, Award } from 'lucide-react'
import { currency, pct } from '../../utils/helpers'
import { StatCard, Section, BarFill } from './ReportWidgets'

export default function ProfitabilityTab({ data }) {
  const maxProfit = Math.max(...data.topByProfit.map(s => Math.abs(s.netProfit)), 1)
  const maxPlatProfit = Math.max(...Object.values(data.byPlatform).map(p => Math.abs(p.profit)), 1)

  return (
    <div className="space-y-5">
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard icon={DollarSign} label="Net Profit" value={currency(data.netProfit)}
          color={data.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}
          bgColor={data.netProfit >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-red-50 dark:bg-red-900/30'}
        />
        <StatCard icon={TrendingUp} label="Profit Margin" value={pct(data.profitMargin)}
          sub="Revenue kept after all costs"
        />
        <StatCard icon={ArrowUpRight} label="ROI" value={pct(data.roi)}
          sub="Return on cost of goods"
          color="text-emerald-600 dark:text-emerald-400" bgColor="bg-emerald-50 dark:bg-emerald-900/30"
        />
        <StatCard icon={ArrowDownRight} label="Total Fees + Shipping" value={currency(data.totalFees + data.totalShipping)}
          sub={`${pct(data.totalRevenue > 0 ? ((data.totalFees + data.totalShipping) / data.totalRevenue) * 100 : 0)} of revenue`}
          color="text-red-500 dark:text-red-400" bgColor="bg-red-50 dark:bg-red-900/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top sales by profit */}
        <Section title="Top Sales by Profit" icon={Award}>
          {data.topByProfit.length > 0 ? (
            <div className="space-y-3">
              {data.topByProfit.slice(0, 5).map((sl, i) => (
                <div key={sl.id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                        : i === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        : i === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                        : 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                      }`}>{i + 1}</span>
                      <span className="font-medium text-gray-900 dark:text-white truncate">{sl.productName}</span>
                    </div>
                    <span className={`font-bold ml-3 flex-shrink-0 ${sl.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {currency(sl.netProfit)}
                    </span>
                  </div>
                  <BarFill value={Math.abs(sl.netProfit)} max={maxProfit} color={sl.netProfit >= 0 ? 'bg-emerald-500' : 'bg-red-400'} />
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    <span>Sold: {currency(sl.salePrice)}</span>
                    <span>Cost: {currency(sl.costBasis)}</span>
                    <span>ROI: {pct(sl.roiPct)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No sales recorded yet</p>
          )}
        </Section>

        {/* Best ROI */}
        <Section title="Best ROI (Return on Investment)" icon={TrendingUp}>
          {data.topByROI.length > 0 ? (
            <div className="space-y-3">
              {data.topByROI.slice(0, 5).map((sl, i) => (
                <div key={sl.id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                        : i === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        : i === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                        : 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                      }`}>{i + 1}</span>
                      <span className="font-medium text-gray-900 dark:text-white truncate">{sl.productName}</span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-3 flex-shrink-0">{pct(sl.roiPct)}</span>
                  </div>
                  <BarFill value={sl.roiPct} max={Math.max(...data.topByROI.slice(0, 5).map(s => s.roiPct), 1)} color="bg-emerald-500" />
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    <span>Cost: {currency(sl.costBasis)}</span>
                    <span>Sold: {currency(sl.salePrice)}</span>
                    <span>Profit: {currency(sl.netProfit)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No sales recorded yet</p>
          )}
        </Section>
      </div>

      {/* Profit by platform */}
      <Section title="Profit by Platform" icon={BarChart3}>
        <div className="space-y-4">
          {Object.entries(data.byPlatform)
            .sort(([, a], [, b]) => b.profit - a.profit)
            .map(([plat, d]) => (
              <div key={plat}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-900 dark:text-white">{plat}</span>
                  <span className={`font-bold ${d.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                    {currency(d.profit)}
                  </span>
                </div>
                <BarFill value={Math.abs(d.profit)} max={maxPlatProfit} color={d.profit >= 0 ? 'bg-emerald-500' : 'bg-red-400'} />
                <div className="flex gap-4 mt-1 text-xs text-gray-400">
                  <span>Revenue: {currency(d.revenue)}</span>
                  <span>Fees: {currency(d.fees)}</span>
                  <span>Margin: {pct(d.revenue > 0 ? (d.profit / d.revenue) * 100 : 0)}</span>
                </div>
              </div>
            ))}
        </div>
      </Section>

      {/* Fee impact analysis */}
      <Section title="Fee Impact Analysis" icon={DollarSign}>
        <p className="text-xs text-gray-400 mb-4">See how much each platform is costing you in fees relative to revenue.</p>
        <div className="overflow-x-auto -mx-4 lg:-mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Platform</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Revenue</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fees</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fee %</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">Net Profit</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {Object.entries(data.byPlatform)
                .sort(([, a], [, b]) => b.revenue - a.revenue)
                .map(([plat, d]) => (
                  <tr key={plat} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-2.5 px-4 font-medium text-gray-900 dark:text-white">{plat}</td>
                    <td className="py-2.5 px-4 text-right text-gray-900 dark:text-white">{currency(d.revenue)}</td>
                    <td className="py-2.5 px-4 text-right text-red-500">{currency(d.fees)}</td>
                    <td className="py-2.5 px-4 text-right text-gray-500 dark:text-gray-400">{pct(d.revenue > 0 ? (d.fees / d.revenue) * 100 : 0)}</td>
                    <td className={`py-2.5 px-4 text-right font-semibold hidden sm:table-cell ${d.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {currency(d.profit)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {pct(d.revenue > 0 ? (d.profit / d.revenue) * 100 : 0)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  )
}
