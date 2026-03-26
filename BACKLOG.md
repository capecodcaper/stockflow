# StockFlow — Feature Backlog

> Features that need a backend or are too complex for the current MVP phase.
> Hand this to your developer when you're ready to build the real thing.

---

## Needs Backend

- [ ] **Drag-and-drop Kanban board** — Users can create custom pipeline columns (not just Sourced/In Hand/Listed/Sold), drag products between them, and reorder. Dragging a product to a new column should automatically update its status. Columns and their order need to persist in a database. The current Dashboard has a read-only version that groups products by status — this would replace it with a fully interactive one.
- [ ] **Receipt uploads** — Upload receipt images/PDFs per product (purchase proof). Placeholder UI already exists in the product detail panel. Needs file storage (S3 or similar).
- [ ] **Photo uploads** — Product photos and pre-shipping/pre-sale photos for sales. Placeholder UI exists throughout. Needs file storage.
- [ ] **User accounts & auth** — Login, signup, password reset. Account page is a placeholder right now.
- [ ] **Persistent data** — All data is currently in-browser demo state. Everything resets on refresh. Needs a real database.
- [ ] **Deploy to a live URL** — Currently on Netlify (stillinventory.netlify.app) but no backend yet.

## Frontend Polish (No Backend Needed)

- [x] **Sales page — redesign stats + auto-prefill sale price** *(done 2026-03-26)*
- [x] **Sales page — edit button on individual sale logs** *(done 2026-03-26)*
- [ ] **Clothing sizes discussion** — need to decide how to handle clothing sizes (S/M/L, numeric, etc.) in the product system. TBD.
- [ ] **Inventory page — make it more attractive** — visual redesign/polish pass to bring it up to the same level as Dashboard

## Future Features (Design TBD)

- [ ] **Analytics dashboard** — Charts for profit over time, sell-through rate trends, best-performing categories/platforms, etc.

---

## Notes

**Kanban board vision:**
- Should feel like a to-do list / process flow — a quick glance shows where everything is at
- Users should be able to add, rename, and reorder their own columns (not locked to the default statuses)
- Products should be draggable/movable between columns, and moving them updates the product's status
- Needs a backend to save custom columns and their order per user


