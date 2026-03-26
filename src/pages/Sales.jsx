import { useState, useMemo } from 'react'
import {
  Search,
  Truck,
  HandCoins,
  Plus,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import SaleDetailPanel from '../components/SaleDetailPanel'
import AddSaleModal from '../components/AddSaleModal'
import { shortDate, saleNetProfit } from '../utils/helpers'

export default function Sales() {
  const { sales, updateSale } = useData()
  const [selectedSale, setSelectedSale] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [statsRange, setStatsRange] = useState('all')

  // Get unique platforms from sales
  const platforms = useMemo(() => {
    const set = new Set(sales.filter((s) => s.platform).map((s) => s.platform))
    return ['all', ...Array.from(set).sort()]
  }, [sales])

  const filtered = useMemo(() => {
    let result = [...sales]

    // Search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.productName.toLowerCase().includes(q) ||
          s.brand.toLowerCase().includes(q) ||
          s.platform.toLowerCase().includes(q) ||
          s.buyerName.toLowerCase().includes(q)
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((s) => s.saleType === typeFilter)
    }

    // Platform filter
    if (platformFilter !== 'all') {
      result = result.filter((s) => s.platform === platformFilter)
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      if (dateFilter === '7d') cutoff.setDate(now.getDate() - 7)
      else if (dateFilter === '30d') cutoff.setDate(now.getDate() - 30)
      else if (dateFilter === '90d') cutoff.setDate(now.getDate() - 90)
      result = result.filter((s) => new Date(s.saleDate) >= cutoff)
    }

    return result
  }, [sales, search, typeFilter, platformFilter, dateFilter])

  // Filter sales by stats time range
  const statsSales = useMemo(() => {
    if (statsRange === 'all') return sales
    const now = new Date()
    const cutoff = new Date()
    const days = { '1w': 7, '1m': 30, '3m': 90, '6m': 180, '1y': 365 }
    cutoff.setDate(now.getDate() - (days[statsRange] || 0))
    return sales.filter((s) => new Date(s.saleDate) >= cutoff)
  }, [sales, statsRange])

  // Summary stats based on stats time range
  const totalRevenue = statsSales.reduce((sum, s) => sum + s.salePrice * s.qtySold, 0)
  const totalCost = statsSales.reduce((sum, s) => sum + s.costBasis * s.qtySold, 0)
  const totalFees = statsSales.reduce((sum, s) => sum + (s.platformFees || 0) + (s.shippingCost || 0), 0)
  const netProfit = totalRevenue - totalCost - totalFees
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
  const totalSales = statsSales.length

  const currentSale = selectedSale
    ? sales.find((s) => s.id === selectedSale.id) || null
    : null

  const hasActiveFilters = typeFilter !== 'all' || platformFilter !== 'all' || dateFilter !== 'all'

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Sales Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sales Summary</span>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
              {{ '1w': 'Last 7 days', '1m': 'Last 30 days', '3m': 'Last 90 days', '6m': 'Last 6 months', '1y': 'Last year', 'all': 'All time' }[statsRange]}
            </span>
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {[
              { key: '1w', label: '1W' },
              { key: '1m', label: '1M' },
              { key: '3m', label: '3M' },
              { key: '6m', label: '6M' },
              { key: '1y', label: '1Y' },
              { key: 'all', label: 'All' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatsRange(key)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  statsRange === key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {/* Revenue */}
          <div className="rounded-xl bg-blue-50 dark:bg-blue-900/15 border border-blue-100 dark:border-blue-800/30 p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-6 h-6 rounded-md bg-blue-500/15 dark:bg-blue-400/15 flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70">Revenue</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{totalSales} sale{totalSales !== 1 ? 's' : ''}</p>
          </div>

          {/* Cost */}
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-6 h-6 rounded-md bg-gray-500/10 dark:bg-gray-400/10 flex items-center justify-center">
                <ArrowDownRight className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Cost</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${totalCost.toLocaleString()}</p>
          </div>

          {/* Fees */}
          <div className="rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/20 p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-6 h-6 rounded-md bg-orange-500/15 dark:bg-orange-400/10 flex items-center justify-center">
                <Truck className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
              </div>
              <span className="text-xs font-medium text-orange-500/70 dark:text-orange-400/60">Fees + Ship</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${totalFees.toLocaleString()}</p>
          </div>

          {/* Net Profit — slightly emphasized */}
          <div className={`rounded-xl p-3.5 border ${
            netProfit >= 0
              ? 'bg-green-50 dark:bg-green-900/15 border-green-200 dark:border-green-800/30'
              : 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800/30'
          }`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                netProfit >= 0
                  ? 'bg-green-500/15 dark:bg-green-400/15'
                  : 'bg-red-500/15 dark:bg-red-400/15'
              }`}>
                {netProfit >= 0
                  ? <ArrowUpRight className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  : <ArrowDownRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                }
              </div>
              <span className={`text-xs font-medium ${netProfit >= 0 ? 'text-green-600/70 dark:text-green-400/70' : 'text-red-600/70 dark:text-red-400/70'}`}>Net Profit</span>
            </div>
            <p className={`text-2xl font-extrabold ${netProfit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{profitMargin.toFixed(1)}% margin</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sales..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
              {[typeFilter !== 'all', platformFilter !== 'all', dateFilter !== 'all'].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Log Sale button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Log Sale</span>
        </button>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="shipped">Shipped</option>
              <option value="local">Local</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Platform</label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>{p === 'all' ? 'All Platforms' : p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Time Period</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setTypeFilter('all'); setPlatformFilter('all'); setDateFilter('all'); setSearch('') }}
              className="px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filtered.length} sale{filtered.length !== 1 ? 's' : ''}
        {hasActiveFilters && ` (filtered from ${sales.length})`}
      </p>

      {/* Sales list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <DollarSign className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 dark:text-gray-500 text-lg">No sales found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            {hasActiveFilters ? 'Try adjusting your filters' : 'Log your first sale to get started'}
          </p>
          {!hasActiveFilters && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Log Sale
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Desktop table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1 text-center">Type</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-2 text-right">Sale</div>
            <div className="col-span-2 text-right">Profit</div>
          </div>

          {filtered.map((sale) => {
            const netSaleProfit = saleNetProfit(sale)

            return (
              <button
                key={sale.id}
                onClick={() => setSelectedSale(sale)}
                className="w-full text-left border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Mobile layout */}
                <div className="md:hidden flex items-center gap-3 px-4 py-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    sale.saleType === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    {sale.saleType === 'shipped' ? (
                      <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <HandCoins className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{sale.productName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{shortDate(sale.saleDate)} · {sale.qtySold}x</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">${(sale.salePrice * sale.qtySold).toLocaleString()}</p>
                    <p className={`text-xs font-semibold ${netSaleProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {netSaleProfit >= 0 ? '+' : ''}${netSaleProfit.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center px-5 py-3.5">
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      sale.saleType === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      {sale.saleType === 'shipped' ? (
                        <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <HandCoins className="w-4 h-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{sale.productName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{sale.platform || 'Local'}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">{shortDate(sale.saleDate)}</div>
                  <div className="col-span-1 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      sale.saleType === 'shipped'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {sale.saleType === 'shipped' ? 'Ship' : 'Local'}
                    </span>
                  </div>
                  <div className="col-span-1 text-center text-sm text-gray-600 dark:text-gray-400">{sale.qtySold}</div>
                  <div className="col-span-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                    ${(sale.salePrice * sale.qtySold).toLocaleString()}
                  </div>
                  <div className={`col-span-2 text-right text-sm font-semibold ${netSaleProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {netSaleProfit >= 0 ? '+' : ''}${netSaleProfit.toFixed(2)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Sale Detail Panel */}
      {currentSale && (
        <SaleDetailPanel
          sale={currentSale}
          onClose={() => setSelectedSale(null)}
          onUpdate={updateSale}
        />
      )}

      {/* Add Sale Modal */}
      <AddSaleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  )
}

