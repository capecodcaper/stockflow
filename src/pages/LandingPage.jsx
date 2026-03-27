import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import {
  Package,
  TrendingUp,
  BarChart3,
  Zap,
  Sun,
  Moon,
  DollarSign,
  Clock,
  Layers,
  ArrowRight,
  Star,
  Shield,
  Smartphone,
  CheckCircle2,
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Built for ADHD Brains',
    desc: 'One glance tells you everything. Big numbers, color-coded signals, zero clutter.',
    color: 'amber',
  },
  {
    icon: DollarSign,
    title: 'Profit Tracking That Actually Works',
    desc: 'See exactly what you made after fees, shipping, and cost — per item or overall.',
    color: 'green',
  },
  {
    icon: Clock,
    title: 'Kill the Death Pile',
    desc: 'Aging alerts show you what\'s been sitting too long so nothing gets forgotten.',
    color: 'red',
  },
  {
    icon: BarChart3,
    title: 'Reports You\'ll Actually Read',
    desc: 'Visual, scannable reports — not spreadsheets. See your best sellers, worst duds, and trends.',
    color: 'indigo',
  },
  {
    icon: Layers,
    title: 'Multi-Platform Ready',
    desc: 'Track sales across eBay, Mercari, Poshmark, Facebook Marketplace, and more.',
    color: 'purple',
  },
  {
    icon: Smartphone,
    title: 'Works on Your Phone',
    desc: 'Log a sale from the parking lot. Check your numbers from the couch. Mobile-first, always.',
    color: 'sky',
  },
]

const colorMap = {
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    icon: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-200 dark:ring-amber-800',
  },
  green: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-200 dark:ring-emerald-800',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    icon: 'text-red-600 dark:text-red-400',
    ring: 'ring-red-200 dark:ring-red-800',
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    icon: 'text-indigo-600 dark:text-indigo-400',
    ring: 'ring-indigo-200 dark:ring-indigo-800',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    icon: 'text-purple-600 dark:text-purple-400',
    ring: 'ring-purple-200 dark:ring-purple-800',
  },
  sky: {
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    icon: 'text-sky-600 dark:text-sky-400',
    ring: 'ring-sky-200 dark:ring-sky-800',
  },
}

const differentiators = [
  'Generous free tier — not a bait-and-switch',
  'Designed for resellers, not warehouses',
  'ADHD-friendly from day one',
  'Tax-ready exports (Schedule C)',
  'No learning curve — if you can scroll, you can use it',
]

export default function LandingPage() {
  const { darkMode, setDarkMode } = useTheme()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">StockFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Open App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Built by resellers, for resellers
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Know your numbers.
            <br />
            <span className="text-indigo-600 dark:text-indigo-400">Grow your flip.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The inventory tracker that doesn't make your eyes glaze over.
            See what's selling, what's sitting, and what's actually making you money — at a glance.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-base transition-colors shadow-lg shadow-indigo-600/20"
            >
              Try the Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-base transition-colors border border-gray-200 dark:border-gray-700"
            >
              See Features
            </a>
          </div>
        </div>

        {/* Quick stats preview — gives a taste of the dashboard */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { label: 'Total Profit', value: '$4,280', color: 'text-emerald-600 dark:text-emerald-400', icon: TrendingUp },
            { label: 'Items Tracked', value: '47', color: 'text-indigo-600 dark:text-indigo-400', icon: Package },
            { label: 'Sell-Through', value: '73%', color: 'text-amber-600 dark:text-amber-400', icon: BarChart3 },
          ].map(({ label, value, color, icon: Icon }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-center"
            >
              <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
              <div className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need, nothing you don't
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            No bloated features. No enterprise nonsense. Just the stuff that helps you flip smarter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, color }) => {
            const c = colorMap[color]
            return (
              <div
                key={title}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${c.icon}`} />
                </div>
                <h3 className="text-base font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Why StockFlow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 sm:p-12 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Why StockFlow?</h2>
          </div>
          <ul className="space-y-3">
            {differentiators.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Try It Now — It's Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-white" />
            </div>
            StockFlow
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} StockFlow. Built for the flip.
          </p>
        </div>
      </footer>
    </div>
  )
}
