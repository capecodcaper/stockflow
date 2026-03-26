import { createContext, useContext, useState } from 'react'
import { demoProducts, demoSales, categories as defaultCategories, statuses as defaultStatuses, sellingPlatforms as defaultPlatforms } from '../data/demoProducts'

const DataContext = createContext()

export function DataProvider({ children }) {
  const [products, setProducts] = useState(demoProducts)
  const [sales, setSales] = useState(demoSales)

  // User-customizable lists (seeded from defaults, minus 'All' which is a filter-only value)
  const [categories, setCategories] = useState(defaultCategories.filter(c => c !== 'All'))
  const [statuses, setStatuses] = useState(defaultStatuses.filter(s => s !== 'All'))
  const [platforms, setPlatforms] = useState(defaultPlatforms)

  const addProduct = (product) => {
    setProducts((prev) => [product, ...prev])
  }

  const updateProduct = (updated) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const addSale = (sale) => {
    setSales((prev) => [sale, ...prev])
  }

  const updateSale = (updated) => {
    setSales((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    )
  }

  const addCategory = (name) => {
    const trimmed = name.trim()
    if (trimmed && !categories.includes(trimmed)) setCategories(prev => [...prev, trimmed])
  }
  const removeCategory = (name) => setCategories(prev => prev.filter(c => c !== name))

  const addStatus = (name) => {
    const trimmed = name.trim()
    if (trimmed && !statuses.includes(trimmed)) setStatuses(prev => [...prev, trimmed])
  }
  const removeStatus = (name) => setStatuses(prev => prev.filter(s => s !== name))

  const addPlatform = (name) => {
    const trimmed = name.trim()
    if (trimmed && !platforms.includes(trimmed)) setPlatforms(prev => [...prev, trimmed])
  }
  const removePlatform = (name) => setPlatforms(prev => prev.filter(p => p !== name))

  return (
    <DataContext.Provider
      value={{
        products,
        sales,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        updateSale,
        categories,
        addCategory,
        removeCategory,
        statuses,
        addStatus,
        removeStatus,
        platforms,
        addPlatform,
        removePlatform,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
