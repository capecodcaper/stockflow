import { ImagePlus, Tag, TrendingUp, Clock } from 'lucide-react'
import { getStatusBadgeColor, currency, daysAgo } from '../utils/helpers'

export default function ProductCard({ product, onClick }) {
  const potentialProfit = product.listingPrice - product.purchasePrice
  const profitPercent = product.purchasePrice > 0 ? Math.round((potentialProfit / product.purchasePrice) * 100) : 0
  const remaining = product.quantity - (product.quantitySold || 0)
  const isGoodDeal = profitPercent >= 30
  const age = daysAgo(product.purchaseDate)
  const isAging = product.status !== 'Sold' && age > 30

  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 group flex flex-col"
    >
      {/* Profit accent bar at top */}
      <div className={`h-1.5 ${
        potentialProfit > 0
          ? isGoodDeal ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-amber-300 to-amber-500'
          : potentialProfit < 0 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gray-200 dark:bg-gray-700'
      }`} />

      {/* Photo area — compact */}
      <div className="h-32 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
        <div className="text-center text-gray-400 dark:text-gray-500">
          <ImagePlus className="w-8 h-8 mx-auto opacity-40" />
        </div>
        {/* Status badge */}
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadgeColor(product.status)}`}
        >
          {product.status}
        </span>
        {/* Quantity badge */}
        {product.quantity > 1 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-900/70 text-white">
            {remaining}/{product.quantity} left
          </span>
        )}
        {/* Aging indicator */}
        {isAging && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/90 text-white flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {age}d
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {product.brand}{product.condition ? ` · ${product.condition}` : ''}{product.size ? ` · ${product.size}` : ''}
        </p>

        {/* Price + profit — the visual anchor */}
        <div className="mt-auto">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {currency(product.listingPrice)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {currency(product.purchasePrice)}
              </span>
            </div>
          </div>

          {/* Profit pill — big and color-coded */}
          <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${
            potentialProfit > 0
              ? isGoodDeal
                ? 'bg-emerald-50 dark:bg-emerald-900/20'
                : 'bg-amber-50 dark:bg-amber-900/20'
              : potentialProfit < 0
                ? 'bg-red-50 dark:bg-red-900/20'
                : 'bg-gray-50 dark:bg-gray-800'
          }`}>
            <div className="flex items-center gap-1.5">
              <TrendingUp className={`w-4 h-4 ${
                potentialProfit > 0
                  ? isGoodDeal ? 'text-emerald-500' : 'text-amber-500'
                  : potentialProfit < 0 ? 'text-red-500' : 'text-gray-400'
              }`} />
              <span className={`text-sm font-bold ${
                potentialProfit > 0
                  ? isGoodDeal ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                  : potentialProfit < 0 ? 'text-red-700 dark:text-red-400' : 'text-gray-500'
              }`}>
                {potentialProfit >= 0 ? '+' : ''}{currency(potentialProfit)}
              </span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              potentialProfit > 0
                ? isGoodDeal
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                : potentialProfit < 0
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {potentialProfit >= 0 ? '+' : ''}{profitPercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
