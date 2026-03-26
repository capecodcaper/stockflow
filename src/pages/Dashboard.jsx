import { Package, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3, Zap, Eye } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useState, useMemo } from 'react'
import ProductDetailPanel from '../components/ProductDetailPanel'

const timeRanges = [
  { id: 'today', label: 'Today', days: 1 },
  { id: '7d', label: '7 Days', days: 7 },
  { id: '30d', label: '30 Days', days: 30 },
  { id: '90d', label: '90 Days', days: 90 },
  { id: 'all', label: 'All Time', days: null },
]

import { currency } from '../utils/helpers'

export default function Dashboard() {
  const { products, sales, updateProduct, deleteProduct, addSale, statuses } = useData()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [timeRange, setTimeRange] = useState('all')

  // --- Filter sales by time range ---
  const filteredSales = useMemo(() => {
    const range = timeRanges.find(t => t.id === timeRange)
    if (!range || !range.days) return sales
    const cutoff = Date.now() - range.days * 86400000
    return sales.filter(s => new Date(s.saleDate).getTime() >= cutoff)
  }, [sales, timeRange])

  // --- Compute live stats from filtered sales ---
  const totalProducts = products.reduce((sum, p) => sum + p.quantity, 0)
  const totalInvested = products.reduce((sum, p) => sum + p.purchasePrice * p.quantity, 0)
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.salePrice * (s.qtySold || 1), 0)
  const totalCogs = filteredSales.reduce((sum, s) => sum + s.costBasis * (s.qtySold || 1), 0)
  const totalFees = filteredSales.reduce((sum, s) => sum + (s.platformFees || 0) + (s.shippingCost || 0), 0)
  const totalSold = filteredSales.reduce((sum, s) => sum + (s.qtySold || 1), 0)
  const netProfit = totalRevenue - totalCogs - totalFees
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
  const roi = totalCogs > 0 ? (netProfit / totalCogs) * 100 : 0
  const sellThrough = totalProducts > 0 ? Math.round((totalSold / totalProducts) * 100) : 0
  const unsoldValue = products.reduce((sum, p) => {
    const remaining = p.quantity - (p.quantitySold || 0)
    return sum + p.listingPrice * remaining
  }, 0)
  const isPositive = netProfit >= 0

  // --- Group products by status for Kanban ---
  const kanbanStatuses = statuses
  const grouped = {}
  kanbanStatuses.forEach((s) => { grouped[s] = [] })
  products.forEach((p) => {
    if (grouped[p.status]) {
      grouped[p.status].push(p)
    }
  })

  const statusStyles = {
    Sourced: {
      border: 'border-t-yellow-400 dark:border-t-yellow-500',
      badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
      glow: 'shadow-yellow-500/5 dark:shadow-yellow-500/10',
      bg: 'bg-yellow-50/50 dark:bg-yellow-900/5',
    },
    'In Hand': {
      border: 'border-t-blue-400 dark:border-t-blue-500',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
      glow: 'shadow-blue-500/5 dark:shadow-blue-500/10',
      bg: 'bg-blue-50/50 dark:bg-blue-900/5',
    },
    Listed: {
      border: 'border-t-green-400 dark:border-t-green-500',
      badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
      glow: 'shadow-green-500/5 dark:shadow-green-500/10',
      bg: 'bg-green-50/50 dark:bg-green-900/5',
    },
    Sold: {
      border: 'border-t-purple-400 dark:border-t-purple-500',
      badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
      glow: 'shadow-purple-500/5 dark:shadow-purple-500/10',
      bg: 'bg-purple-50/50 dark:bg-purple-900/5',
    },
  }
  const defaultStatusStyle = {
    border: 'border-t-gray-400 dark:border-t-gray-500',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    glow: '',
    bg: 'bg-gray-50/50 dark:bg-gray-800/50',
  }
  const getStatusStyle = (status) => statusStyles[status] || defaultStatusStyle

  return (
    <div className="space-y-5">

      {/* ── Hero Profit Banner ── */}
      <div className={`relative rounded-2xl p-6 lg:p-8 border overflow-hidden ${
        isPositive
          ? 'border-emerald-200 dark:border-emerald-800/40'
          : 'border-red-200 dark:border-red-800/40'
      }`}
        style={{
          background: isPositive
            ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(52,211,153,0.03) 50%, rgba(16,185,129,0.06) 100%)'
            : 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(248,113,113,0.03) 50%, rgba(239,68,68,0.06) 100%)'
        }}
      >
        {/* Decorative glow */}
        <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 ${
          isPositive ? 'bg-emerald-400' : 'bg-red-400'
        }`} />

        {/* Time range selector */}
        <div className="relative flex items-center gap-1 mb-5 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-1 w-fit">
          {timeRanges.map(t => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                timeRange === t.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isPositive ? 'bg-emerald-500/20 dark:bg-emerald-500/30' : 'bg-red-500/20 dark:bg-red-500/30'
              }`}>
                {isPositive
                  ? <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  : <ArrowDownRight className="w-5 h-5 text-red-500" />
                }
              </div>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Profit</span>
            </div>
            <p className={`text-5xl lg:text-6xl font-extrabold tracking-tight ${
              isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
            }`}>
              {currency(netProfit)}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-lg ${
                isPositive
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
              }`}>
                {profitMargin.toFixed(1)}% margin
              </span>
              <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-lg ${
                roi >= 0
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
              }`}>
                {roi.toFixed(1)}% ROI
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredSales.length} sale{filteredSales.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Money flow cards */}
          <div className="flex gap-3">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl px-5 py-3 border border-gray-200/50 dark:border-gray-700/50 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{currency(totalRevenue)}</p>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl px-5 py-3 border border-gray-200/50 dark:border-gray-700/50 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Costs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{currency(totalCogs)}</p>
            </div>
            {totalFees > 0 && (
              <div className="bg-red-50/70 dark:bg-red-900/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-red-200/50 dark:border-red-800/40 text-center">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-0.5">Fees</p>
                <p className="text-xl font-bold text-red-500">{currency(totalFees)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Stats Row ── */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        {/* Inventory */}
        <div className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-5 overflow-hidden group hover:shadow-lg hover:shadow-blue-500/5 transition-shadow duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inventory</span>
          </div>
          <p className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">{totalProducts}</p>
          <p className="text-xs text-gray-400 mt-1.5">{products.length} unique items</p>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">{currency(totalInvested)} invested</p>
        </div>

        {/* Sell-through */}
        <div className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-5 overflow-hidden hover:shadow-lg hover:shadow-purple-500/5 transition-shadow duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sell-Through</span>
          </div>
          <p className={`text-3xl lg:text-4xl font-extrabold ${
            sellThrough >= 50 ? 'text-emerald-600 dark:text-emerald-400'
            : sellThrough >= 25 ? 'text-amber-500'
            : 'text-gray-900 dark:text-white'
          }`}>{sellThrough}%</p>
          {/* Thick progress bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mt-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                sellThrough >= 50
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                  : sellThrough >= 25
                    ? 'bg-gradient-to-r from-amber-300 to-amber-500'
                    : 'bg-gradient-to-r from-gray-300 to-gray-400'
              }`}
              style={{ width: `${Math.min(sellThrough, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{totalSold} sold of {totalProducts} units</p>
        </div>

        {/* Unsold value */}
        <div className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-5 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 transition-shadow duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unsold Value</span>
          </div>
          <p className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">{currency(unsoldValue)}</p>
          <p className="text-xs text-gray-400 mt-1.5">potential at listing prices</p>
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
            {totalProducts - totalSold} units remaining
          </p>
        </div>
      </div>

      {/* ── Kanban Board ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Inventory Pipeline</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanStatuses.map((status) => {
            const style = getStatusStyle(status)
            return (
              <div
                key={status}
                className={`rounded-xl border-t-[3px] ${style.border} p-3.5 min-h-[120px] lg:min-h-[200px] ${style.bg} shadow-sm ${style.glow}`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    {status}
                  </h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.badge}`}>
                    {(grouped[status] || []).length}
                  </span>
                </div>

                {/* Product mini-cards */}
                <div className="space-y-2">
                  {(!grouped[status] || grouped[status].length === 0) ? (
                    <div className="text-center py-6">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 mx-auto flex items-center justify-center mb-2">
                        <Package className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">No products</p>
                    </div>
                  ) : (
                    grouped[status].map((product) => {
                      const remaining = product.quantity - (product.quantitySold || 0)
                      const potentialProfit = product.listingPrice - product.purchasePrice
                      const profitPercent = product.purchasePrice > 0 ? Math.round((potentialProfit / product.purchasePrice) * 100) : 0
                      const isGoodDeal = profitPercent >= 30

                      return (
                        <div
                          key={product.id}
                          onClick={() => setSelectedProduct(product)}
                          className="bg-white dark:bg-gray-900 rounded-lg cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-600 border border-gray-200 dark:border-gray-700 transition-all duration-200 overflow-hidden flex"
                        >
                          {/* Profit accent bar */}
                          <div className={`w-1.5 flex-shrink-0 ${
                            potentialProfit > 0
                              ? isGoodDeal ? 'bg-gradient-to-b from-emerald-400 to-emerald-600' : 'bg-gradient-to-b from-amber-300 to-amber-500'
                              : 'bg-gradient-to-b from-red-300 to-red-500'
                          }`} />
                          <div className="p-3 flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {product.brand}{product.size ? ` · ${product.size}` : ''}
                            </p>
                            <div className="flex items-center justify-between mt-2.5">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {currency(product.listingPrice)}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {product.quantity > 1 && (
                                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">
                                    {remaining}/{product.quantity}
                                  </span>
                                )}
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                  potentialProfit > 0
                                    ? isGoodDeal
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                                }`}>
                                  {potentialProfit >= 0 ? '+' : ''}{profitPercent}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Product Detail Panel */}
      {selectedProduct && (
        <ProductDetailPanel
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={updateProduct}
          onDelete={(id) => { deleteProduct(id); setSelectedProduct(null) }}
          onLogSale={addSale}
        />
      )}
    </div>
  )
}
