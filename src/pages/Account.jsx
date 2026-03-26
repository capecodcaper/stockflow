import { useState } from 'react'
import {
  UserCircle,
  Mail,
  Lock,
  Camera,
  Save,
  DollarSign,
  Truck,
  HandCoins,
  Tag,
  Layers,
  CircleDot,
  Plus,
  X,
  Info,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useData } from '../context/DataContext'

const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"

function TagList({ items, onAdd, onRemove, newValue, setNewValue, placeholder, color }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {items.map((item) => (
          <span key={item} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${color}`}>
            {item}
            <button onClick={() => onRemove(item)} className="hover:opacity-70 transition-opacity">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { onAdd(newValue); setNewValue('') } }}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          onClick={() => { onAdd(newValue); setNewValue('') }}
          className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function Account() {
  const { darkMode } = useTheme()
  const {
    categories: customCategories, addCategory, removeCategory,
    statuses: customStatuses, addStatus, removeStatus,
    platforms: customPlatforms, addPlatform, removePlatform,
  } = useData()

  // Profile form state (visual only — no backend)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    businessName: '',
  })

  // Preferences state (visual only — no backend)
  const [currency, setCurrency] = useState('USD')
  const [defaultSaleType, setDefaultSaleType] = useState('shipped')

  // Input fields for adding new items
  const [newCategory, setNewCategory] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [newPlatform, setNewPlatform] = useState('')

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your account information</p>
        </div>

        <div className="p-5 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 relative group cursor-pointer">
              <UserCircle className="w-8 h-8 text-gray-400" />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Profile Photo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upload an avatar</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <UserCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your name"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="you@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name (optional)</label>
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              placeholder="Your store or brand name"
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value="••••••••"
                readOnly
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
            <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-1.5 font-medium">
              Change password
            </button>
          </div>

          {/* Save button */}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Customize how the app works for you</p>
        </div>

        <div className="p-5 space-y-6">
          {/* Currency */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <DollarSign className="w-4 h-4 text-gray-400" />
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputClass}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (&euro;)</option>
              <option value="GBP">GBP (&pound;)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
            </select>
          </div>

          {/* Default Sale Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Truck className="w-4 h-4 text-gray-400" />
              Default Sale Type
            </label>
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setDefaultSaleType('local')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  defaultSaleType === 'local'
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <HandCoins className="w-4 h-4" />
                Local
              </button>
              <button
                onClick={() => setDefaultSaleType('shipped')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  defaultSaleType === 'shipped'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Truck className="w-4 h-4" />
                Shipped
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Pre-selects this when logging a sale</p>
          </div>

          {/* Theme display */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <CircleDot className="w-4 h-4 text-gray-400" />
              Theme
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Currently using <span className="font-medium text-gray-700 dark:text-gray-300">{darkMode ? 'Dark' : 'Light'}</span> mode — toggle with the sun/moon icon in the top bar
            </p>
          </div>
        </div>
      </div>

      {/* Categories Management */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Product categories for organizing your inventory</p>
        </div>
        <div className="p-5">
          <TagList
            items={customCategories}
            onAdd={addCategory}
            onRemove={removeCategory}
            newValue={newCategory}
            setNewValue={setNewCategory}
            placeholder="Add a category..."
            color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          />
        </div>
      </div>

      {/* Statuses Management */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Statuses</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Pipeline stages your products move through</p>
        </div>
        <div className="p-5">
          <TagList
            items={customStatuses}
            onAdd={addStatus}
            onRemove={removeStatus}
            newValue={newStatus}
            setNewValue={setNewStatus}
            placeholder="Add a status..."
            color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          />
        </div>
      </div>

      {/* Platforms Management */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Selling Platforms</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Platforms that appear in your dropdown menus</p>
        </div>
        <div className="p-5">
          <TagList
            items={customPlatforms}
            onAdd={addPlatform}
            onRemove={removePlatform}
            newValue={newPlatform}
            setNewValue={setNewPlatform}
            placeholder="Add a platform..."
            color="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
          />
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
          </div>
        </div>
        <div className="p-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">App</span>
            <span className="font-medium text-gray-900 dark:text-white">StockFlow</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Version</span>
            <span className="font-medium text-gray-900 dark:text-white">0.1.0 (MVP)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Data</span>
            <span className="font-medium text-gray-900 dark:text-white">Local demo (no backend)</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900/50 overflow-hidden">
        <div className="p-5 border-b border-red-200 dark:border-red-900/50">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
        </div>
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Delete Account</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Permanently remove your account and all data</p>
          </div>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
