## Session: 2026-03-26

### What was done
- **Initialized git repository** — set up git with commit history so changes can be tracked and rolled back. First commit captures the full project as of last session's cleanup.
- **Refactoring round 2 — deduplicated profit formulas, input styling, and shortDate:**
  - Created `saleNetProfit()`, `saleGrossProfit()`, `saleRevenue()` in helpers.js — replaced 11+ inline copies of the profit calculation formula across 6 files (Sales, SaleDetailPanel, Reports, CustomTab)
  - Created shared `inputClass` and `selectClass` constants in helpers.js — removed 6 local copies from AddSaleModal, ProductDetailPanel (2), Account, SaleFormFields, CustomTab
  - Removed duplicate `shortDate()` from Sales.jsx (was using a local copy instead of the shared one in helpers.js)
- **Sales page: auto-prefill sale price** — when selecting a product in the Log Sale modal, the sale price now auto-fills with that product's listing price (user can still change it)
- **Sales page: edit button on sale detail panel** — added pencil icon in sale detail panel header; clicking it opens a full edit form for sale type, price, quantity, date, platform, fees, shipping, tracking, and buyer name with Save/Cancel buttons
- **Sales page: ADHD-friendly stats redesign** — replaced plain stat boxes with color-tinted cards (blue for revenue, neutral for cost, orange for fees, green/red for profit); Net Profit gets a slightly larger colored number so the eye goes there first; added profit margin % under Net Profit
- **Sales page: time range label** — added an indigo pill next to "Sales Summary" that shows the active time range in plain English (e.g., "Last 30 days", "All time")
- **Deployed to Netlify** — all changes live at `https://stillinventory.netlify.app`

### Current state
- **Pages built:**
  - Dashboard — fully functional (hero profit banner with time range selector, 3 quick stat cards, Kanban board with real product cards, gradient/glow visual treatment)
  - Inventory — fully functional (search, filter, sort, grid/list, add/edit/delete products, Quick Log Sale with fee estimator, qty/remaining on cards)
  - Sales — fully functional (color-tinted summary stats with time range selector + label, filters, sale list with shorthand dates, Log Sale modal with auto-prefill + fee estimator, sale detail panel with full edit mode)
  - Reports — fully functional (5 tabs split into separate files: Overview, Inventory, Sales, Profitability, Custom report builder with 6 filters and card-based results)
  - Account — fully functional for categories/statuses/platforms (changes propagate app-wide via DataContext); profile/preferences still visual-only (no backend)
- **Components:**
  - Layout.jsx, Sidebar.jsx, Header.jsx
  - ProductCard.jsx, AddProductModal.jsx, ProductDetailPanel.jsx (with sub-components: PriceSummary, RestockHistory, EditForm, DetailView, RestockForm, DeleteConfirm, DetailRow)
  - SaleDetailPanel.jsx (now with view mode + full edit mode), AddSaleModal.jsx, SaleFormFields.jsx (shared between AddSaleModal + ProductDetailPanel)
  - reports/ReportWidgets.jsx (StatCard, Section, BarFill)
  - reports/OverviewTab.jsx, InventoryTab.jsx, SalesTab.jsx, ProfitabilityTab.jsx, CustomTab.jsx
- **Shared utilities:**
  - `src/utils/helpers.js` — currency(), pct(), daysAgo(), shortDate(), saleRevenue(), saleGrossProfit(), saleNetProfit(), inputClass, selectClass, statusBadgeColors, statusDotColors, getStatusBadgeColor(), getStatusDotColor()
- **Key features working:**
  - Dark/light mode toggle in header (sun/moon icon)
  - Mobile-responsive layout with hamburger menu
  - Add/edit/delete products with quantity tracking
  - Quick Log Sale from product detail (Local/Shipped toggle with conditional fields)
  - Log Sale from Sales page via modal (auto-prefills listing price + platform)
  - Edit existing sales from sale detail panel (price, qty, date, type, platform, fees, shipping, tracking, buyer)
  - Platform fee auto-estimator in both sale forms (9 platforms with approximate rates)
  - Sales filtering by type, platform, time period
  - Sales summary stats with independent time range selector (1W/1M/3M/6M/1Y/All) + plain-English label
  - Slide-in side panels for product and sale details
  - Dashboard Kanban board with real products grouped by status (supports custom statuses)
  - Dashboard profit stats with time range filtering (Today/7d/30d/90d/All)
  - Shared state across pages via React Context (products, sales, categories, statuses, platforms)
  - Account page categories/statuses/platforms management — changes propagate to all dropdowns and filters app-wide
  - Add More Stock (restock) with weighted average pricing
  - Full Reports suite with custom report builder (group by 6 dimensions, 6 filters including Brand/Source/Condition, sort, card-based results with insight badges)
  - Git version control initialized with commit history
  - Live deployment to Netlify (`https://stillinventory.netlify.app`)
- **Known issues:**
  - Account page profile/preferences don't persist (no backend)
  - Kanban board is read-only (drag-and-drop deferred to backend phase)
  - Photo/receipt upload placeholders are non-functional (need file storage)
  - Reports Overview/Inventory/Sales/Profitability tabs still use old dense bar+text pattern (ADHD audit not yet applied to these tabs)

### What's next
- **Competitor analysis & market research** — user wants to discuss potential competitors, realistic expectations for entering the reseller inventory app market, and timelines for development/launch
- **Frontend polish (see BACKLOG.md):**
  - Inventory page: visual redesign/polish pass
  - Clothing sizes: discuss how to handle (S/M/L, numeric, etc.)
- **ADHD design audit** — apply cleaner visual treatment to the remaining 4 Reports tabs and review Inventory page
- **Backend-dependent features** — see `BACKLOG.md` for full list

### Resume instructions
- Project path: `C:\Users\johnd\OneDrive\Desktop\Claude Stuff\stockflow\`
- Dev server: open terminal in VS Code, make sure it's **Git Bash** (not PowerShell), then run `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npm run dev` — opens at `localhost:5173`
- **Netlify deploy** (after changes): `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npx vite build && netlify deploy --prod --dir=dist`
- **Live URL**: `https://stillinventory.netlify.app`
- Tech stack: React 19 + Vite 8 + Tailwind CSS v4 (via PostCSS) + React Router 7 + Lucide React icons
- State management: React Context API (DataContext for products/sales/categories/statuses/platforms, ThemeContext for dark mode)
- Demo data lives in `src/data/demoProducts.js` (products, sales, constants: platformFeeRates, conditions) — categories/statuses/platforms now managed via DataContext, seeded from demoProducts defaults
- Shared utilities live in `src/utils/helpers.js` (currency, pct, daysAgo, shortDate, sale profit calcs, shared input/select styles, status colors)
- Feature backlog lives in `BACKLOG.md` at project root
- Git initialized — commit after changes with `git add` + `git commit`
- The user is not code-savvy — always explain in plain language and give exact terminal instructions
- All data is currently demo/local state (no backend yet)
- "StockFlow" is a placeholder name — may change later
- User prefers side panel popouts over inline expand, mobile-first design
- User wants honest pushback on bad ideas with reasoning and brief alternatives
- The purpose of the MVP is as a visual spec — so the user can show a developer exactly what they want without endless back-and-forth
- **Target audience:** small-time resellers/flippers, laptops/phones/tablets, ADHD-friendly design is critical
- **ADHD design rules:** one big number pops, color tells the story, leaderboard over grids, less is more, subtle background cues — but NOT gaudy (no full-width gradient banners)
- **Codebase is clean and well-organized** — shared utilities, split components, no major duplication
- **Deploy after every change** — user wants Netlify always up to date

---

## Session: 2026-03-25

### What was done
- **Created shared utilities file (`src/utils/helpers.js`)** — centralized `currency()`, `pct()`, `daysAgo()`, `shortDate()`, status badge colors, and status dot colors. Eliminated duplication from 4+ files that each had their own copy.
- **Split Reports.jsx (1,373 lines) into 7 files:**
  - `Reports.jsx` (~120 lines) — slim orchestrator, tab switching + shared data computation
  - `reports/ReportWidgets.jsx` — shared StatCard, Section, BarFill components
  - `reports/OverviewTab.jsx` — business health overview
  - `reports/InventoryTab.jsx` — stock analysis
  - `reports/SalesTab.jsx` — revenue analysis
  - `reports/ProfitabilityTab.jsx` — margins, ROI, top performers
  - `reports/CustomTab.jsx` — build-your-own report with 6 filters
- **Extracted shared SaleFormFields component** — the sale form (type toggle, price, qty, platform, fees, shipping, tracking, buyer name) was duplicated in AddSaleModal and ProductDetailPanel. Now both use one shared `SaleFormFields.jsx`.
- **Broke up ProductDetailPanel (818→~500 lines main + sub-components)** — extracted `PriceSummary`, `RestockHistory`, `EditForm`, `DetailView`, `RestockForm`, `DeleteConfirm`, `DetailRow` as focused sub-components within the file.
- **Cleaned up Account.jsx** — moved `TagList` component outside the main function to avoid re-creation on every render.
- **Wired shared status colors everywhere** — replaced hardcoded status color maps in ProductCard, ProductDetailPanel, Inventory, and Reports with `getStatusBadgeColor()` / `getStatusDotColor()` from utils.
- **JS bundle shrank from 413KB to 405KB** — less duplicated code = smaller output.
- **Deployed to Netlify** — all changes live at `https://stillinventory.netlify.app`

### Current state
- **Pages built:**
  - Dashboard — fully functional (hero profit banner with time range selector, 3 quick stat cards, Kanban board with real product cards, gradient/glow visual treatment)
  - Inventory — fully functional (search, filter, sort, grid/list, add/edit/delete products, Quick Log Sale with fee estimator, qty/remaining on cards)
  - Sales — fully functional (summary stats with time range selector, filters, sale list with shorthand dates, Log Sale modal with fee estimator, sale detail panel)
  - Reports — fully functional (5 tabs split into separate files: Overview, Inventory, Sales, Profitability, Custom report builder with 6 filters and card-based results)
  - Account — fully functional for categories/statuses/platforms (changes propagate app-wide via DataContext); profile/preferences still visual-only (no backend)
- **Components:**
  - Layout.jsx, Sidebar.jsx, Header.jsx
  - ProductCard.jsx, AddProductModal.jsx, ProductDetailPanel.jsx (with sub-components: PriceSummary, RestockHistory, EditForm, DetailView, RestockForm, DeleteConfirm, DetailRow)
  - SaleDetailPanel.jsx, AddSaleModal.jsx, SaleFormFields.jsx (shared between AddSaleModal + ProductDetailPanel)
  - reports/ReportWidgets.jsx (StatCard, Section, BarFill)
  - reports/OverviewTab.jsx, InventoryTab.jsx, SalesTab.jsx, ProfitabilityTab.jsx, CustomTab.jsx
- **Shared utilities:**
  - `src/utils/helpers.js` — currency(), pct(), daysAgo(), shortDate(), statusBadgeColors, statusDotColors, getStatusBadgeColor(), getStatusDotColor()
- **Key features working:**
  - Dark/light mode toggle in header (sun/moon icon)
  - Mobile-responsive layout with hamburger menu
  - Add/edit/delete products with quantity tracking
  - Quick Log Sale from product detail (Local/Shipped toggle with conditional fields)
  - Log Sale from Sales page via modal
  - Platform fee auto-estimator in both sale forms (9 platforms with approximate rates)
  - Sales filtering by type, platform, time period
  - Sales summary stats with independent time range selector (1W/1M/3M/6M/1Y/All)
  - Slide-in side panels for product and sale details
  - Dashboard Kanban board with real products grouped by status (supports custom statuses)
  - Dashboard profit stats with time range filtering (Today/7d/30d/90d/All)
  - Shared state across pages via React Context (products, sales, categories, statuses, platforms)
  - Account page categories/statuses/platforms management — changes propagate to all dropdowns and filters app-wide
  - Add More Stock (restock) with weighted average pricing
  - Full Reports suite with custom report builder (group by 6 dimensions, 6 filters including Brand/Source/Condition, sort, card-based results with insight badges)
  - Live deployment to Netlify (`https://stillinventory.netlify.app`)
- **Known issues:**
  - Account page profile/preferences don't persist (no backend)
  - Kanban board is read-only (drag-and-drop deferred to backend phase)
  - Photo/receipt upload placeholders are non-functional (need file storage)
  - Reports Overview/Inventory/Sales/Profitability tabs still use old dense bar+text pattern (ADHD audit not yet applied to these tabs)

### What's next
- **Frontend polish (see BACKLOG.md):**
  - Sales page: tighten up chart + auto-prefill item cost
  - Sales page: edit button on individual sale logs
  - Inventory page: visual redesign/polish pass
  - Clothing sizes: discuss how to handle (S/M/L, numeric, etc.)
- **ADHD design audit** — apply cleaner visual treatment to the remaining 4 Reports tabs and review Inventory + Sales pages
- **Backend-dependent features** — see `BACKLOG.md` for full list

### Resume instructions
- Project path: `C:\Users\johnd\OneDrive\Desktop\Claude Stuff\stockflow\`
- Dev server: open terminal in VS Code, make sure it's **Git Bash** (not PowerShell), then run `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npm run dev` — opens at `localhost:5173`
- **Netlify deploy** (after changes): `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npx vite build && netlify deploy --prod --dir=dist`
- **Live URL**: `https://stillinventory.netlify.app`
- Tech stack: React 19 + Vite 8 + Tailwind CSS v4 (via PostCSS) + React Router 7 + Lucide React icons
- State management: React Context API (DataContext for products/sales/categories/statuses/platforms, ThemeContext for dark mode)
- Demo data lives in `src/data/demoProducts.js` (products, sales, constants: platformFeeRates, conditions) — categories/statuses/platforms now managed via DataContext, seeded from demoProducts defaults
- Shared utilities live in `src/utils/helpers.js` (currency, pct, daysAgo, shortDate, status colors)
- Feature backlog lives in `BACKLOG.md` at project root
- The user is not code-savvy — always explain in plain language and give exact terminal instructions
- All data is currently demo/local state (no backend yet)
- "StockFlow" is a placeholder name — may change later
- User prefers side panel popouts over inline expand, mobile-first design
- User wants honest pushback on bad ideas with reasoning and brief alternatives
- The purpose of the MVP is as a visual spec — so the user can show a developer exactly what they want without endless back-and-forth
- **Target audience:** small-time resellers/flippers, laptops/phones/tablets, ADHD-friendly design is critical
- **ADHD design rules:** one big number pops, color tells the story, leaderboard over grids, less is more, subtle background cues
- **Codebase is now clean and well-organized** — ready for a developer to pick up
- **Next session priority:** frontend polish items from BACKLOG.md, then ADHD design audit on remaining pages
- **Deploy after every change** — user wants Netlify always up to date

---

## Session: 2026-03-22

### What was done
- **Deleted Reports.v3.jsx** — removed 1,373 lines of dead backup code (old Custom tab design before the Brand/Source/Condition filters were added)
- **Changed date format on Sales page** — sale dates now display as day-month-year shorthand (e.g. "1 Mar 26") instead of raw "2026-03-01"
- **Added time range selector to Sales summary stats** — the 4 stat cards (Revenue, Cost, Fees, Net Profit) are now grouped inside a single card with a 1W / 1M / 3M / 6M / 1Y / All toggle; stats update independently from the list filters below
- **Added Qty and Remaining to product cards** — inventory cards now show total quantity and remaining stock on the face, with remaining turning red when it hits 0
- **Updated BACKLOG.md** with new frontend polish items:
  - Sales page: tighten up chart + auto-prefill item cost
  - Sales page: edit button on individual sale logs
  - Clothing sizes: need to discuss how to handle (S/M/L, numeric, etc.)
  - Inventory page: visual redesign pass to make it more attractive
- **Reviewed codebase for cleanup** — identified key problems (Reports.jsx 1,373-line monster, ProductDetailPanel 818-line god component, duplicated sale form logic, repeated status colors in 4 files, currency helper written 3 times) and created a cleanup plan
- **Deployed to Netlify** — all changes live at `https://stillinventory.netlify.app`

### Current state
- **Pages built:**
  - Dashboard — fully functional (hero profit banner with time range selector, 3 quick stat cards, Kanban board with real product cards, gradient/glow visual treatment)
  - Inventory — fully functional (search, filter, sort, grid/list, add/edit/delete products, Quick Log Sale with fee estimator, qty/remaining on cards)
  - Sales — fully functional (summary stats with time range selector, filters, sale list with shorthand dates, Log Sale modal with fee estimator, sale detail panel)
  - Reports — fully functional (5 tabs: Overview, Inventory, Sales, Profitability, Custom report builder with 6 filters and card-based results)
  - Account — fully functional for categories/statuses/platforms (changes propagate app-wide via DataContext); profile/preferences still visual-only (no backend)
- **Components:**
  - Layout.jsx, Sidebar.jsx, Header.jsx
  - ProductCard.jsx, AddProductModal.jsx, ProductDetailPanel.jsx
  - SaleDetailPanel.jsx, AddSaleModal.jsx
  - Reports.jsx (self-contained — includes OverviewTab, InventoryTab, SalesTab, ProfitabilityTab, CustomTab, StatCard, Section, BarFill helpers)
- **Key features working:**
  - Dark/light mode toggle in header (sun/moon icon)
  - Mobile-responsive layout with hamburger menu
  - Add/edit/delete products with quantity tracking
  - Quick Log Sale from product detail (Local/Shipped toggle with conditional fields)
  - Log Sale from Sales page via modal
  - Platform fee auto-estimator in both sale forms (9 platforms with approximate rates)
  - Sales filtering by type, platform, time period
  - Sales summary stats with independent time range selector (1W/1M/3M/6M/1Y/All)
  - Slide-in side panels for product and sale details
  - Dashboard Kanban board with real products grouped by status (supports custom statuses)
  - Dashboard profit stats with time range filtering (Today/7d/30d/90d/All)
  - Shared state across pages via React Context (products, sales, categories, statuses, platforms)
  - Account page categories/statuses/platforms management — changes propagate to all dropdowns and filters app-wide
  - Add More Stock (restock) with weighted average pricing
  - Full Reports suite with custom report builder (group by 6 dimensions, 6 filters including Brand/Source/Condition, sort, card-based results with insight badges)
  - Live deployment to Netlify (`https://stillinventory.netlify.app`)
- **Known issues:**
  - **Code needs cleanup/refactor** — Reports.jsx (1,373 lines, 5 tabs in one file), ProductDetailPanel (818 lines, 13+ useState), duplicated sale form logic, status colors repeated in 4 files, currency helper written 3 times
  - Account page profile/preferences don't persist (no backend)
  - Kanban board is read-only (drag-and-drop deferred to backend phase)
  - Photo/receipt upload placeholders are non-functional (need file storage)
  - Reports Overview/Inventory/Sales/Profitability tabs still use old dense bar+text pattern (ADHD audit not yet applied to these tabs)

### What's next
- **CODE CLEANUP (priority)** — plan is ready:
  1. Create shared utilities (currency formatter, status colors)
  2. Split Reports.jsx into 5 separate tab files
  3. Extract shared SaleForm component (consolidate AddSaleModal + ProductDetailPanel sale logic)
  4. Break up ProductDetailPanel into smaller pieces
  5. Clean up Account.jsx unused state, inconsistent input styling
- **Frontend polish (see BACKLOG.md):**
  - Sales page: tighten up chart + auto-prefill item cost
  - Sales page: edit button on individual sale logs
  - Inventory page: visual redesign/polish pass
  - Clothing sizes: discuss how to handle
- **ADHD design audit** — apply cleaner visual treatment to the remaining 4 Reports tabs and review Inventory + Sales pages
- **Backend-dependent features** — see `BACKLOG.md` for full list

### Resume instructions
- Project path: `C:\Users\johnd\OneDrive\Desktop\Claude Stuff\stockflow\`
- Dev server: open terminal in VS Code, make sure it's **Git Bash** (not PowerShell), then run `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npm run dev` — opens at `localhost:5173`
- **Netlify deploy** (after changes): `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npx vite build && netlify deploy --prod --dir=dist`
- **Live URL**: `https://stillinventory.netlify.app`
- Tech stack: React 19 + Vite 8 + Tailwind CSS v4 (via PostCSS) + React Router 7 + Lucide React icons
- State management: React Context API (DataContext for products/sales/categories/statuses/platforms, ThemeContext for dark mode)
- Demo data lives in `src/data/demoProducts.js` (products, sales, constants: platformFeeRates, conditions) — categories/statuses/platforms now managed via DataContext, seeded from demoProducts defaults
- Feature backlog lives in `BACKLOG.md` at project root
- The user is not code-savvy — always explain in plain language and give exact terminal instructions
- All data is currently demo/local state (no backend yet)
- "StockFlow" is a placeholder name — may change later
- User prefers side panel popouts over inline expand, mobile-first design
- User wants honest pushback on bad ideas with reasoning and brief alternatives
- The purpose of the MVP is as a visual spec — so the user can show a developer exactly what they want without endless back-and-forth
- **Target audience:** small-time resellers/flippers, laptops/phones/tablets, ADHD-friendly design is critical
- **ADHD design rules:** one big number pops, color tells the story, leaderboard over grids, less is more, subtle background cues
- **Next session priority:** code cleanup/refactor (plan ready), then frontend polish items from BACKLOG.md
- **Deploy after every change** — user wants Netlify always up to date

---

## Session: 2026-03-18

### What was done
- **Redesigned Custom Reports tab (v4 "Focus Mode")**:
  - Replaced 4 equal-weight stat cards with ONE hero profit banner (big number, colored background)
  - Replaced leaderboard rows + detailed comparison table + insights section with card grid — each group gets its own card with big profit number, colored left accent bar, and insight badges baked in ("Top Profit", "Best ROI", "Highest Fees")
  - Removed the separate "Detailed Comparison" table and "Quick Insights" section entirely — that info is now folded into the cards
  - Saved previous version as `Reports.v3.jsx` for rollback
- **Added 3 new filters to Custom Reports tab**: Brand, Source, and Condition — users can now stack filters to drill down to specifics like "Nike on eBay" or "New items from Goodwill"
  - Filter badge count updated to reflect all 6 filters
  - "Clear all filters" button resets all 6
- **Wired categories/statuses/platforms through the entire app via DataContext**:
  - Added `categories`, `statuses`, `platforms` state + add/remove methods to DataContext
  - Account page now actually updates categories/statuses/platforms app-wide (no longer isolated local state)
  - Inventory page filter dropdowns pull from shared state
  - AddProductModal category/status dropdowns pull from shared state
  - ProductDetailPanel edit dropdowns pull from shared state
  - AddSaleModal platform dropdown pulls from shared state
  - Reports Custom tab filter dropdowns pull from shared state
  - Removed hardcoded imports of `categories`/`statuses`/`sellingPlatforms` from individual components
- **Redesigned Dashboard (ADHD-friendly, 2 iterations)**:
  - v1: Hero profit banner + 3 quick stat cards + upgraded Kanban cards with accent bars
  - v2 (final): Added gradient backgrounds, decorative glow orbs, frosted glass money flow cards, gradient top bars on stat cards, colored icon badges, thicker gradient progress bar for sell-through, hover lift effects on Kanban cards, empty state placeholders with icons
  - Added **net profit calculation** to Dashboard (was missing — only had revenue before)
  - Added **time period selector** (Today / 7 Days / 30 Days / 90 Days / All Time) to hero banner — all profit stats update based on selection
  - Kanban now uses statuses from DataContext (supports custom statuses from Account page)
- **Deployed to Netlify**: app is live at `https://stillinventory.netlify.app`
  - Installed `netlify-cli` globally
  - Set up auto-deploy workflow: `npx vite build && netlify deploy --prod --dir=dist`
- **Code quality note**: The codebase has accumulated mess over 4 sessions of rapid feature iteration — needs a cleanup/refactor pass next session

### Current state
- **Pages built:**
  - Dashboard — fully functional (hero profit banner with time range selector, 3 quick stat cards, Kanban board with real product cards, gradient/glow visual treatment)
  - Inventory — fully functional (search, filter, sort, grid/list, add/edit/delete products, Quick Log Sale with fee estimator)
  - Sales — fully functional (summary cards, filters, sale list, Log Sale modal with fee estimator, sale detail panel)
  - Reports — fully functional (5 tabs: Overview, Inventory, Sales, Profitability, Custom report builder with 6 filters and card-based results)
  - Account — fully functional for categories/statuses/platforms (changes propagate app-wide via DataContext); profile/preferences still visual-only (no backend)
- **Components:**
  - Layout.jsx, Sidebar.jsx, Header.jsx
  - ProductCard.jsx, AddProductModal.jsx, ProductDetailPanel.jsx
  - SaleDetailPanel.jsx, AddSaleModal.jsx
  - Reports.jsx (self-contained — includes OverviewTab, InventoryTab, SalesTab, ProfitabilityTab, CustomTab, StatCard, Section, BarFill helpers)
  - Reports.v3.jsx (backup of previous Custom tab design)
- **Key features working:**
  - Dark/light mode toggle in header (sun/moon icon)
  - Mobile-responsive layout with hamburger menu
  - Add/edit/delete products with quantity tracking
  - Quick Log Sale from product detail (Local/Shipped toggle with conditional fields)
  - Log Sale from Sales page via modal
  - Platform fee auto-estimator in both sale forms (9 platforms with approximate rates)
  - Sales filtering by type, platform, time period
  - Slide-in side panels for product and sale details
  - Dashboard Kanban board with real products grouped by status (supports custom statuses)
  - Dashboard profit stats with time range filtering (Today/7d/30d/90d/All)
  - Shared state across pages via React Context (products, sales, categories, statuses, platforms)
  - Account page categories/statuses/platforms management — changes propagate to all dropdowns and filters app-wide
  - Add More Stock (restock) with weighted average pricing
  - Full Reports suite with custom report builder (group by 6 dimensions, 6 filters including Brand/Source/Condition, sort, card-based results with insight badges)
  - Live deployment to Netlify (`https://stillinventory.netlify.app`)
- **Known issues:**
  - **Code needs cleanup/refactor** — accumulated mess from rapid iteration across 4 sessions; components are bloated, inconsistent patterns, some duplicated logic
  - Account page profile/preferences don't persist (no backend)
  - Kanban board is read-only (drag-and-drop deferred to backend phase)
  - Photo/receipt upload placeholders are non-functional (need file storage)
  - Reports Overview/Inventory/Sales/Profitability tabs still use old dense bar+text pattern (ADHD audit not yet applied to these tabs)

### What's next
- **CODE CLEANUP (priority)** — refactor messy JSX across the app: break up bloated components, remove duplication, establish consistent patterns, clean up unused imports/variables
- **ADHD design audit** — apply cleaner visual treatment to the remaining 4 Reports tabs (Overview, Inventory, Sales, Profitability) and review Inventory + Sales pages
- **Frontend polish (no backend needed):**
  - Any other UI tweaks or layout changes to refine before handing off
- **Backend-dependent features** — see `BACKLOG.md` for full list:
  - Drag-and-drop Kanban with custom user columns
  - Receipt & photo uploads (file storage)
  - User accounts & auth
  - Persistent data (database)
  - Analytics dashboard
  - Deploy to live URL (already on Netlify but no backend yet)

### Resume instructions
- Project path: `C:\Users\johnd\OneDrive\Desktop\Claude Stuff\stockflow\`
- Dev server: open terminal in VS Code, make sure it's **Git Bash** (not PowerShell), then run `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npm run dev` — opens at `localhost:5173`
- **Netlify deploy** (after changes): `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npx vite build && netlify deploy --prod --dir=dist`
- **Live URL**: `https://stillinventory.netlify.app`
- Tech stack: React 19 + Vite 8 + Tailwind CSS v4 (via PostCSS) + React Router 7 + Lucide React icons
- State management: React Context API (DataContext for products/sales/categories/statuses/platforms, ThemeContext for dark mode)
- Demo data lives in `src/data/demoProducts.js` (products, sales, constants: platformFeeRates, conditions) — categories/statuses/platforms now managed via DataContext, seeded from demoProducts defaults
- Feature backlog lives in `BACKLOG.md` at project root
- The user is not code-savvy — always explain in plain language and give exact terminal instructions
- All data is currently demo/local state (no backend yet)
- "StockFlow" is a placeholder name — may change later
- User prefers side panel popouts over inline expand, mobile-first design
- User wants honest pushback on bad ideas with reasoning and brief alternatives
- The purpose of the MVP is as a visual spec — so the user can show a developer exactly what they want without endless back-and-forth
- **Target audience:** small-time resellers/flippers, laptops/phones/tablets, ADHD-friendly design is critical
- **ADHD design rules:** one big number pops, color tells the story, leaderboard over grids, less is more, subtle background cues
- **Next session priority:** code cleanup/refactor first, then continue ADHD design audit on remaining pages
- **Deploy after every change** — user wants Netlify always up to date

---

## Session: 2026-03-15

### What was done
- Built full **Reports page** with 5 tabs:
  - **Overview** — net profit, revenue, in-stock units, sell-through rate, revenue vs expenses breakdown, quick stats (ROI, avg sale price, potential revenue, fee %), monthly sales trend
  - **Inventory** — total products, invested, unsold stock, potential revenue, breakdown by category and status with visual bars, inventory aging buckets (0–14, 15–30, 31–60, 60+ days) with per-item detail, slow movers alert (items listed 30+ days)
  - **Sales** — total sales, revenue, shipped vs local breakdown, revenue by platform, revenue by category, local vs shipped side-by-side comparison, full sales detail table
  - **Profitability** — net profit, margin %, ROI, total fees+shipping, top 5 sales by profit (ranked with badges), top 5 by ROI, profit by platform with margin, fee impact analysis table
  - **Custom** — "Build Your Own Report" with 6 group-by dimensions (Platform, Category, Brand, Source, Condition, Sale Type), time range filter (All/7/30/90 days), additional filters (platform, category, sale type), 6 sort options, ADHD-friendly ranked leaderboard with background color bars, detailed comparison table with totals row, auto-generated Quick Insights cards
- Added Reports to sidebar navigation (BarChart3 icon, between Sales and Account)
- Added `/reports` route and header title mapping
- Redesigned Custom tab results section twice for ADHD-friendly readability:
  - v1: dense bar+text (rejected — too much small text crammed together)
  - v2: card grid with 4 stat boxes (rejected — too many equal-weight elements competing)
  - v3 (final): clean leaderboard rows with subtle background profit bars, one big profit number on the right, secondary stats (margin/ROI) tucked to the side
- Established **target audience** and **ADHD-friendly design principles** as core project guidelines:
  - Target: small-time resellers/flippers on laptops, phones, tablets
  - Design: one big number pops, color tells the story, less is more, leaderboard over grids
- Saved new memory: `feedback_adhd_design.md` with detailed design rules
- Updated `project_stockflow.md` with target audience definition

### Current state
- **Pages built:**
  - Dashboard — fully functional (live stats from DataContext, Kanban board with real product cards, clickable to open detail panel)
  - Inventory — fully functional (search, filter, sort, grid/list, add/edit/delete products, Quick Log Sale with fee estimator)
  - Sales — fully functional (summary cards, filters, sale list, Log Sale modal with fee estimator, sale detail panel)
  - Reports — fully functional (5 tabs: Overview, Inventory, Sales, Profitability, Custom report builder)
  - Account — fully built UI (profile, preferences, categories/statuses/platforms management, app info, danger zone) — no backend persistence yet
- **Components:**
  - Layout.jsx, Sidebar.jsx, Header.jsx
  - ProductCard.jsx, AddProductModal.jsx, ProductDetailPanel.jsx
  - SaleDetailPanel.jsx, AddSaleModal.jsx
  - Reports.jsx (self-contained — includes OverviewTab, InventoryTab, SalesTab, ProfitabilityTab, CustomTab, StatCard, Section, BarFill helper components)
- **Key features working:**
  - Dark/light mode toggle in header (sun/moon icon)
  - Mobile-responsive layout with hamburger menu
  - Add/edit/delete products with quantity tracking
  - Quick Log Sale from product detail (Local/Shipped toggle with conditional fields)
  - Log Sale from Sales page via modal
  - Platform fee auto-estimator in both sale forms (9 platforms with approximate rates)
  - Sales filtering by type, platform, time period
  - Slide-in side panels for product and sale details
  - Dashboard Kanban board with real products grouped by status
  - Dashboard stats computed from live data
  - Shared state across pages via React Context
  - Account page with customizable categories, statuses, and platforms lists
  - Add More Stock (restock) with weighted average pricing
  - Full Reports suite with custom report builder (group by 6 dimensions, filter, sort, auto-insights)
- **Known issues:**
  - Account page settings don't persist (no backend) — categories/statuses/platforms edited here don't affect the rest of the app yet (they use the constants from demoProducts.js)
  - Kanban board is read-only (drag-and-drop deferred to backend phase)
  - Photo/receipt upload placeholders are non-functional (need file storage)
  - Reports page should be audited against ADHD-friendly design principles — the other 4 tabs (Overview, Inventory, Sales, Profitability) still use the dense bar+text pattern that was rejected in the Custom tab

### What's next
- **Start next session with a to-do list** — include optional items and a design discussion about ADHD-friendly choices for the target audience
- **ADHD design audit** — review all existing pages (Dashboard, Inventory, Sales, Reports tabs) against the new design principles and clean up any dense/cluttered sections
- **Frontend polish (no backend needed):**
  - Apply ADHD-friendly leaderboard/clean row patterns to the other 4 Reports tabs (Overview, Inventory, Sales, Profitability) to match the Custom tab's cleaner style
  - Any other UI tweaks or layout changes to refine before handing off
- **Backend-dependent features** — see `BACKLOG.md` for full list:
  - Drag-and-drop Kanban with custom user columns
  - Receipt & photo uploads (file storage)
  - User accounts & auth
  - Persistent data (database)
  - Wire Account page settings to actually update the app's categories/statuses/platforms
  - Analytics dashboard
  - Deploy to live URL

### Resume instructions
- Project path: `C:\Users\johnd\OneDrive\Desktop\Claude Stuff\stockflow\`
- Dev server: open terminal in VS Code, make sure it's **Git Bash** (not PowerShell), then run `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npm run dev` — opens at `localhost:5173`
- Tech stack: React 19 + Vite 8 + Tailwind CSS v4 (via PostCSS) + React Router 7 + Lucide React icons
- State management: React Context API (DataContext for products/sales, ThemeContext for dark mode)
- Demo data lives in `src/data/demoProducts.js` (products, sales, constants: sellingPlatforms, platformFeeRates, categories, statuses, conditions)
- Feature backlog lives in `BACKLOG.md` at project root
- The user is not code-savvy — always explain in plain language and give exact terminal instructions
- All data is currently demo/local state (no backend yet)
- "StockFlow" is a placeholder name — may change later
- User prefers side panel popouts over inline expand, mobile-first design
- User wants honest pushback on bad ideas with reasoning and brief alternatives
- The purpose of the MVP is as a visual spec — so the user can show a developer exactly what they want without endless back-and-forth
- **Target audience:** small-time resellers/flippers, laptops/phones/tablets, ADHD-friendly design is critical
- **ADHD design rules:** one big number pops, color tells the story, leaderboard over grids, less is more, subtle background cues
- **Next session:** start with a to-do list (including optional items) and discuss design choices for the target audience

---

## Session: 2026-03-14

### What was done
- Removed Receipts page, sidebar link, route, and header title (receipts moved to per-product concept via placeholders in ProductDetailPanel)
- Wired Dashboard stats to live data from DataContext (Total Products, Total Invested, Total Revenue, Items Sold — all computed from real products/sales)
- Built Kanban board on Dashboard with real product mini-cards grouped by status (Sourced, In Hand, Listed, Sold), color-coded columns with count badges, clickable cards that open ProductDetailPanel
- Moved dark/light mode toggle from sidebar bottom to header (sun/moon icon in upper right)
- Built full Account page with: profile section (avatar, name, email, business name, password), preferences (currency, default sale type, theme display), customizable tag lists for categories/statuses/selling platforms, app info section, danger zone (delete account)
- Added platform fee estimator — auto-fills estimated platform fees when logging a sale based on selected platform and sale price (works in both AddSaleModal and Quick Log Sale in ProductDetailPanel)
- Added `platformFeeRates` to demoProducts.js with approximate rates for all 9 platforms
- Fixed 0% fee platforms (Facebook Marketplace, OfferUp) not clearing prior platform's estimate
- Created BACKLOG.md for tracking features that need a backend developer
- Saved user preference: wants honest pushback on bad ideas with reasoning

### Current state
- **Pages built:**
  - Dashboard — fully functional (live stats from DataContext, Kanban board with real product cards, clickable to open detail panel)
  - Inventory — fully functional (search, filter, sort, grid/list, add/edit/delete products, Quick Log Sale with fee estimator)
  - Sales — fully functional (summary cards, filters, sale list, Log Sale modal with fee estimator, sale detail panel)
  - Account — fully built UI (profile, preferences, categories/statuses/platforms management, app info, danger zone) — no backend persistence yet
- **Components:**
  - Layout.jsx, Sidebar.jsx, Header.jsx
  - ProductCard.jsx, AddProductModal.jsx, ProductDetailPanel.jsx
  - SaleDetailPanel.jsx, AddSaleModal.jsx
- **Key features working:**
  - Dark/light mode toggle in header (sun/moon icon)
  - Mobile-responsive layout with hamburger menu
  - Add/edit/delete products with quantity tracking
  - Quick Log Sale from product detail (Local/Shipped toggle with conditional fields)
  - Log Sale from Sales page via modal
  - Platform fee auto-estimator in both sale forms (9 platforms with approximate rates)
  - Sales filtering by type, platform, time period
  - Slide-in side panels for product and sale details
  - Dashboard Kanban board with real products grouped by status
  - Dashboard stats computed from live data
  - Shared state across pages via React Context
  - Account page with customizable categories, statuses, and platforms lists
  - Add More Stock (restock) with weighted average pricing
- **Known issues:**
  - Account page settings don't persist (no backend) — categories/statuses/platforms edited here don't affect the rest of the app yet (they use the constants from demoProducts.js)
  - Kanban board is read-only (drag-and-drop deferred to backend phase)
  - Photo/receipt upload placeholders are non-functional (need file storage)

### What's next
- All remaining features require a backend — see `BACKLOG.md` for the full list:
  - Drag-and-drop Kanban with custom user columns
  - Receipt & photo uploads (file storage)
  - User accounts & auth
  - Persistent data (database)
  - Wire Account page settings to actually update the app's categories/statuses/platforms
  - Analytics dashboard
  - Deploy to live URL
- **Frontend polish (no backend needed):**
  - Any UI tweaks or layout changes the user wants to refine before handing off

### Resume instructions
- Project path: `C:\Users\johnd\OneDrive\Desktop\Claude Stuff\stockflow\`
- Dev server: open terminal in VS Code, make sure it's **Git Bash** (not PowerShell), then run `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npm run dev` — opens at `localhost:5173`
- Tech stack: React 19 + Vite 8 + Tailwind CSS v4 (via PostCSS) + React Router 7 + Lucide React icons
- State management: React Context API (DataContext for products/sales, ThemeContext for dark mode)
- Demo data lives in `src/data/demoProducts.js` (products, sales, constants: sellingPlatforms, platformFeeRates, categories, statuses, conditions)
- Feature backlog lives in `BACKLOG.md` at project root
- The user is not code-savvy — always explain in plain language and give exact terminal instructions
- All data is currently demo/local state (no backend yet)
- "StockFlow" is a placeholder name — may change later
- User prefers side panel popouts over inline expand, mobile-first design
- User wants honest pushback on bad ideas with reasoning and brief alternatives
- The purpose of the MVP is as a visual spec — so the user can show a developer exactly what they want without endless back-and-forth

---

## Session: 2026-03-13

### What was done
- Full project setup from scratch: React 19 + Vite 8 + Tailwind CSS v4 (via PostCSS) + React Router 7
- Built all core layout components: Sidebar (mobile slide-in + desktop collapsible), Header (hamburger menu, search, Add Product button), Layout (responsive)
- Built Dashboard page with stat cards (Total Products, Total Invested, Total Revenue, Items Sold) and Kanban board placeholder
- Built Inventory page with search, category/status filters, 6 sort options, grid/list view toggle
- Built ProductCard component (photo placeholder, status badge, quantity badge, profit %)
- Built AddProductModal with full form (photo placeholder, name, category, brand, size, condition, quantity, prices, status, source, platform, notes)
- Built ProductDetailPanel (slide-in from right) with view/edit modes, Quick Log Sale with Local/Shipped toggle, delete with confirmation
- Built Sales page with summary cards (Revenue, Cost, Fees, Net Profit), filters (Type, Platform, Time Period), search, and responsive mobile/desktop layouts
- Built SaleDetailPanel (slide-in) for viewing/editing existing sales with dispute status, "More Details" collapsible section
- Built AddSaleModal for logging sales from the Sales page with product dropdown
- Created DataContext (shared state for products + sales across all pages) and ThemeContext (dark/light mode with localStorage)
- Created demo data: 12 products (quantity-aware) and 5 linked sales in demoProducts.js
- Added `sellingPlatforms` array to demoProducts.js for dropdown use
- Made entire app mobile-responsive with hamburger menu, responsive grids, and breakpoint-aware layouts
- Removed incomplete field amber notifications per user feedback
- Created `/closeinv` and `/startinv` custom commands for session management
- Added platform select dropdown with "Other" option to AddSaleModal and Quick Log Sale
- Added all detail fields inline (shipping cost, platform fees, tracking number) to AddSaleModal and Quick Log Sale
- Added "Add More Stock" restock feature to ProductDetailPanel with weighted average pricing

### Current state
- **Pages built:**
  - Dashboard — functional (hardcoded demo stats, Kanban placeholder)
  - Inventory — fully functional (search, filter, sort, grid/list, add/edit/delete products, Quick Log Sale)
  - Sales — fully functional (summary cards, filters, sale list, Log Sale modal, sale detail panel)
  - Receipts — placeholder only
  - Account — placeholder only
- **Components:**
  - Layout.jsx, Sidebar.jsx, Header.jsx
  - ProductCard.jsx, AddProductModal.jsx, ProductDetailPanel.jsx
  - SaleDetailPanel.jsx, AddSaleModal.jsx
- **Key features working:**
  - Dark/light mode toggle with system preference detection
  - Mobile-responsive layout with hamburger menu
  - Add/edit/delete products with quantity tracking
  - Quick Log Sale from product detail (Local/Shipped toggle with conditional fields)
  - Log Sale from Sales page via modal
  - Platform select dropdown with "Other" option in both sale forms
  - All sale detail fields inline (shipping cost, platform fees, tracking number)
  - Sales filtering by type, platform, time period
  - Slide-in side panels for product and sale details
  - Shared state across pages via React Context
  - Add More Stock with weighted average pricing

### What's next
- Wire Dashboard to live data from DataContext
- Remove Receipts page, move to per-product feature
- Build Account page
- Build Kanban drag-and-drop on Dashboard
- Analytics features (future)
- Deploy to URL (future)

### Resume instructions
- Project path: `C:\Users\johnd\OneDrive\Desktop\Claude Stuff\stockflow\`
- Dev server: open terminal in VS Code, make sure it's **Git Bash** (not PowerShell), then run `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npm run dev` — opens at `localhost:5173`
- Tech stack: React 19 + Vite 8 + Tailwind CSS v4 (via PostCSS) + React Router 7 + Lucide React icons
- State management: React Context API (DataContext for products/sales, ThemeContext for dark mode)
- Demo data lives in `src/data/demoProducts.js` (products, sales, constants like sellingPlatforms, categories, statuses, conditions)
- The user is not code-savvy — always explain in plain language and give exact terminal instructions
- All data is currently demo/local state (no backend yet)
- "StockFlow" is a placeholder name — may change later
- User prefers side panel popouts over inline expand, mobile-first design

---
