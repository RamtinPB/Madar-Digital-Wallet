# Frontend Pages Architecture - Industry Standard Consolidation

## Executive Summary

Based on industry standards from leading digital wallets (PayPal, Revolut, Cash App, Stripe), here's the **consolidated page structure** - **5 core pages** for wallet management:

| #   | Page                     | Route             | Priority          |
| --- | ------------------------ | ----------------- | ----------------- |
| 1   | **Dashboard**            | `/`               | ✅ Already exists |
| 2   | **Wallets Management**   | `/wallets`        | 🔴 HIGH           |
| 3   | **Create Wallet**        | `/wallets/create` | 🔴 HIGH           |
| 4   | **Wallet Details**       | `/wallets/[id]`   | 🟡 MEDIUM         |
| 5   | **Transactions History** | `/transactions`   | 🟡 MEDIUM         |

**Note:** Deposit, Withdraw, and Transfer can be handled as **modal dialogs** from existing pages rather than separate pages (industry standard pattern).

---

## Page Definitions with Features

### Page 1: Dashboard (Already Exists)

**Route:** `/`

**Current Features (Keep):**

- Total balance overview
- Quick action buttons (Deposit, Withdraw, Transfer, Create Wallet)
- Recent transactions list (last 5-10)
- Wallet selector dropdown

**Features to ADD:**

- "View All Wallets" link → redirects to `/wallets`
- "View All Transactions" link → redirects to `/transactions`

---

### Page 2: Wallets Management

**Route:** `/wallets`

**Purpose:** Central hub for managing all wallets

**Features:**
| Feature | Description |
|---------|-------------|
| **Wallet List** | Grid or table of all user wallets with balance |
| **Create Wallet Button** | Primary CTA → redirects to `/wallets/create` |
| **Wallet Card/Row** | Shows: Name, Balance, Public ID, Created Date |
| **Quick Actions per Wallet** | Deposit, Withdraw, Transfer (open as modal) |
| **Set Default** | Mark one wallet as primary |
| **Delete Wallet** | Close/remove wallet (if balance is 0) |
| **Search/Filter** | Filter by wallet name or ID |
| **Empty State** | "No wallets yet" with CTA to create |

**Industry Standard Pattern:**

```
┌─────────────────────────────────────────┐
│  کیف‌ پول‌های من (My Wallets)            │
│  [+ کیف پول جدید]                       │
├─────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐       │
│  │ Wallet 1    │  │ Wallet 2    │       │
│  │ Balance: $500│  │ Balance: $200│      │
│  │ [Deposit]   │  │ [Deposit]   │       │
│  │ [Withdraw]  │  │ [Withdraw]  │       │
│  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────┘
```

---

### Page 3: Create Wallet

**Route:** `/wallets/create`

**Purpose:** Dedicated flow for creating a new wallet

**Features:**
| Feature | Description |
|---------|-------------|
| **Wallet Name Input** | Optional custom name for wallet |
| **Currency Selection** | (If multi-currency support planned) |
| **Wallet Type** | Personal / Business (if applicable) |
| **Create Button** | Submit to API |
| **Success State** | Confirmation with wallet details |
| **Back Link** | Return to `/wallets` |

**Alternative (Modal Approach):**

- Can also be a modal opened from `/wallets` page
- But **separate page is recommended** for better UX and URL tracking

---

### Page 4: Wallet Details

**Route:** `/wallets/[id]`

**Purpose:** Deep dive into a single wallet

**Features:**
| Feature | Description |
|---------|-------------|
| **Wallet Header** | Name, Balance, Public ID, Status |
| **Transaction History** | All transactions for this wallet (paginated) |
| **Quick Actions** | Deposit, Withdraw, Transfer buttons |
| **Wallet Settings** | Rename, Set as default, Delete |
| **Export** | Download statement (CSV/PDF) |
| **Related Cards** | Cards linked to this wallet (future) |

**Industry Standard Pattern:**

```
┌─────────────────────────────────────────┐
│  ← Back to Wallets                      │
│  ┌─────────────────────────────────────┐│
│  │ کیف پول اصلی                        ││
│  │ موجودی: ۵۰۰,۰۰۰ تومان               ││
│  │ شماره: ۱۲۳۴-۵۶۷۸-۹۰۱۲-۳۴۵۶           ││
│  │ [افزایش موجودی] [برداشت] [انتقال]   ││
│  └─────────────────────────────────────┘│
│                                         │
│  تاریخچه تراکنش‌ها                      │
│  ┌─────────────────────────────────────┐│
│  │ +۱۰۰,۰۰۰ تومان    ۱۴۰۴/۱۱/۲۵        ││
│  │ -۵۰,۰۰۰ تومان     ۱۴۰۴/۱۱/۲۴        ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

### Page 5: Transactions History

**Route:** `/transactions`

**Purpose:** Global view of all transactions across all wallets

**Features:**
| Feature | Description |
|---------|-------------|
| **Transaction List** | All transactions, paginated |
| **Filters** | By date range, type, status, amount, wallet |
| **Search** | By transaction ID, recipient, description |
| **Transaction Type Badges** | Deposit, Withdraw, Transfer, Purchase |
| **Status Badges** | Pending, Completed, Failed |
| **Transaction Details Click** | Opens detail view or navigates to `/transactions/[id]` |
| **Export** | Download as CSV/PDF |

---

## Operations as Modals (Not Separate Pages)

Instead of separate pages for Deposit, Withdraw, and Transfer - **use modals**:

| Operation    | Trigger Location                     | Implementation |
| ------------ | ------------------------------------ | -------------- |
| **Deposit**  | `/wallets` or `/wallets/[id]`        | Modal dialog   |
| **Withdraw** | `/wallets` or `/wallets/[id]`        | Modal dialog   |
| **Transfer** | `/wallets` or `/wallets/[id]` or `/` | Modal dialog   |

**Modal Features:**

- Wallet selector (for Transfer)
- Amount input
- Confirmation step
- OTP verification (existing backend support)
- Success/Error states

**Why Modals?**

1. Faster user flow (no page navigation)
2. Context-aware (user already on wallet page)
3. Industry standard (PayPal, Revolut use this pattern)
4. Reduces total pages from 8 to 5

---

## Summary: Exact Page Count

| Page # | Name                 | Route             | Features                             |
| ------ | -------------------- | ----------------- | ------------------------------------ |
| 1      | Dashboard            | `/`               | Overview, quick actions, recent txns |
| 2      | Wallets Management   | `/wallets`        | List all wallets, create wallet CTA  |
| 3      | Create Wallet        | `/wallets/create` | Wallet creation form                 |
| 4      | Wallet Details       | `/wallets/[id]`   | Single wallet + its transactions     |
| 5      | Transactions History | `/transactions`   | Global transaction list with filters |

**Total: 5 core pages** (plus existing login/signup)

---

## Answer to Your Questions

### Should management and creation be separate?

**Yes.** Industry standard is separate pages:

- `/wallets` → Management
- `/wallets/create` → Creation

### Why not more pages?

- **Deposit/Withdraw/Transfer** → Modals (not pages)
- **Transaction Details** → Can be inline expansion or modal
- **Settings** → Future expansion, not critical for MVP

This 5-page structure matches what PayPal, Revolut, and similar apps use.
