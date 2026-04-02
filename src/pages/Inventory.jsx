import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List, Plus, Package, DollarSign, TrendingUp } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import AddProductModal from '../components/AddProductModal'
import ProductDetailPanel from '../components/ProductDetailPanel'
import UndoToast from '../components/UndoToast'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { getStatusBadgeColor, currency, daysAgo } from '../utils/helpers'

const sortOptions = [
  { value: 'attention', label: 'Needs Attention' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'profit', label: 'Highest Profit %' },
  { value: 'name', label: 'Name A-Z' },
]

export default function Inventory() {
  const { products, addProduct, updateProduct, deleteProduct, addSale, categories, statuses } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('attention')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [toast, setToast] = useState(null)

  const showAddModal = searchParams.get('add') === 'true'
  const setShowAddModal = (show) => {
    if (show) {
      setSearchParams({ add: 'true' })
    } else {
      setSearchParams({})
    }
  }

  // --- Summary stats ---
  const stats = useMemo(() => {
    const totalItems = products.reduce((sum, p) => sum + p.quantity, 0)
    const totalRemaining = products.reduce((sum, p) => sum + (p.quantity - (p.quantitySold || 0)), 0)
    const totalInvested = products.reduce((sum, p) => sum + p.purchasePrice * p.quantity, 0)
    const totalListingValue = products.reduce((sum, p) => {
      const remaining = p.quantity - (p.quantitySold || 0)
      return sum + p.listingPrice * remaining
    }, 0)
    const potentialProfit = totalListingValue - products.reduce((sum, p) => {
      const remaining = p.quantity - (p.quantitySold || 0)
      return sum + p.purchasePrice * remaining
    }, 0)
    return { totalItems, totalRemaining, totalInvested, totalListingValue, potentialProfit }
  }, [products])

  const filtered = useMemo(() => {
    let result = [...products]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.source.toLowerCase().includes(q)
      )
    }

    if (categoryFilter !== 'All') {
      result = result.filter((p) => p.category === categoryFilter)
    }

    if (statusFilter !== 'All') {
      result = result.filter((p) => p.status === statusFilter)
    }

    switch (sortBy) {
      case 'attention': {
        // Score each product by how much it needs your attention right now.
        // Higher score = more urgent = shows first.
        const attentionScore = (p) => {
          let score = 0
          const remaining = p.quantity - (p.quantitySold || 0)
          if (remaining <= 0) return -100 // Sold items sink to bottom

          const age = daysAgo(p.purchaseDate)
          // Aging stock gets priority — the longer it sits, the more urgent
          if (age >= 90) score += 50
          else if (age >= 60) score += 35
          else if (age >= 30) score += 20

          // Items not yet listed need action (Sourced, In Hand)
          if (p.status === 'Sourced') score += 15
          else if (p.status === 'In Hand') score += 10

          // High-profit items you haven't sold yet — don't let money sit
          const profitPct = p.purchasePrice > 0 ? ((p.listingPrice - p.purchasePrice) / p.purchasePrice) * 100 : 0
          if (profitPct >= 50) score += 10
          else if (profitPct >= 30) score += 5

          return score
        }
        result.sort((a, b) => attentionScore(b) - attentionScore(a))
        break
      }
      case 'newest':
        result.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate))
        break
      case 'price-high':
        result.sort((a, b) => b.listingPrice - a.listingPrice)
        break
      case 'price-low':
        result.sort((a, b) => a.listingPrice - b.listingPrice)
        break
      case 'profit':
        result.sort((a, b) => {
          const profitA = ((a.listingPrice - a.purchasePrice) / a.purchasePrice) * 100
          const profitB = ((b.listingPrice - b.purchasePrice) / b.purchasePrice) * 100
          return profitB - profitA
        })
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [products, search, categoryFilter, statusFilter, sortBy])

  // Keep selectedProduct in sync with products state
  const currentProduct = selectedProduct
    ? products.find((p) => p.id === selectedProduct.id) || null
    : null

  const activeFilters = (categoryFilter !== 'All' ? 1 : 0) + (statusFilter !== 'All' ? 1 : 0)

  return (
    <div className="space-y-4">

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <div className="flex items-center gap-2 mb-1.5">
            <Package className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Items</span>
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">{stats.totalRemaining}</p>
          <p className="text-xs text-gray-400 mt-0.5">{stats.totalItems} total ({stats.totalItems - stats.totalRemaining} sold)</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
          <div className="flex items-center gap-2 mb-1.5">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Invested</span>
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">{currency(stats.totalInvested)}</p>
          <p className="text-xs text-gray-400 mt-0.5">total cost basis</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-indigo-600" />
          <div className="flex items-center gap-2 mb-1.5">
            <DollarSign className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Listing Value</span>
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">{currency(stats.totalListingValue)}</p>
          <p className="text-xs text-gray-400 mt-0.5">unsold at asking price</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 relative overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-1 ${stats.potentialProfit >= 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`} />
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className={`w-4 h-4 ${stats.potentialProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Potential Profit</span>
          </div>
          <p className={`text-2xl lg:text-3xl font-extrabold ${stats.potentialProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {currency(stats.potentialProfit)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">if all unsold items sell at asking</p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, brands, sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative flex items-center gap-2 px-3 sm:px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
            showFilters
              ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilters > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 sm:px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 ${viewMode === 'grid' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-gray-900 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 border-l border-gray-200 dark:border-gray-700 ${viewMode === 'list' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-gray-900 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="All">All</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="All">All</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setCategoryFilter('All'); setStatusFilter('All'); setSearch('') }}
              className="px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
              Clear All
            </button>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filtered.length} of {products.length} products
      </p>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Desktop table header — hidden on mobile */}
          <div className="hidden md:grid grid-cols-[1fr_100px_90px_80px_80px_80px] gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Product</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center">Qty</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Cost</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Price</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Profit</span>
          </div>

          {filtered.map((product) => {
            const profit = product.listingPrice - product.purchasePrice
            const profitPct = product.purchasePrice > 0 ? Math.round((profit / product.purchasePrice) * 100) : 0
            const remaining = product.quantity - (product.quantitySold || 0)
            const isGoodDeal = profitPct >= 30

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="flex border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
              >
                {/* Profit accent bar */}
                <div className={`w-1 flex-shrink-0 ${
                  profit > 0
                    ? isGoodDeal ? 'bg-emerald-500' : 'bg-amber-400'
                    : profit < 0 ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} />

                {/* Mobile-friendly row: stacks on mobile, grid on desktop */}
                <div className="flex-1 px-4 py-3 md:grid md:grid-cols-[1fr_100px_90px_80px_80px_80px] md:gap-2 md:items-center">
                  {/* Product name + brand */}
                  <div className="mb-1 md:mb-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.brand} · {product.category}{product.size ? ` · ${product.size}` : ''}</p>
                  </div>

                  {/* Mobile: inline row for status + numbers */}
                  <div className="flex items-center gap-3 mt-1.5 md:contents">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeColor(product.status)}`}>{product.status}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 md:text-center">
                      {remaining}/{product.quantity}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 md:text-right">{currency(product.purchasePrice)}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white md:text-right">{currency(product.listingPrice)}</span>
                    <span className={`text-xs font-bold md:text-right ${
                      profit > 0
                        ? isGoodDeal ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                        : profit < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
                    }`}>
                      {profit >= 0 ? '+' : ''}{currency(profit)} ({profitPct}%)
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addProduct}
      />

      {currentProduct && (
        <ProductDetailPanel
          product={currentProduct}
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
    </div>
  )
}
