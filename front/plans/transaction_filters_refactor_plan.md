# Transaction Filters Refactoring Plan

## Issues Identified

### 1. **`onRemove` callback is a no-op** (transactions.tsx:167)

```tsx
onRemove={() => {}}
```

The X buttons in ActiveFilters literally do nothing because an empty function is passed.

### 2. **Wallet Filter doesn't display selected item** (TransactionFilters.tsx:117-122)

The value logic is flawed:

```tsx
value={
  localFilters.walletId?.toString() ||
  localFilters.walletId === "all"
    ? "all"
    : ""
}
```

This doesn't properly handle when `walletId` is a number. It should convert to string properly.

### 3. **Reset button doesn't update Select components**

When "بازگشت به حالت پیش فرض" is clicked:

- TransactionFilters calls `onClear()`
- Parent's `handleClearFilters` sets `{ walletId: primaryWallet.id }`
- But the Select component doesn't reflect this because:
  - The `value` prop logic is buggy
  - Local state synchronization may fail

### 4. **ActiveFilters shows incorrect labels**

It shows "نوع: همه" and "وضعیت: همه" when filter is set to "all", but "all" should be treated as "no filter active" (don't show it at all).

### 5. **Confusing local state in TransactionFilters**

The component maintains its own `localFilters` state that's supposed to sync with parent props via useEffect, but the synchronization is error-prone.

---

## Root Cause Analysis

The fundamental architectural issue is **mixed state management**:

- Parent holds filter state in `useTransactions` hook
- TransactionFilters maintains its own local state (`localFilters`)
- This creates synchronization issues and bugs

---

## Industry Standard Solution

The industry standard approach for React filter systems is:

1. **Single Source of Truth**: Parent holds all filter state
2. **Controlled Components**: Children receive values via props, emit changes via callbacks
3. **No Local State in Filter UI**: Filter components are purely presentational
4. **Proper Filter Normalization**: Use `undefined` for "no filter", explicit values for active filters

---

## Proposed Changes

### A. Modify `TransactionsFilters` Type (front/src/types/transaction.ts)

Define clear semantics:

- `undefined` = no filter applied (show "همه")
- `"all"` = explicitly showing all (should also show "همه" but treat as active filter)
- Specific value = that specific filter is active

### B. Refactor `TransactionFilters.tsx`

Remove local state entirely. Make it a controlled component:

```tsx
interface TransactionFiltersProps {
	filters: TransactionsFilters;
	wallets: Wallet[];
	onFilterChange: (filters: TransactionsFilters) => void;
}
```

Changes:

- Remove `useState(localFilters)`
- Remove `useEffect` for sync
- All inputs controlled by `filters` prop
- `onFilterChange` called directly on input change (no local apply button needed)

### C. Refactor `ActiveFilters.tsx`

Fix the display logic:

- Don't show filters with value `"all"` or `undefined`
- Only show filters with actual specific values
- Implement `onRemove` to call parent callback with `undefined` for that key

### D. Refactor `transactions.tsx` (Parent)

1. Add `handleFilterChange` function to update filters
2. Add `handleRemoveFilter` function to clear individual filters
3. Pass proper callbacks to children

---

## Implementation Steps

### Step 1: Update Type Definition

Add helper type for filter operations and clarify semantics.

### Step 2: Refactor TransactionFilters

- Remove local state
- Make fully controlled
- Add `onFilterChange` callback that updates parent directly

### Step 3: Refactor ActiveFilters

- Fix display logic (don't show "all" as active)
- Implement working `onRemove` callback

### Step 4: Update Parent Component

- Add filter manipulation functions
- Wire up all callbacks properly

### Step 5: Test All Interactions

- Reset filters button
- Individual filter removal
- Wallet filter display
- Filter application

---

## Data Flow After Fix

```
┌─────────────────────────────────────────────────────────────────┐
│                        transactions.tsx                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  filters state (useTransactions)                         │  │
│  │  { walletId: 1, type: "PURCHASE", status: "all", ... }   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            ▲                                     │
│                            │ filters prop                        │
│         ┌──────────────────┼──────────────────┐                 │
│         │                  │                  │                 │
│         ▼                  ▼                  ▼                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │Transaction   │  │  Active      │  │   Search     │          │
│  │Filters       │  │  Filters     │  │   Component  │          │
│  │              │  │              │  │              │          │
│  │ onFilterChan│◄─┼─onRemove     │  │ onChange     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

Each component:

- Receives current filter state via props (read-only)
- Emits user actions via callbacks (write)
- No local state that can become out of sync
