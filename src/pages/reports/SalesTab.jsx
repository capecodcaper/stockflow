import { DollarSign, ShoppingCart, BarChart3, PieChart, Truck, MapPin } from 'lucide-react'
import { currency } from '../../utils/helpers'
import { StatCard, Section, BarFill } from './ReportWidgets'

export default function SalesTab({ data }) {
  const maxPlatRev = Math.max(...Object.values(data.byPlatform).map(p => p.revenue), 1)
  const maxCatRev = Math.max(...Object.values(data.byCategory).map(c => c.revenue), 1)

  const localRevenue = data.localSales.reduce((s, sl) => s + sl.salePrice * sl.qtySold, 0)
  const shippedRevenue = data.shippedSales.reduce((s, sl) => s + sl.salePrice * sl.qtySold, 0)

  return (
    <div className="space-y-5">
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard icon={ShoppingCart} label="Total Sales" value={data.salesWithProfit.length}
          sub={`${data.salesWithProfit.reduce((s, sl) => s + sl.qtySold, 0)} units sold`}
        />
        <StatCard icon={DollarSign} label="Total Revenue" value={currency(data.totalRevenue)}
          sub={`Avg ${currency(data.avgSalePrice)} per unit`}
        />
        <StatCard icon={Truck} label="Shipped Sales" value={data.shippedSales.length}
          sub={currency(shippedRevenue)}
          color="text-blue-600 dark:text-blue-400" bgColor="bg-blue-50 dark:bg-blue-900/30"
        />
        <StatCard icon={MapPin} label="Local Sales" value={data.localSales.length}
          sub={currency(localRevenue)}
          color="text-emerald-600 dark:text-emerald-400" bgColor="bg-emerald-50 dark:bg-emerald-900/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By platform */}
        <Section title="Revenue by Platform" icon={BarChart3}>
          <div className="space-y-4">
            {Object.entries(data.byPlatform)
              .sort(([, a], [, b]) => b.revenue - a.revenue)
              .map(([plat, d]) => (
                <div key={plat}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-900 dark:text-white">{plat}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{currency(d.revenue)}</span>
                  </div>
                  <BarFill value={d.revenue} max={maxPlatRev} color="bg-indigo-500" />
                  <div className="flex gap-4 mt-1 text-xs text-gray-400">
                    <span>{d.sales} sale{d.sales !== 1 ? 's' : ''}</span>
                    <span>{d.units} unit{d.units !== 1 ? 's' : ''}</span>
                    <span>Fees: {currency(d.fees)}</span>
                  </div>
                </div>
              ))}
          </div>
        </Section>

        {/* By category */}
        <Section title="Revenue by Category" icon={PieChart}>
          <div className="space-y-4">
            {Object.entries(data.byCategory)
              .filter(([, d]) => d.revenue > 0)
              .sort(([, a], [, b]) => b.revenue - a.revenue)
              .map(([cat, d]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-900 dark:text-white">{cat}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{currency(d.revenue)}</span>
                  </div>
                  <BarFill value={d.revenue} max={maxCatRev} color="bg-emerald-500" />
                  <div className="flex gap-4 mt-1 text-xs text-gray-400">
                    <span>{d.sold} unit{d.sold !== 1 ? 's' : ''} sold</span>
                    <span>Profit: {currency(d.profit)}</span>
                  </div>
                </div>
              ))}
          </div>
        </Section>
      </div>

      {/* Local vs Shipped breakdown */}
      <Section title="Local vs. Shipped Breakdown" icon={Truck}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">Local Sales</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Count</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.localSales.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                <span className="font-medium text-gray-900 dark:text-white">{currency(localRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Fees Paid</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{currency(data.localSales.reduce((s, sl) => s + (sl.platformFees || 0), 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping Costs</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{currency(data.localSales.reduce((s, sl) => s + (sl.shippingCost || 0), 0))}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/40">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-700 dark:text-blue-400">Shipped Sales</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Count</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.shippedSales.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                <span className="font-medium text-gray-900 dark:text-white">{currency(shippedRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Fees Paid</span>
                <span className="font-medium text-red-500">{currency(data.shippedSales.reduce((s, sl) => s + (sl.platformFees || 0), 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping Costs</span>
                <span className="font-medium text-red-500">{currency(data.shippedSales.reduce((s, sl) => s + (sl.shippingCost || 0), 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* All sales table */}
      <Section title="All Sales — Detailed View" icon={ShoppingCart}>
        <div className="overflow-x-auto -mx-4 lg:-mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">Date</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sale Price</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">Cost</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">Fees</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {data.salesWithProfit.map(sl => (
                <tr key={sl.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-2.5 px-4">
                    <p className="font-medium text-gray-900 dark:text-white truncate max-w-[180px]">{sl.productName}</p>
                    <p className="text-xs text-gray-400">{sl.platform || 'Local'} · {sl.saleType}</p>
                  </td>
                  <td className="py-2.5 px-4 text-right text-gray-500 dark:text-gray-400 hidden sm:table-cell whitespace-nowrap">
                    {new Date(sl.saleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-2.5 px-4 text-right font-medium text-gray-900 dark:text-white">{currency(sl.salePrice)}</td>
                  <td className="py-2.5 px-4 text-right text-gray-500 dark:text-gray-400 hidden sm:table-cell">{currency(sl.costBasis)}</td>
                  <td className="py-2.5 px-4 text-right text-gray-500 dark:text-gray-400 hidden md:table-cell">{currency((sl.platformFees || 0) + (sl.shippingCost || 0))}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span className={`font-semibold ${sl.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {currency(sl.netProfit)}
                    </span>
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
