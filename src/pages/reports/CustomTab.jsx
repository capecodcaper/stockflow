import { useState, useMemo } from 'react'
import {
  SlidersHorizontal,
  Filter,
  ChevronDown,
  ChevronUp,
  Store,
  Tag,
  Hash,
  Layers,
  Truck,
  MapPin,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { conditions as appConditions } from '../../data/demoProducts'
import { currency, pct, saleRevenue, saleNetProfit, selectClass } from '../../utils/helpers'

const groupByOptions = [
  { id: 'platform', label: 'Platform', icon: Store, desc: 'Compare profitability across selling platforms' },
  { id: 'category', label: 'Category', icon: Tag, desc: 'See which product categories perform best' },
  { id: 'brand', label: 'Brand', icon: Hash, desc: 'Break down performance by brand' },
  { id: 'source', label: 'Source', icon: MapPin, desc: 'See which sourcing spots are most profitable' },
  { id: 'condition', label: 'Condition', icon: Layers, desc: 'Compare new vs. used item profitability' },
  { id: 'saleType', label: 'Sale Type', icon: Truck, desc: 'Local meetup vs. shipped — which is better?' },
]

const timeRangeOptions = [
  { id: 'all', label: 'All Time' },
  { id: '7', label: 'Last 7 Days' },
  { id: '30', label: 'Last 30 Days' },
  { id: '90', label: 'Last 90 Days' },
]

export default function CustomTab({ products, sales }) {
  const { categories: userCategories, platforms: userPlatforms } = useData()
  const [groupBy, setGroupBy] = useState('platform')
  const [timeRange, setTimeRange] = useState('all')
  const [filterPlatform, setFilterPlatform] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterSaleType, setFilterSaleType] = useState('All')
  const [filterBrand, setFilterBrand] = useState('All')
  const [filterSource, setFilterSource] = useState('All')
  const [filterCondition, setFilterCondition] = useState('All')
  const [sortBy, setSortBy] = useState('profit')
  const [showFilters, setShowFilters] = useState(false)

  const uniqueBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.brand).filter(Boolean))
    return ['All', ...Array.from(brands).sort()]
  }, [products])

  const uniqueSources = useMemo(() => {
    const sources = new Set(products.map(p => p.source).filter(Boolean))
    return ['All', ...Array.from(sources).sort()]
  }, [products])

  const filteredSales = useMemo(() => {
    let filtered = [...sales]

    if (timeRange !== 'all') {
      const days = parseInt(timeRange)
      const cutoff = Date.now() - days * 86400000
      filtered = filtered.filter(sl => new Date(sl.saleDate).getTime() >= cutoff)
    }
    if (filterPlatform !== 'All') {
      filtered = filterPlatform === 'Local'
        ? filtered.filter(sl => !sl.platform)
        : filtered.filter(sl => sl.platform === filterPlatform)
    }
    if (filterCategory !== 'All') filtered = filtered.filter(sl => sl.category === filterCategory)
    if (filterSaleType !== 'All') filtered = filtered.filter(sl => sl.saleType === filterSaleType.toLowerCase())
    if (filterBrand !== 'All') filtered = filtered.filter(sl => sl.brand === filterBrand)
    if (filterSource !== 'All') {
      filtered = filtered.filter(sl => {
        const product = products.find(p => p.id === sl.productId)
        return product?.source === filterSource
      })
    }
    if (filterCondition !== 'All') {
      filtered = filtered.filter(sl => {
        const product = products.find(p => p.id === sl.productId)
        return product?.condition === filterCondition
      })
    }

    return filtered
  }, [sales, products, timeRange, filterPlatform, filterCategory, filterSaleType, filterBrand, filterSource, filterCondition])

  const grouped = useMemo(() => {
    const groups = {}

    filteredSales.forEach(sl => {
      let key
      switch (groupBy) {
        case 'platform': key = sl.platform || 'Local / No Platform'; break
        case 'category': key = sl.category || 'Uncategorized'; break
        case 'brand': key = sl.brand || 'Unknown Brand'; break
        case 'source': { const p = products.find(p => p.id === sl.productId); key = p?.source || 'Unknown Source'; break }
        case 'condition': { const p = products.find(p => p.id === sl.productId); key = p?.condition || 'Unknown'; break }
        case 'saleType': key = sl.saleType === 'local' ? 'Local Meetup' : 'Shipped'; break
        default: key = 'Unknown'
      }

      if (!groups[key]) groups[key] = { sales: 0, units: 0, revenue: 0, cogs: 0, fees: 0, shipping: 0, profit: 0 }
      const g = groups[key]
      g.sales++
      g.units += sl.qtySold
      g.revenue += saleRevenue(sl)
      g.cogs += sl.costBasis * sl.qtySold
      g.fees += sl.platformFees || 0
      g.shipping += sl.shippingCost || 0
      g.profit += saleNetProfit(sl)
    })

    Object.values(groups).forEach(g => {
      g.margin = g.revenue > 0 ? (g.profit / g.revenue) * 100 : 0
      g.roi = g.cogs > 0 ? (g.profit / g.cogs) * 100 : 0
      g.avgSalePrice = g.units > 0 ? g.revenue / g.units : 0
      g.avgProfit = g.sales > 0 ? g.profit / g.sales : 0
      g.feePercent = g.revenue > 0 ? (g.fees / g.revenue) * 100 : 0
    })

    return Object.entries(groups).sort(([, a], [, b]) => {
      switch (sortBy) {
        case 'profit': return b.profit - a.profit
        case 'revenue': return b.revenue - a.revenue
        case 'roi': return b.roi - a.roi
        case 'margin': return b.margin - a.margin
        case 'sales': return b.sales - a.sales
        case 'fees': return b.fees - a.fees
        default: return b.profit - a.profit
      }
    })
  }, [filteredSales, products, groupBy, sortBy])

  const totals = useMemo(() => {
    const t = { sales: 0, units: 0, revenue: 0, cogs: 0, fees: 0, shipping: 0, profit: 0 }
    filteredSales.forEach(sl => {
      t.sales++
      t.units += sl.qtySold
      t.revenue += saleRevenue(sl)
      t.cogs += sl.costBasis * sl.qtySold
      t.fees += sl.platformFees || 0
      t.shipping += sl.shippingCost || 0
      t.profit += saleNetProfit(sl)
    })
    t.margin = t.revenue > 0 ? (t.profit / t.revenue) * 100 : 0
    t.roi = t.cogs > 0 ? (t.profit / t.cogs) * 100 : 0
    return t
  }, [filteredSales])

  const activeGroupOption = groupByOptions.find(o => o.id === groupBy)

  return (
    <div className="space-y-5">
      {/* Description banner */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <SlidersHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">Build Your Own Report</p>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5">
              Choose how to group your data, set filters, and sort by what matters most to you. Great for comparing platforms, finding your best categories, or tracking where your profits really come from.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Group by selector */}
        <div className="p-4 lg:p-5 border-b border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Group By</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {groupByOptions.map(opt => {
              const Icon = opt.icon
              const active = groupBy === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => setGroupBy(opt.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{opt.label}</span>
                </button>
              )
            })}
          </div>
          {activeGroupOption && (
            <p className="text-xs text-gray-400 mt-2">{activeGroupOption.desc}</p>
          )}
        </div>

        {/* Time range + filters toggle row */}
        <div className="p-4 lg:p-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            {timeRangeOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setTimeRange(opt.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  timeRange === opt.id
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {(() => {
            const activeFilterCount = [filterPlatform, filterCategory, filterSaleType, filterBrand, filterSource, filterCondition].filter(f => f !== 'All').length
            return (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400'
                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
                {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )
          })()}

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs font-medium bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2.5 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="profit">Highest Profit</option>
              <option value="revenue">Highest Revenue</option>
              <option value="roi">Best ROI</option>
              <option value="margin">Best Margin</option>
              <option value="sales">Most Sales</option>
              <option value="fees">Highest Fees</option>
            </select>
          </div>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="px-4 lg:px-5 pb-4 lg:pb-5 flex flex-wrap gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Platform</label>
              <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} className={selectClass}>
                <option>All</option>
                {userPlatforms.map(p => <option key={p}>{p}</option>)}
                <option>Local</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Category</label>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={selectClass}>
                <option>All</option>
                {userCategories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Sale Type</label>
              <select value={filterSaleType} onChange={e => setFilterSaleType(e.target.value)} className={selectClass}>
                <option>All</option>
                <option>Shipped</option>
                <option>Local</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Brand</label>
              <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)} className={selectClass}>
                {uniqueBrands.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Source</label>
              <select value={filterSource} onChange={e => setFilterSource(e.target.value)} className={selectClass}>
                {uniqueSources.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Condition</label>
              <select value={filterCondition} onChange={e => setFilterCondition(e.target.value)} className={selectClass}>
                {appConditions.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {[filterPlatform, filterCategory, filterSaleType, filterBrand, filterSource, filterCondition].some(f => f !== 'All') && (
              <div className="flex items-end">
                <button
                  onClick={() => { setFilterPlatform('All'); setFilterCategory('All'); setFilterSaleType('All'); setFilterBrand('All'); setFilterSource('All'); setFilterCondition('All') }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline py-2"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {grouped.length > 0 ? (
        <>
          {/* Hero callout */}
          <div className={`rounded-xl p-5 lg:p-6 border ${
            totals.profit >= 0
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  {totals.sales} sale{totals.sales !== 1 ? 's' : ''} · {currency(totals.revenue)} revenue
                </p>
                <p className={`text-3xl lg:text-4xl font-bold ${
                  totals.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                }`}>
                  {currency(totals.profit)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  net profit · {pct(totals.margin)} margin · {pct(totals.roi)} ROI
                </p>
              </div>
              {totals.fees + totals.shipping > 0 && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">Lost to fees & shipping</p>
                  <p className="text-lg font-bold text-red-500">{currency(totals.fees + totals.shipping)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {grouped.map(([key, g], i) => {
              const isPositive = g.profit >= 0
              const bestProfitKey = grouped[0]?.[0]
              const bestROIKey = [...grouped].sort(([, a], [, b]) => b.roi - a.roi)[0]?.[0]
              const worstFeesKey = [...grouped].sort(([, a], [, b]) => b.feePercent - a.feePercent)[0]?.[0]
              const badges = []
              if (key === bestProfitKey && grouped.length > 1) badges.push({ label: 'Top Profit', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' })
              if (key === bestROIKey && key !== bestProfitKey && grouped.length > 1) badges.push({ label: 'Best ROI', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' })
              if (key === worstFeesKey && g.fees > 0 && grouped.length > 1) badges.push({ label: 'Highest Fees', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' })

              return (
                <div key={key} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex">
                  <div className={`w-1.5 flex-shrink-0 ${
                    isPositive ? g.margin >= 20 ? 'bg-emerald-500' : 'bg-amber-400' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 p-4 lg:p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          i === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                          : i === 1 ? 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                          : i === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                        }`}>{i + 1}</span>
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{key}</p>
                      </div>
                      {badges.length > 0 && (
                        <div className="flex gap-1 flex-shrink-0">
                          {badges.map(b => (
                            <span key={b.label} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${b.color}`}>
                              {b.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <p className={`text-2xl lg:text-3xl font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {currency(g.profit)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">profit</p>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                      <div>
                        <p className="text-xs text-gray-400">Revenue</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{currency(g.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Margin</p>
                        <p className={`text-sm font-medium ${g.margin >= 20 ? 'text-emerald-600 dark:text-emerald-400' : g.margin >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
                          {pct(g.margin)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">ROI</p>
                        <p className={`text-sm font-medium ${g.roi >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          {pct(g.roi)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Sales</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{g.sales}</p>
                      </div>
                      {g.fees > 0 && (
                        <div>
                          <p className="text-xs text-gray-400">Fees</p>
                          <p className="text-sm font-medium text-red-500">{currency(g.fees)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <SlidersHorizontal className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No sales match your filters</p>
          <p className="text-xs text-gray-400 mt-1">Try widening your time range or removing some filters.</p>
        </div>
      )}
    </div>
  )
}
