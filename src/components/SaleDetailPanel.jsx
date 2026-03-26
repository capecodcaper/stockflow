import { useState } from 'react'
import {
  X,
  Truck,
  HandCoins,
  Upload,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
} from 'lucide-react'

const disputeOptions = [
  { value: 'none', label: 'None', activeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'opened', label: 'Opened', activeClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'won', label: 'Won', activeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'lost', label: 'Lost', activeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
]

import { saleGrossProfit, saleNetProfit } from '../utils/helpers'

export default function SaleDetailPanel({ sale, onClose, onUpdate }) {
  const [showMore, setShowMore] = useState(false)

  if (!sale) return null

  const grossProfit = saleGrossProfit(sale)
  const netProfit = saleNetProfit(sale)

  const update = (field, value) => {
    onUpdate({ ...sale, [field]: value })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3 min-w-0">
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
              <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{sale.productName}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{sale.saleDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Profit summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sale Price</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">${sale.salePrice}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sale.qtySold}x @ ${sale.costBasis} cost</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Net Profit</p>
                <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {netProfit >= 0 ? '+' : ''}${netProfit.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">after fees & shipping</p>
              </div>
            </div>
            {(sale.platformFees > 0 || sale.shippingCost > 0) && (
              <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                {sale.shippingCost > 0 && <span>Shipping: ${sale.shippingCost.toFixed(2)}</span>}
                {sale.platformFees > 0 && <span>Fees: ${sale.platformFees.toFixed(2)}</span>}
              </div>
            )}
          </div>

          {/* Sale type badge + platform */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              sale.saleType === 'shipped'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              {sale.saleType === 'shipped' ? 'Shipped' : 'Local Sale'}
            </span>
            {sale.platform && (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {sale.platform}
              </span>
            )}
          </div>

          {/* Photo section */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {sale.saleType === 'shipped' ? 'Pre-shipping photos' : 'Pre-sale photos'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Proof of condition before handoff</p>
            <p className="text-xs text-indigo-500 mt-2 font-medium">Coming soon</p>
          </div>

          {/* Dispute status */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Return / Dispute Status</label>
            <div className="flex flex-wrap gap-2">
              {disputeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update('disputeStatus', opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sale.disputeStatus === opt.value
                      ? opt.activeClass
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* More Details section */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${showMore ? 'rotate-90' : ''}`} />
            {showMore ? 'Hide Details' : 'More Details'}
          </button>

          {showMore && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
              {sale.saleType === 'shipped' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <InlineField
                      label="Shipping Cost"
                      value={sale.shippingCost}
                      type="money"
                      onSave={(v) => update('shippingCost', Number(v) || 0)}
                    />
                    <InlineField
                      label="Platform Fees"
                      value={sale.platformFees}
                      type="money"
                      onSave={(v) => update('platformFees', Number(v) || 0)}
                    />
                  </div>
                  <InlineField
                    label="Tracking Number"
                    value={sale.trackingNumber}
                    type="text"
                    placeholder="Enter tracking number"
                    onSave={(v) => update('trackingNumber', v)}
                  />
                </>
              )}

              <InlineField
                label="Buyer Name"
                value={sale.buyerName}
                type="text"
                placeholder="Enter buyer name"
                onSave={(v) => update('buyerName', v)}
              />

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Buyer Rating</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => update('buyerRating', 'up')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sale.buyerRating === 'up'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Good
                  </button>
                  <button
                    onClick={() => update('buyerRating', 'down')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sale.buyerRating === 'down'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Bad
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Buyer Notes</label>
                <textarea
                  value={sale.buyerNotes}
                  onChange={(e) => update('buyerNotes', e.target.value)}
                  placeholder="Any notes about this buyer or transaction..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function InlineField({ label, value, type, placeholder, onSave }) {
  const [editing, setEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)

  const handleBlur = () => {
    setEditing(false)
    onSave(localValue)
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      {editing ? (
        <div className="relative">
          {type === 'money' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>}
          <input
            type={type === 'money' ? 'number' : 'text'}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            placeholder={placeholder}
            autoFocus
            min={type === 'money' ? '0' : undefined}
            step={type === 'money' ? '0.01' : undefined}
            className={`w-full ${type === 'money' ? 'pl-7' : 'pl-3'} pr-3 py-2 bg-white dark:bg-gray-900 border border-indigo-300 dark:border-indigo-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
        </div>
      ) : (
        <button
          onClick={() => { setLocalValue(value); setEditing(true) }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
            value
              ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-indigo-300 dark:hover:border-indigo-600'
              : 'bg-white dark:bg-gray-900 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-600'
          }`}
        >
          {type === 'money'
            ? value ? `$${Number(value).toFixed(2)}` : placeholder || 'Click to add'
            : value || placeholder || 'Click to add'
          }
        </button>
      )}
    </div>
  )
}
