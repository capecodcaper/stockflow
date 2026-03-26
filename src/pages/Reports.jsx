import { useState, useMemo } from 'react'
import { BarChart3, Package, ShoppingCart, TrendingUp, SlidersHorizontal } from 'lucide-react'
import { useData } from '../context/DataContext'
import { daysAgo, saleNetProfit, saleRevenue } from '../utils/helpers'
import OverviewTab from './reports/OverviewTab'
import InventoryTab from './reports/InventoryTab'
import SalesTab from './reports/SalesTab'
import ProfitabilityTab from './reports/ProfitabilityTab'
import CustomTab from './reports/CustomTab'

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'sales', label: 'Sales', icon: ShoppingCart },
  { id: 'profitability', label: 'Profitability', icon: TrendingUp },
  { id: 'custom', label: 'Custom', icon: SlidersHorizontal },
]

export default function Reports() {
  const { products, sales } = useData()
  const [activeTab, setActiveTab] = useState('overview')

  // Computed data shared across all tabs (except Custom which does its own filtering)
  const data = useMemo(() => {
    const totalUnits = products.reduce((s, p) => s + p.quantity, 0)
    const totalSoldUnits = products.reduce((s, p) => s + p.quantitySold, 0)
    const unsoldUnits = totalUnits - totalSoldUnits
    const totalInvested = products.reduce((s, p) => s + p.purchasePrice * p.quantity, 0)
    const totalRevenue = sales.reduce((s, sl) => s + saleRevenue(sl), 0)
    const totalCOGS = sales.reduce((s, sl) => s + sl.costBasis * sl.qtySold, 0)
    const totalFees = sales.reduce((s, sl) => s + (sl.platformFees || 0), 0)
    const totalShipping = sales.reduce((s, sl) => s + (sl.shippingCost || 0), 0)
    const totalExpenses = totalCOGS + totalFees + totalShipping
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    const roi = totalCOGS > 0 ? (netProfit / totalCOGS) * 100 : 0
    const totalSoldQty = sales.reduce((s, sl) => s + sl.qtySold, 0)
    const avgSalePrice = totalSoldQty > 0 ? totalRevenue / totalSoldQty : 0
    const sellThrough = totalUnits > 0 ? (totalSoldUnits / totalUnits) * 100 : 0

    const unsoldValue = products.reduce((s, p) => s + p.purchasePrice * (p.quantity - p.quantitySold), 0)
    const potentialRevenue = products.reduce((s, p) => s + p.listingPrice * (p.quantity - p.quantitySold), 0)

    // By category
    const byCategory = {}
    products.forEach(p => {
      if (!byCategory[p.category]) byCategory[p.category] = { units: 0, sold: 0, invested: 0, revenue: 0, profit: 0, count: 0 }
      const cat = byCategory[p.category]
      cat.units += p.quantity; cat.sold += p.quantitySold; cat.invested += p.purchasePrice * p.quantity; cat.count++
    })
    sales.forEach(sl => {
      if (byCategory[sl.category]) {
        byCategory[sl.category].revenue += saleRevenue(sl)
        byCategory[sl.category].profit += saleNetProfit(sl)
      }
    })

    // By status
    const byStatus = {}
    products.forEach(p => {
      if (!byStatus[p.status]) byStatus[p.status] = { count: 0, units: 0, value: 0 }
      const st = byStatus[p.status]
      st.count++
      const remaining = p.quantity - p.quantitySold
      st.units += remaining; st.value += p.purchasePrice * remaining
    })

    // By platform
    const byPlatform = {}
    sales.forEach(sl => {
      const plat = sl.platform || 'Local / No Platform'
      if (!byPlatform[plat]) byPlatform[plat] = { sales: 0, revenue: 0, fees: 0, profit: 0, units: 0 }
      const bp = byPlatform[plat]
      bp.sales++; bp.units += sl.qtySold; bp.revenue += saleRevenue(sl)
      bp.fees += sl.platformFees || 0
      bp.profit += saleNetProfit(sl)
    })

    const localSales = sales.filter(s => s.saleType === 'local')
    const shippedSales = sales.filter(s => s.saleType === 'shipped')

    // Inventory aging
    const aging = products
      .filter(p => p.quantity - p.quantitySold > 0)
      .map(p => ({ ...p, remaining: p.quantity - p.quantitySold, daysHeld: daysAgo(p.purchaseDate), investedValue: p.purchasePrice * (p.quantity - p.quantitySold) }))
      .sort((a, b) => b.daysHeld - a.daysHeld)

    const agingBuckets = {
      '0–14 days': aging.filter(p => p.daysHeld <= 14),
      '15–30 days': aging.filter(p => p.daysHeld > 14 && p.daysHeld <= 30),
      '31–60 days': aging.filter(p => p.daysHeld > 30 && p.daysHeld <= 60),
      '60+ days': aging.filter(p => p.daysHeld > 60),
    }

    // Top performers
    const salesWithProfit = sales.map(sl => {
      const rev = saleRevenue(sl)
      const net = saleNetProfit(sl)
      const cogs = sl.costBasis * sl.qtySold
      return { ...sl, netProfit: net, margin: rev > 0 ? (net / rev) * 100 : 0, roiPct: cogs > 0 ? (net / cogs) * 100 : 0 }
    })
    const topByProfit = [...salesWithProfit].sort((a, b) => b.netProfit - a.netProfit)
    const topByROI = [...salesWithProfit].sort((a, b) => b.roiPct - a.roiPct)

    // Sales by month
    const byMonth = {}
    sales.forEach(sl => {
      const month = sl.saleDate.substring(0, 7)
      if (!byMonth[month]) byMonth[month] = { revenue: 0, profit: 0, count: 0 }
      byMonth[month].revenue += saleRevenue(sl)
      byMonth[month].profit += saleNetProfit(sl)
      byMonth[month].count++
    })

    return {
      totalUnits, totalSoldUnits, unsoldUnits, totalInvested, totalRevenue, totalCOGS,
      totalFees, totalShipping, totalExpenses, netProfit, profitMargin, roi, avgSalePrice,
      sellThrough, unsoldValue, potentialRevenue, byCategory, byStatus, byPlatform,
      localSales, shippedSales, aging, agingBuckets, salesWithProfit, topByProfit,
      topByROI, byMonth,
    }
  }, [products, sales])

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Tab navigation */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-1 justify-center ${
                active
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <OverviewTab data={data} />}
      {activeTab === 'inventory' && <InventoryTab data={data} />}
      {activeTab === 'sales' && <SalesTab data={data} />}
      {activeTab === 'profitability' && <ProfitabilityTab data={data} />}
      {activeTab === 'custom' && <CustomTab products={products} sales={sales} />}
    </div>
  )
}
