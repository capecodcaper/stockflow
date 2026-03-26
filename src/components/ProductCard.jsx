import { ImagePlus, Tag, TrendingUp } from 'lucide-react'
import { getStatusBadgeColor } from '../utils/helpers'

export default function ProductCard({ product, onClick }) {
  const potentialProfit = product.listingPrice - product.purchasePrice
  const profitPercent = Math.round((potentialProfit / product.purchasePrice) * 100)
  const remaining = product.quantity - (product.quantitySold || 0)

  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 group"
    >
      {/* Photo area */}
      <div className="h-44 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
        <div className="text-center text-gray-400 dark:text-gray-500">
          <ImagePlus className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-xs">Photo Upload</p>
        </div>
        {/* Status badge */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(product.status)}`}
        >
          {product.status}
        </span>
        {/* Quantity badge */}
        {product.quantity > 1 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-900/70 text-white">
            {remaining}/{product.quantity} left
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {product.brand} · {product.size} · {product.condition}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>Qty: <span className="font-semibold text-gray-700 dark:text-gray-300">{product.quantity}</span></span>
          <span>·</span>
          <span>Remaining: <span className={`font-semibold ${remaining > 0 ? 'text-gray-700 dark:text-gray-300' : 'text-red-500'}`}>{remaining}</span></span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              ${product.listingPrice}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ${product.purchasePrice}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className={`w-3.5 h-3.5 ${potentialProfit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs font-semibold ${potentialProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {potentialProfit >= 0 ? '+' : ''}{profitPercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
