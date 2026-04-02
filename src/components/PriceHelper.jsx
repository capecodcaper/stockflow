import { ExternalLink, TrendingUp, Search } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useMemo } from 'react'
import { currency } from '../utils/helpers'

/**
 * PriceHelper — shows sale history for a category + quick eBay/Google price check links.
 * Used in AddProductModal (when setting listing price) and ProductDetailPanel.
 *
 * Props:
 *   productName — the product name (used to build search URLs)
 *   category    — the product's category (used to find past sales in the same category)
 *   brand       — optional, included in search queries for better results
 */
export default function PriceHelper({ productName, category, brand }) {
  const { sales } = useData()

  // Find past sales in the same category
  const categoryHistory = useMemo(() => {
    if (!category) return null
    const matching = sales.filter(s => s.category === category)
    if (matching.length === 0) return null

    const prices = matching.map(s => s.salePrice)
    const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length
    const best = Math.max(...prices)
    const worst = Math.min(...prices)

    return {
      count: matching.length,
      avg: Math.round(avg * 100) / 100,
      best,
      worst,
      category,
    }
  }, [sales, category])

  // Build search query from product name + brand
  const searchQuery = [brand, productName].filter(Boolean).join(' ').trim()

  const ebayUrl = searchQuery
    ? `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}&LH_Sold=1&LH_Complete=1`
    : null

  const googleUrl = searchQuery
    ? `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=shop`
    : null

  // Don't render anything if there's no product name and no history
  if (!searchQuery && !categoryHistory) return null

  return (
    <div className="bg-indigo-50/70 dark:bg-indigo-900/15 border border-indigo-200/60 dark:border-indigo-800/40 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Price Helper</p>
      </div>

      {/* Category sale history */}
      {categoryHistory && (
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Your <span className="font-semibold text-gray-700 dark:text-gray-300">{categoryHistory.category}</span> sales
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{currency(categoryHistory.avg)}</p>
              <p className="text-[10px] text-gray-400 uppercase font-medium">Avg Sale</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{currency(categoryHistory.best)}</p>
              <p className="text-[10px] text-gray-400 uppercase font-medium">Best</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-500 dark:text-gray-400">{currency(categoryHistory.worst)}</p>
              <p className="text-[10px] text-gray-400 uppercase font-medium">Lowest</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Based on {categoryHistory.count} sale{categoryHistory.count !== 1 ? 's' : ''} in {categoryHistory.category}
          </p>
        </div>
      )}

      {/* Quick price check links */}
      {searchQuery && (
        <div className="flex gap-2">
          {ebayUrl && (
            <a
              href={ebayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              eBay Sold
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          )}
          {googleUrl && (
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              Google Shopping
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          )}
        </div>
      )}

      {!searchQuery && (
        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
          Enter a product name to get price check links
        </p>
      )}
    </div>
  )
}
