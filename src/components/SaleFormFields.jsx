import { Truck, HandCoins, Upload } from 'lucide-react'
import { platformFeeRates } from '../data/demoProducts'

/**
 * Shared sale form fields used by both AddSaleModal and QuickSaleForm.
 * Renders: sale type toggle, qty+price, shipped fields (platform, fees, tracking),
 * or local fields (buyer name), plus photo upload placeholders.
 *
 * All state is owned by the parent — this component just renders the fields.
 */
export default function SaleFormFields({
  saleType, setSaleType,
  saleQty, setSaleQty, maxQty,
  salePrice, setSalePrice,
  platform, setPlatform,
  platformOther, setPlatformOther,
  shippingCost, setShippingCost,
  platformFees, setPlatformFees,
  feesEstimated, setFeesEstimated,
  trackingNumber, setTrackingNumber,
  buyerName, setBuyerName,
  sellingPlatforms,
  accentColor = 'indigo', // 'indigo' for modal, 'green' for quick sale
}) {
  const ringClass = `focus:ring-${accentColor}-500`
  const inputClass = `w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${ringClass}`
  const dollarInputClass = `w-full pl-7 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${ringClass}`

  const estimateFees = (plat, price) => {
    const rate = platformFeeRates[plat]
    if (rate != null && price) {
      setPlatformFees((Number(price) * rate).toFixed(2))
      setFeesEstimated(true)
    }
  }

  return (
    <>
      {/* Sale type toggle */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Sale Type</label>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setSaleType('local')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              saleType === 'local'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <HandCoins className="w-4 h-4" />
            Local
          </button>
          <button
            type="button"
            onClick={() => setSaleType('shipped')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              saleType === 'shipped'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Truck className="w-4 h-4" />
            Shipped
          </button>
        </div>
      </div>

      {/* Qty + Price */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Qty</label>
          <input
            type="number"
            min="1"
            max={maxQty}
            value={saleQty}
            onChange={(e) => setSaleQty(Math.min(Number(e.target.value), maxQty))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sale Price (each) *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={salePrice}
              onChange={(e) => {
                setSalePrice(e.target.value)
                if (platform && platform !== 'Other') estimateFees(platform, e.target.value)
              }}
              placeholder="0.00"
              className={dollarInputClass}
            />
          </div>
        </div>
      </div>

      {/* Conditional fields */}
      {saleType === 'shipped' ? (
        <div className="space-y-4">
          {/* Platform select */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => {
                setPlatform(e.target.value)
                if (e.target.value !== 'Other') setPlatformOther('')
                if (e.target.value && e.target.value !== 'Other' && salePrice) {
                  estimateFees(e.target.value, salePrice)
                }
              }}
              className={inputClass}
            >
              <option value="">Select platform...</option>
              {sellingPlatforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          {platform === 'Other' && (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Platform Name</label>
              <input
                type="text"
                value={platformOther}
                onChange={(e) => setPlatformOther(e.target.value)}
                placeholder="Enter platform name"
                className={inputClass}
              />
            </div>
          )}

          {/* Shipping cost + Platform fees */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Shipping Cost</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  placeholder="0.00"
                  className={dollarInputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Platform Fees</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={platformFees}
                  onChange={(e) => { setPlatformFees(e.target.value); setFeesEstimated(false) }}
                  placeholder="0.00"
                  className={dollarInputClass}
                />
              </div>
            </div>
          </div>
          {feesEstimated && (
            <p className="text-xs text-amber-600 dark:text-amber-400 -mt-2">
              Estimated ~{Math.round((platformFeeRates[platform] || 0) * 100)}% {platform} fee — adjust if needed
            </p>
          )}

          {/* Tracking number */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className={inputClass}
            />
          </div>

          {/* Pre-shipping photos placeholder */}
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center">
            <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Pre-shipping photos</p>
            <p className="text-xs text-indigo-500 mt-0.5">Coming soon</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Buyer Name (optional)</label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="e.g. Carlos"
              className={inputClass}
            />
          </div>
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center">
            <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Pre-sale photos</p>
            <p className="text-xs text-indigo-500 mt-0.5">Coming soon</p>
          </div>
        </div>
      )}
    </>
  )
}
