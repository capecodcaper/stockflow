import { useState, useMemo } from 'react'
import {
  DollarSign,
  TrendingUp,
  Package,
  Search,
  Truck,
  HandCoins,
  Plus,
  SlidersHorizontal,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import SaleDetailPanel from '../components/SaleDetailPanel'
import AddSaleModal from '../components/AddSaleModal'

const shortDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${d.getDate()} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`
}

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

  const currentSale = selectedSale
    ? sales.find((s) => s.id === selectedSale.id) || null
    : null

  const hasActiveFilters = typeFilter !== 'all' || platformFilter !== 'all' || dateFilter !== 'all'

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Summary cards */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sales Summary</span>
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
          <StatBox label="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="text-blue-500" />
          <StatBox label="Cost" value={`$${totalCost.toLocaleString()}`} icon={Package} color="text-gray-500" />
          <StatBox label="Fees" value={`$${totalFees.toFixed(2)}`} icon={Truck} color="text-orange-500" />
          <StatBox
            label="Net Profit"
            value={`${netProfit >= 0 ? '+' : ''}$${netProfit.toFixed(2)}`}
            icon={TrendingUp}
            color={netProfit >= 0 ? 'text-green-500' : 'text-red-500'}
          />
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
            const netSaleProfit = (sale.salePrice * sale.qtySold) - (sale.costBasis * sale.qtySold) - (sale.platformFees || 0) - (sale.shippingCost || 0)

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

function StatBox({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 lg:p-4">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}
