import { useState } from 'react'
import { X } from 'lucide-react'
import { useData } from '../context/DataContext'
import { inputClass } from '../utils/helpers'
import SaleFormFields from './SaleFormFields'

export default function AddSaleModal({ isOpen, onClose }) {
  const { products, addSale, updateProduct, platforms: sellingPlatforms } = useData()
  const [saleType, setSaleType] = useState('shipped')
  const [productId, setProductId] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [saleQty, setSaleQty] = useState(1)
  const [platform, setPlatform] = useState('')
  const [platformOther, setPlatformOther] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [shippingCost, setShippingCost] = useState('')
  const [platformFees, setPlatformFees] = useState('')
  const [feesEstimated, setFeesEstimated] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')

  if (!isOpen) return null

  const availableProducts = products.filter(
    (p) => (p.quantity - (p.quantitySold || 0)) > 0
  )

  const selectedProduct = products.find((p) => p.id === Number(productId))
  const maxQty = selectedProduct
    ? selectedProduct.quantity - (selectedProduct.quantitySold || 0)
    : 1

  const resolvedPlatform = platform === 'Other' ? platformOther : platform

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedProduct || !salePrice) return

    const qty = Math.min(saleQty, maxQty)

    const newSale = {
      id: Date.now(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      brand: selectedProduct.brand,
      category: selectedProduct.category,
      qtySold: qty,
      salePrice: Number(salePrice),
      costBasis: selectedProduct.purchasePrice,
      saleDate: new Date().toISOString().split('T')[0],
      saleType,
      platform: saleType === 'shipped' ? resolvedPlatform : '',
      buyerName,
      shippingCost: Number(shippingCost) || 0,
      platformFees: Number(platformFees) || 0,
      trackingNumber: saleType === 'shipped' ? trackingNumber : '',
      preShippingPhotos: [],
      preSalePhotos: [],
      buyerRating: null,
      buyerNotes: '',
      disputeStatus: 'none',
    }

    addSale(newSale)

    const newQuantitySold = (selectedProduct.quantitySold || 0) + qty
    updateProduct({
      ...selectedProduct,
      quantitySold: newQuantitySold,
      status: newQuantitySold >= selectedProduct.quantity ? 'Sold' : selectedProduct.status,
    })

    // Reset
    setProductId(''); setSalePrice(''); setSaleQty(1); setPlatform(''); setPlatformOther('')
    setBuyerName(''); setShippingCost(''); setPlatformFees(''); setFeesEstimated(false); setTrackingNumber('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto mx-4 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Log a Sale</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Product selector — unique to modal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product *</label>
            <select
              required
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value)
                const p = products.find((p) => p.id === Number(e.target.value))
                if (p) {
                  // Auto-prefill sale price with listing price
                  if (p.listingPrice) setSalePrice(String(p.listingPrice))
                  // Auto-prefill platform if product has one
                  if (p.platform) {
                    const match = sellingPlatforms.includes(p.platform)
                    setPlatform(match ? p.platform : 'Other')
                    setPlatformOther(match ? '' : p.platform)
                  }
                }
              }}
              className={inputClass}
            >
              <option value="">Select a product...</option>
              {availableProducts.map((p) => {
                const remaining = p.quantity - (p.quantitySold || 0)
                return (
                  <option key={p.id} value={p.id}>
                    {p.name} ({remaining} available)
                  </option>
                )
              })}
            </select>
          </div>

          {/* Shared sale form fields */}
          <SaleFormFields
            saleType={saleType} setSaleType={setSaleType}
            saleQty={saleQty} setSaleQty={setSaleQty} maxQty={maxQty}
            salePrice={salePrice} setSalePrice={setSalePrice}
            platform={platform} setPlatform={setPlatform}
            platformOther={platformOther} setPlatformOther={setPlatformOther}
            shippingCost={shippingCost} setShippingCost={setShippingCost}
            platformFees={platformFees} setPlatformFees={setPlatformFees}
            feesEstimated={feesEstimated} setFeesEstimated={setFeesEstimated}
            trackingNumber={trackingNumber} setTrackingNumber={setTrackingNumber}
            buyerName={buyerName} setBuyerName={setBuyerName}
            sellingPlatforms={sellingPlatforms}
            accentColor="indigo"
          />

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Log Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
