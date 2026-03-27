# StockFlow — Project Instructions for Claude

> These instructions apply to every Claude Code session that opens this project.
> Follow them exactly — they override default behavior.

---

## About the User

- **Not code-savvy.** Always use plain language. No jargon without an immediate plain-English explanation.
- **Building this as a SaaS MVP.** The purpose is a visual spec — so they can hand it to a backend developer who builds exactly what they see, without endless design back-and-forth.
- **Needs exact instructions** for any dev tool operations. Don't say "run the dev server" — say exactly what to type and where.
- **Wants honest feedback.** If an idea is bad, say so directly, explain why, and offer a 1-2 sentence alternative. Don't be a yes-man.
- **Working on Windows 11** with VS Code + Claude Code extension. Terminal is Git Bash (not PowerShell).

---

## Communication Rules

- Explain things in layman's terms, always.
- After building something visual, tell the user how to see it: exact terminal commands, browser URL, etc.
- Don't sugarcoat problems but do explain them simply.
- If a feature needs a backend, build the UI anyway and note it in BACKLOG.md.
- Keep responses concise. No walls of text unless the user asks for detail.

---

## Design Rules (CRITICAL)

### ADHD-Friendly Design — Non-Negotiable
The target audience is small-time resellers/flippers. Many have shorter attention spans. Every screen must follow these principles:

- **One big number pops** — every section has a clear visual anchor (the most important number, bigger and bolder than everything else)
- **Color tells the story** — green = good, red = bad, amber = meh. Users should get the signal before reading the number.
- **Less is more** — don't show 6 stats when 3 will do. Hide secondary info on mobile, show on wider screens.
- **Visual hierarchy over grids** — avoid equal-sized boxes competing for attention. Use size, weight, and color to create a clear reading order.
- **Leaderboard pattern** — ranked lists with one standout metric beat data-dense cards.
- **Subtle background cues** — faded color bars behind rows for instant relative comparison without clutter.
- **NOT gaudy** — no full-width gradient banners with giant text. Color-tinted cards with slightly emphasized key numbers. Attractive but not screaming.

### UI Patterns
- **Side panels (slide-in from right)** for viewing/editing detail records (products, sales, etc.). Do NOT use inline expand/collapse.
- **Mobile-first design is required.** All layouts must work on phone screens.
- Dark/light mode is already implemented via ThemeContext.

---

## Tech Stack

- React 19 + Vite 8 + Tailwind CSS v4 (via PostCSS) + React Router 7 + Lucide React icons
- State management: React Context API (DataContext for products/sales/categories/statuses/platforms, ThemeContext for dark mode)
- Demo data: `src/data/demoProducts.js` (products, sales, constants)
- Shared utilities: `src/utils/helpers.js` (currency, pct, daysAgo, shortDate, sale profit calcs, shared input/select styles, status colors)
- Feature backlog: `BACKLOG.md` at project root
- Session history: `changelog.md` at project root

---

## Project Structure

- `src/pages/` — Dashboard, Inventory, Sales, Reports, Account
- `src/pages/reports/` — OverviewTab, InventoryTab, SalesTab, ProfitabilityTab, CustomTab
- `src/components/` — Layout, Sidebar, Header, ProductCard, AddProductModal, ProductDetailPanel, SaleDetailPanel, AddSaleModal, SaleFormFields
- `src/context/` — DataContext, ThemeContext
- `src/data/` — demoProducts.js (demo data + constants like platformFeeRates, conditions)
- `src/utils/` — helpers.js (shared utilities)

---

## Code Quality Rules

- Use shared utilities from `src/utils/helpers.js` — don't create local copies of currency(), shortDate(), profit calcs, etc.
- Follow established patterns: separate files for distinct UI sections, shared components for repeated logic.
- Don't let files grow into monoliths. Split when a file exceeds ~400 lines.
- Keep the codebase clean and developer-ready — this will be handed to a backend developer.

---

## Deployment

- **Live URL:** https://stillinventory.netlify.app
- **Deploy command:** `cd ~/OneDrive/Desktop/"Claude Stuff"/stockflow && npx vite build && netlify deploy --prod --dir=dist`
- **Deploy after every code change** so the live URL stays current. The user shares this link with others.
- **GitHub repo:** https://github.com/capecodcaper/stockflow (private)
- **Push to GitHub after changes** to keep the repo in sync.

---

## Session Start (when user says "starting a session", "picking up", "resuming work", or similar)

Follow these steps exactly:

1. **Read the changelog** at `changelog.md` to understand what's been done and what's next.
2. **Quick project health check** — run a build to make sure everything compiles:
   ```
   npx vite build
   ```
   If the build fails, flag it immediately before doing anything else.
3. **Present a brief status update:**
   - Here's where we left off: [1-2 sentences from changelog]
   - Next up: [the pending items from changelog]
   - Any issues: [build errors or known problems, or "None — everything looks good"]
4. **Present a to-do list** with "Required" and "Optional" sections based on the changelog and BACKLOG.md, plus a short design note about how upcoming work should look/feel for the target audience.
5. **Ask:** "Ready to pick up from here, or do you want to work on something else?"

---

## Session End (when user says "closing out", "done for today", "wrap up", or similar)

Follow these steps exactly:

1. **Read the current changelog** so you don't overwrite previous entries.
2. **Scan the project** to understand current state:
   - Read `src/App.jsx` for routes and structure
   - Check all components and pages
   - Read `package.json` for dependencies
3. **Ask the user:** "Anything specific you want me to note before I close out?" — Wait for their response before proceeding.
4. **Write/update `changelog.md`** with a new entry at the TOP of the file (most recent first):
   ```
   ## Session: [YYYY-MM-DD]

   ### What was done
   - [Bullet list of everything built, changed, or fixed this session]

   ### Current state
   - **Pages built:** [list all pages and their status]
   - **Components:** [list all components]
   - **Key features working:** [list interactive features that are functional]
   - **Known issues:** [any bugs or incomplete items]

   ### What's next
   - [Bullet list of pending work, in priority order]

   ### Resume instructions
   - Project path and dev server command
   - Tech stack summary
   - Key context for next session
   ---
   ```
5. **Push to GitHub** so the latest changelog is available from any device.
6. **Deploy to Netlify** if any code changes were made this session.
7. **Confirm to the user** that everything is saved and they can resume from any device.

---

## Key Context

- "StockFlow" is a placeholder name — may change later.
- All data is currently demo/local state. No backend yet. Everything resets on refresh.
- The MVP is a visual spec, not a production app. Build UI fully even for features that need a backend.
- Target audience: small-time resellers/flippers, primarily electronics (laptops/phones/tablets).
- Competitor landscape: Flippd, Vendoo, List Perfectly are competitors. This app differentiates on ADHD-friendly design, generous free tier, and community-driven growth.
