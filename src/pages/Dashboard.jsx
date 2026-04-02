import { Package, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3, Zap, Eye, ShieldCheck, X, AlertTriangle, Clock, Percent, Activity, Info } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useState, useMemo } from 'react'
import ProductDetailPanel from '../components/ProductDetailPanel'
import UndoToast from '../components/UndoToast'

const timeRanges = [
  { id: 'today', label: 'Today', days: 1 },
  { id: '7d', label: '7 Days', days: 7 },
  { id: '30d', label: '30 Days', days: 30 },
  { id: '90d', label: '90 Days', days: 90 },
  { id: 'all', label: 'All Time', days: null },
]

import { currency, daysAgo } from '../utils/helpers'

export default function Dashboard() {
  const { products, sales, addProduct, updateProduct, deleteProduct, addSale, statuses } = useData()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showHealthPanel, setShowHealthPanel] = useState(false)
  const [toast, setToast] = useState(null)
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

  // --- Inventory Health Score ---
  const healthScore = useMemo(() => {
    if (products.length === 0) return { score: 0, grade: '—', color: 'gray', factors: [] }

    // Factor 1: Profit margin (0-30 pts)
    const marginPts = profitMargin >= 40 ? 30 : profitMargin >= 20 ? 15 + (profitMargin - 20) * 0.75 : profitMargin >= 0 ? profitMargin * 0.75 : 0

    // Factor 2: Sell-through rate (0-30 pts)
    const sellPts = sellThrough >= 60 ? 30 : sellThrough * 0.5

    // Factor 3: Average stock age — lower is better (0-25 pts)
    const unsoldProducts = products.filter(p => (p.quantity - (p.quantitySold || 0)) > 0)
    const avgAge = unsoldProducts.length > 0
      ? unsoldProducts.reduce((sum, p) => sum + daysAgo(p.purchaseDate), 0) / unsoldProducts.length
      : 0
    const agePts = avgAge <= 14 ? 25 : avgAge <= 30 ? 20 : avgAge <= 60 ? 10 : 0

    // Factor 4: % of stock aging 30+ days — lower is better (0-15 pts)
    const agingCount = unsoldProducts.filter(p => daysAgo(p.purchaseDate) >= 30).length
    const agingPct = unsoldProducts.length > 0 ? (agingCount / unsoldProducts.length) * 100 : 0
    const agingPts = agingPct <= 10 ? 15 : agingPct <= 30 ? 10 : agingPct <= 50 ? 5 : 0

    const total = Math.round(marginPts + sellPts + agePts + agingPts)
    const grade = total >= 80 ? 'A' : total >= 60 ? 'B' : total >= 40 ? 'C' : 'D'
    const color = grade === 'A' ? 'emerald' : grade === 'B' ? 'blue' : grade === 'C' ? 'amber' : 'red'

    // Build human-readable factors
    const factors = []
    if (profitMargin >= 30) factors.push({ text: 'Strong margins', good: true })
    else if (profitMargin >= 15) factors.push({ text: 'Decent margins', good: true })
    else factors.push({ text: 'Low margins', good: false })

    if (sellThrough >= 50) factors.push({ text: 'Selling fast', good: true })
    else if (sellThrough >= 25) factors.push({ text: 'Moderate turnover', good: true })
    else factors.push({ text: 'Slow turnover', good: false })

    if (agingCount > 0) factors.push({ text: `${agingCount} item${agingCount > 1 ? 's' : ''} aging 30+ days`, good: false })
    else factors.push({ text: 'No aging stock', good: true })

    // Detailed breakdown for the panel
    const agingItems = unsoldProducts
      .map(p => ({ ...p, age: daysAgo(p.purchaseDate) }))
      .filter(p => p.age >= 30)
      .sort((a, b) => b.age - a.age)

    // Category breakdown
    const catMap = {}
    unsoldProducts.forEach(p => {
      if (!catMap[p.category]) catMap[p.category] = { count: 0, invested: 0, value: 0 }
      const rem = p.quantity - (p.quantitySold || 0)
      catMap[p.category].count += rem
      catMap[p.category].invested += p.purchasePrice * rem
      catMap[p.category].value += p.listingPrice * rem
    })
    const categoryBreakdown = Object.entries(catMap)
      .map(([name, d]) => ({ name, ...d, profit: d.value - d.invested }))
      .sort((a, b) => b.invested - a.invested)

    const detail = {
      marginPts: Math.round(marginPts),
      sellPts: Math.round(sellPts),
      agePts: Math.round(agePts),
      agingPts: Math.round(agingPts),
      avgAge: Math.round(avgAge),
      agingCount,
      agingPct: Math.round(agingPct),
      agingItems,
      categoryBreakdown,
      unsoldCount: unsoldProducts.length,
    }

    return { score: total, grade, color, factors, detail }
  }, [products, profitMargin, sellThrough])

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

      {/* ── Health Score + Quick Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 lg:gap-4">
        {/* Health Score — clickable */}
        <div
          onClick={() => setShowHealthPanel(true)}
          className={`relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-5 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
          healthScore.color === 'emerald' ? 'hover:shadow-emerald-500/10' : healthScore.color === 'blue' ? 'hover:shadow-blue-500/10' : healthScore.color === 'amber' ? 'hover:shadow-amber-500/10' : 'hover:shadow-red-500/10'
        }`}>
          <div className={`absolute top-0 left-0 right-0 h-1 ${
            healthScore.color === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
            : healthScore.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-600'
            : healthScore.color === 'amber' ? 'bg-gradient-to-r from-amber-400 to-amber-600'
            : 'bg-gradient-to-r from-red-400 to-red-600'
          }`} />
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              healthScore.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/40'
              : healthScore.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/40'
              : healthScore.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/40'
              : 'bg-red-100 dark:bg-red-900/40'
            }`}>
              <ShieldCheck className={`w-4 h-4 ${
                healthScore.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400'
                : healthScore.color === 'blue' ? 'text-blue-600 dark:text-blue-400'
                : healthScore.color === 'amber' ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Health</span>
          </div>
          <p className={`text-5xl lg:text-6xl font-extrabold ${
            healthScore.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400'
            : healthScore.color === 'blue' ? 'text-blue-600 dark:text-blue-400'
            : healthScore.color === 'amber' ? 'text-amber-500'
            : 'text-red-500'
          }`}>{healthScore.grade}</p>
          <div className="mt-2.5 space-y-1">
            {healthScore.factors.map((f, i) => (
              <p key={i} className="text-xs flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${f.good ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <span className="text-gray-600 dark:text-gray-400">{f.text}</span>
              </p>
            ))}
          </div>
        </div>

      {/* Quick Stats */}
      <div className="sm:col-span-3 grid grid-cols-3 gap-3 lg:gap-4">
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
          onDelete={(product) => {
            deleteProduct(product.id)
            setSelectedProduct(null)
            setToast({
              message: `"${product.name}" deleted`,
              product,
            })
          }}
          onLogSale={addSale}
        />
      )}

      {toast && (
        <UndoToast
          message={toast.message}
          onUndo={() => addProduct(toast.product)}
          onExpire={() => {}}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* Health Score Detail Panel */}
      {showHealthPanel && (
        <HealthScorePanel
          healthScore={healthScore}
          profitMargin={profitMargin}
          sellThrough={sellThrough}
          onClose={() => setShowHealthPanel(false)}
        />
      )}
    </div>
  )
}

// ─── Health Score Detail Panel ──────────────────────────────
function HealthScorePanel({ healthScore, profitMargin, sellThrough, onClose }) {
  const { grade, score, color, factors, detail } = healthScore

  const colorClasses = {
    emerald: {
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
      border: 'border-emerald-200 dark:border-emerald-800/40',
      barBg: 'bg-emerald-500',
      lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    blue: {
      text: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      border: 'border-blue-200 dark:border-blue-800/40',
      barBg: 'bg-blue-500',
      lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    amber: {
      text: 'text-amber-500',
      bg: 'bg-amber-100 dark:bg-amber-900/40',
      border: 'border-amber-200 dark:border-amber-800/40',
      barBg: 'bg-amber-500',
      lightBg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    red: {
      text: 'text-red-500',
      bg: 'bg-red-100 dark:bg-red-900/40',
      border: 'border-red-200 dark:border-red-800/40',
      barBg: 'bg-red-500',
      lightBg: 'bg-red-50 dark:bg-red-900/20',
    },
  }
  const c = colorClasses[color] || colorClasses.blue

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg}`}>
              <ShieldCheck className={`w-4 h-4 ${c.text}`} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Inventory Health</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Big grade + score */}
          <div className={`rounded-xl p-6 text-center ${c.lightBg} border ${c.border}`}>
            <p className={`text-7xl font-extrabold ${c.text}`}>{grade}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Score: <span className="font-bold text-gray-900 dark:text-white">{score}</span> / 100
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-3 overflow-hidden">
              <div className={`h-3 rounded-full transition-all duration-1000 ${c.barBg}`} style={{ width: `${score}%` }} />
            </div>
          </div>

          {/* Quick summary bullets */}
          <div className="space-y-2">
            {factors.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${f.good ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Score breakdown */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-400" />
              Score Breakdown
            </h3>
            <div className="space-y-3">
              <ScoreBar label="Profit Margins" points={detail.marginPts} max={30} sublabel={`${profitMargin.toFixed(1)}% margin`} info="How much you keep after costs. Higher margins = more money in your pocket per sale." />
              <ScoreBar label="Sell-Through" points={detail.sellPts} max={30} sublabel={`${sellThrough}% sold`} info="How fast your inventory moves. If you bought 10 items and sold 6, your sell-through is 60%." />
              <ScoreBar label="Stock Freshness" points={detail.agePts} max={25} sublabel={`${detail.avgAge} day avg age`} info="How long your unsold items have been sitting. Fresher stock means you're flipping fast." />
              <ScoreBar label="Aging Inventory" points={detail.agingPts} max={15} sublabel={`${detail.agingPct}% over 30 days`} info="How much of your stock has been sitting 30+ days without selling. Less dead stock = healthier business." />
            </div>
          </div>

          {/* Category breakdown */}
          {detail.categoryBreakdown.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Percent className="w-4 h-4 text-gray-400" />
                By Category
              </h3>
              <div className="space-y-2">
                {detail.categoryBreakdown.map(cat => (
                  <div key={cat.name} className="flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{cat.name}</p>
                      <p className="text-xs text-gray-400">{cat.count} unit{cat.count !== 1 ? 's' : ''} · {currency(cat.invested)} invested</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${cat.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                        {cat.profit >= 0 ? '+' : ''}{currency(cat.profit)}
                      </p>
                      <p className="text-[10px] text-gray-400">potential</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aging items */}
          {detail.agingItems.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Aging Stock ({detail.agingItems.length})
              </h3>
              <div className="space-y-2">
                {detail.agingItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between px-3 py-2.5 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.brand} · Cost {currency(item.purchasePrice)}</p>
                    </div>
                    <div className="flex-shrink-0 ml-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs font-bold">
                        <Clock className="w-3 h-3" />
                        {item.age}d
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How the grade works */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">How this works</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Your health grade is based on four things: how good your profit margins are, how fast stuff sells,
              how fresh your inventory is, and how much stock is sitting unsold for 30+ days. Each factor earns
              points toward a score out of 100. A = 80+, B = 60+, C = 40+, D = under 40.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function ScoreBar({ label, points, max, sublabel, info }) {
  const pct = max > 0 ? Math.round((points / max) * 100) : 0
  const barColor = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : pct >= 25 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          {label}
          {info && (
            <span className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-help transition-colors" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 px-3 py-2 rounded-lg bg-gray-900 dark:bg-gray-700 text-[11px] text-white leading-snug shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                {info}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
              </span>
            </span>
          )}
        </span>
        <span className="text-xs font-bold text-gray-900 dark:text-white">{points}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-1">{sublabel}</p>
    </div>
  )
}
