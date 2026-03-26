import { useState } from 'react'
import {
  X,
  ImagePlus,
  Tag,
  Calendar,
  MapPin,
  ShoppingBag,
  FileText,
  Edit3,
  Check,
  DollarSign,
  Trash2,
  Package,
  PackagePlus,
  Receipt,
  ChevronRight,
} from 'lucide-react'
import { conditions } from '../data/demoProducts'
import { useData } from '../context/DataContext'
import { getStatusBadgeColor, inputClass } from '../utils/helpers'
import SaleFormFields from './SaleFormFields'

export default function ProductDetailPanel({ product, onClose, onUpdate, onDelete, onLogSale }) {
  const { categories, statuses, platforms: sellingPlatforms } = useData()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(product)
  const [showSaleForm, setShowSaleForm] = useState(false)
  const [showRestockForm, setShowRestockForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRestockHistory, setShowRestockHistory] = useState(false)

  // Quick log sale form state
  const [saleType, setSaleType] = useState('shipped')
  const [saleQty, setSaleQty] = useState(1)
  const [salePrice, setSalePrice] = useState('')
  const [salePlatform, setSalePlatform] = useState(
    product.platform && sellingPlatforms.includes(product.platform) ? product.platform : (product.platform ? 'Other' : '')
  )
  const [salePlatformOther, setSalePlatformOther] = useState(
    product.platform && !sellingPlatforms.includes(product.platform) ? product.platform : ''
  )
  const [saleBuyerName, setSaleBuyerName] = useState('')
  const [saleShippingCost, setSaleShippingCost] = useState('')
  const [salePlatformFees, setSalePlatformFees] = useState('')
  const [saleFeesEstimated, setSaleFeesEstimated] = useState(false)
  const [saleTrackingNumber, setSaleTrackingNumber] = useState('')

  // Add more stock form state
  const [restockQty, setRestockQty] = useState(1)
  const [restockCost, setRestockCost] = useState('')
  const [restockSource, setRestockSource] = useState('')
  const [restockDate, setRestockDate] = useState(new Date().toISOString().split('T')[0])

  if (!product) return null

  const remaining = product.quantity - (product.quantitySold || 0)
  const profit = product.listingPrice - product.purchasePrice
  const profitPercent = product.purchasePrice ? Math.round((profit / product.purchasePrice) * 100) : 0
  const restocks = product.restocks || []

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSave = () => {
    onUpdate({
      ...form,
      purchasePrice: Number(form.purchasePrice) || 0,
      listingPrice: Number(form.listingPrice) || 0,
      quantity: Number(form.quantity) || 1,
    })
    setEditing(false)
  }

  const handleLogSale = () => {
    const price = Number(salePrice)
    if (!price || saleQty < 1) return

    const resolvedPlatform = salePlatform === 'Other' ? salePlatformOther : salePlatform

    const newSale = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      category: product.category,
      qtySold: saleQty,
      salePrice: price,
      costBasis: product.purchasePrice,
      saleDate: new Date().toISOString().split('T')[0],
      saleType,
      platform: saleType === 'shipped' ? resolvedPlatform : '',
      buyerName: saleBuyerName,
      shippingCost: Number(saleShippingCost) || 0,
      platformFees: Number(salePlatformFees) || 0,
      trackingNumber: saleType === 'shipped' ? saleTrackingNumber : '',
      preShippingPhotos: [],
      preSalePhotos: [],
      buyerRating: null,
      buyerNotes: '',
      disputeStatus: 'none',
    }

    const newQuantitySold = (product.quantitySold || 0) + saleQty
    onLogSale(newSale)
    onUpdate({
      ...product,
      quantitySold: newQuantitySold,
      status: newQuantitySold >= product.quantity ? 'Sold' : product.status,
    })

    // Reset form
    setShowSaleForm(false)
    setSalePrice(''); setSaleQty(1); setSaleBuyerName('')
    setSalePlatform(product.platform && sellingPlatforms.includes(product.platform) ? product.platform : (product.platform ? 'Other' : ''))
    setSalePlatformOther(product.platform && !sellingPlatforms.includes(product.platform) ? product.platform : '')
    setSaleShippingCost(''); setSalePlatformFees(''); setSaleTrackingNumber('')
  }

  const handleRestock = () => {
    const qty = Number(restockQty)
    const cost = Number(restockCost)
    if (!qty || qty < 1 || !cost) return

    const oldTotal = product.purchasePrice * product.quantity
    const newAvgPrice = Math.round(((oldTotal + qty * cost) / (product.quantity + qty)) * 100) / 100

    onUpdate({
      ...product,
      quantity: product.quantity + qty,
      purchasePrice: newAvgPrice,
      restocks: [...restocks, { id: Date.now(), qty, costPer: cost, date: restockDate, source: restockSource }],
    })

    setShowRestockForm(false)
    setRestockQty(1); setRestockCost(''); setRestockSource('')
    setRestockDate(new Date().toISOString().split('T')[0])
  }

  const handleDelete = () => { onDelete(product.id); onClose() }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusBadgeColor(product.status)}`}>
              {product.status}
            </span>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{product.name}</h2>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {editing ? (
              <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Save changes">
                <Check className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={() => { setForm(product); setEditing(true) }} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors" title="Edit product">
                <Edit3 className="w-5 h-5" />
              </button>
            )}
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Photo area */}
          <div className="h-56 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center text-gray-400 dark:text-gray-500">
              <ImagePlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Photo Upload Area</p>
              <p className="text-xs mt-1 text-indigo-500">Coming soon</p>
            </div>
          </div>

          {/* Purchase Receipt */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer">
            <Receipt className="w-6 h-6 text-gray-400 dark:text-gray-500 mx-auto mb-1.5" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Receipt</p>
            <p className="text-xs text-gray-400 mt-0.5">Upload your receipt or proof of purchase</p>
            <p className="text-xs text-indigo-500 mt-1.5 font-medium">Coming soon</p>
          </div>

          {/* Quantity + Profit summary */}
          <PriceSummary product={product} remaining={remaining} profit={profit} profitPercent={profitPercent} restocks={restocks} />

          {/* Restock history */}
          {restocks.length > 0 && (
            <RestockHistory
              product={product}
              restocks={restocks}
              show={showRestockHistory}
              onToggle={() => setShowRestockHistory(!showRestockHistory)}
            />
          )}

          {/* Details section — edit or view mode */}
          {editing ? (
            <EditForm form={form} update={update} categories={categories} statuses={statuses} conditions={conditions} inputClass={inputClass} />
          ) : (
            <DetailView product={product} />
          )}

          {/* Actions */}
          {!editing && (
            <div className="space-y-3 pt-2">
              {/* Quick Log Sale */}
              {remaining > 0 && !showSaleForm && !showRestockForm && (
                <button
                  onClick={() => setShowSaleForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Quick Log Sale
                </button>
              )}

              {showSaleForm && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 space-y-4">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">Quick Log Sale</p>
                  <SaleFormFields
                    saleType={saleType} setSaleType={setSaleType}
                    saleQty={saleQty} setSaleQty={setSaleQty} maxQty={remaining}
                    salePrice={salePrice} setSalePrice={setSalePrice}
                    platform={salePlatform} setPlatform={setSalePlatform}
                    platformOther={salePlatformOther} setPlatformOther={setSalePlatformOther}
                    shippingCost={saleShippingCost} setShippingCost={setSaleShippingCost}
                    platformFees={salePlatformFees} setPlatformFees={setSalePlatformFees}
                    feesEstimated={saleFeesEstimated} setFeesEstimated={setSaleFeesEstimated}
                    trackingNumber={saleTrackingNumber} setTrackingNumber={setSaleTrackingNumber}
                    buyerName={saleBuyerName} setBuyerName={setSaleBuyerName}
                    sellingPlatforms={sellingPlatforms}
                    accentColor="green"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowSaleForm(false)} className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleLogSale} className="flex-1 px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Log Sale
                    </button>
                  </div>
                </div>
              )}

              {/* Add More Stock */}
              {!showSaleForm && !showRestockForm && (
                <button
                  onClick={() => setShowRestockForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  <PackagePlus className="w-4 h-4" />
                  Add More Stock
                </button>
              )}

              {showRestockForm && (
                <RestockForm
                  product={product}
                  restockQty={restockQty} setRestockQty={setRestockQty}
                  restockCost={restockCost} setRestockCost={setRestockCost}
                  restockDate={restockDate} setRestockDate={setRestockDate}
                  restockSource={restockSource} setRestockSource={setRestockSource}
                  onCancel={() => setShowRestockForm(false)}
                  onSubmit={handleRestock}
                />
              )}

              {/* Delete */}
              {!showSaleForm && !showRestockForm && (
                <DeleteConfirm
                  show={showDeleteConfirm}
                  onToggle={() => setShowDeleteConfirm(!showDeleteConfirm)}
                  onDelete={handleDelete}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Sub-components ─────────────────────────────────────────

function PriceSummary({ product, remaining, profit, profitPercent, restocks }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
      {product.quantity > 1 && (
        <div className="flex items-center justify-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {remaining} of {product.quantity} remaining
          </span>
          {product.quantitySold > 0 && (
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              · {product.quantitySold} sold
            </span>
          )}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{restocks.length > 0 ? 'Avg Cost' : 'Cost'}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">${product.purchasePrice}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Asking</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">${product.listingPrice}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Profit/ea</p>
          <p className={`text-lg font-bold ${profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {profit >= 0 ? '+' : ''}${profit}
            <span className="text-xs ml-1">({profitPercent}%)</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function RestockHistory({ product, restocks, show, onToggle }) {
  return (
    <div>
      <button onClick={onToggle} className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
        <ChevronRight className={`w-4 h-4 transition-transform ${show ? 'rotate-90' : ''}`} />
        Stock History ({restocks.length + 1} acquisitions)
      </button>
      {show && (
        <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-900 rounded-lg text-sm">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Original Purchase</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{product.purchaseDate} · {product.source || 'Unknown source'}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                {product.quantity - restocks.reduce((sum, r) => sum + r.qty, 0)}x @ ${restocks.length > 0
                  ? ((product.purchasePrice * product.quantity - restocks.reduce((sum, r) => sum + r.qty * r.costPer, 0)) / (product.quantity - restocks.reduce((sum, r) => sum + r.qty, 0))).toFixed(2)
                  : product.purchasePrice
                }
              </p>
            </div>
          </div>
          {restocks.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-900 rounded-lg text-sm">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Restock</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{r.date}{r.source ? ` · ${r.source}` : ''}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">{r.qty}x @ ${r.costPer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EditForm({ form, update, categories, statuses, conditions, inputClass }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Product Name</label>
        <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
          <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputClass}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Brand</label>
          <input type="text" value={form.brand} onChange={(e) => update('brand', e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Size</label>
          <input type="text" value={form.size} onChange={(e) => update('size', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Condition</label>
          <select value={form.condition} onChange={(e) => update('condition', e.target.value)} className={inputClass}>
            {conditions.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Qty</label>
          <input type="number" min="1" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Purchase Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" min="0" step="0.01" value={form.purchasePrice} onChange={(e) => update('purchasePrice', e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Listing Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" min="0" step="0.01" value={form.listingPrice} onChange={(e) => update('listingPrice', e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
          <select value={form.status} onChange={(e) => update('status', e.target.value)} className={inputClass}>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Source</label>
          <input type="text" value={form.source} onChange={(e) => update('source', e.target.value)} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Platform</label>
        <input type="text" value={form.platform} onChange={(e) => update('platform', e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</label>
        <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>
    </div>
  )
}

function DetailView({ product }) {
  return (
    <div className="space-y-3">
      <DetailRow icon={Tag} label="Category" value={product.category} />
      <DetailRow icon={ShoppingBag} label="Brand" value={product.brand} />
      <DetailRow icon={Tag} label="Size" value={product.size} />
      <DetailRow icon={Tag} label="Condition" value={product.condition} />
      <DetailRow icon={Calendar} label="Purchased" value={product.purchaseDate} />
      <DetailRow icon={MapPin} label="Source" value={product.source || '—'} />
      <DetailRow icon={ShoppingBag} label="Platform" value={product.platform || 'Not listed yet'} />
      {product.notes && (
        <div className="pt-2">
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Notes</p>
              <p className="text-sm text-gray-900 dark:text-white mt-0.5">{product.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RestockForm({ product, restockQty, setRestockQty, restockCost, setRestockCost, restockDate, setRestockDate, restockSource, setRestockSource, onCancel, onSubmit }) {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 space-y-4">
      <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Add More Stock</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Qty to Add</label>
          <input type="number" min="1" value={restockQty} onChange={(e) => setRestockQty(Number(e.target.value))} className={inputClass} autoFocus />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Cost Per Unit</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" min="0" step="0.01" value={restockCost} onChange={(e) => setRestockCost(e.target.value)} placeholder="0.00"
              className="w-full pl-7 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Date Acquired</label>
          <input type="date" value={restockDate} onChange={(e) => setRestockDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Source</label>
          <input type="text" value={restockSource} onChange={(e) => setRestockSource(e.target.value)} placeholder={product.source || 'e.g. Target'}
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center">
        <Receipt className="w-5 h-5 text-gray-400 mx-auto mb-1" />
        <p className="text-xs text-gray-500 dark:text-gray-400">Upload receipt for this purchase</p>
        <p className="text-xs text-indigo-500 mt-0.5">Coming soon</p>
      </div>
      {restockCost && Number(restockCost) > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">After this restock:</p>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total qty</span>
            <span className="font-medium text-gray-900 dark:text-white">{product.quantity + Number(restockQty)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-gray-600 dark:text-gray-400">New avg cost</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${(Math.round(((product.purchasePrice * product.quantity + Number(restockQty) * Number(restockCost)) / (product.quantity + Number(restockQty))) * 100) / 100).toFixed(2)}
            </span>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
        <button onClick={onSubmit} className="flex-1 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">Add Stock</button>
      </div>
    </div>
  )
}

function DeleteConfirm({ show, onToggle, onDelete }) {
  if (!show) {
    return (
      <button onClick={onToggle} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-medium transition-colors">
        <Trash2 className="w-4 h-4" />
        Delete Product
      </button>
    )
  }
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 space-y-3">
      <p className="text-sm font-semibold text-red-800 dark:text-red-300">Are you sure?</p>
      <p className="text-xs text-red-600 dark:text-red-400">This cannot be undone.</p>
      <div className="flex gap-2">
        <button onClick={onToggle} className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
        <button onClick={onDelete} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">Yes, Delete</button>
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <div className="flex items-center justify-between flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}
