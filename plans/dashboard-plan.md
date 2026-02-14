# Dashboard Page Plan - Wallet Application with RTL Support (Updated)

## Overview

This document outlines the detailed plan for implementing the Dashboard page in a wallet application with RTL (Right-to-Left) support for Persian/Farsi language.

**Updated**: Now supports multiple wallets per user with wallet selector.

---

## 1. Page Layout and Structure

### 1.1 Page Sections

The Dashboard page will consist of the following sections:

```
┌─────────────────────────────────────────────────────┐
│                    Header                           │
│  (Page title + Welcome message + User info)         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Total Balance + Wallet Selector Dropdown   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │                 │  │                         │  │
│  │  Wallet Card    │  │   Quick Actions         │  │
│  │  (Selected      │  │   (Deposit/Withdraw)    │  │
│  │   Wallet)       │  │                         │  │
│  │                 │  │                         │  │
│  └─────────────────┘  └─────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │  Recent Transactions List                    │  │
│  │  (Scrollable, max 10 items)                 │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 1.2 RTL Considerations

- All text will be in Persian/Farsi
- Layout flows from right to left
- Icons and arrows will be flipped where appropriate
- Numbers will use Persian/Arabic numerals (۰۱۲۳۴۵۶۷۸۹)
- Currency formatting will use Persian locale (Tomans/تومان)

---

## 2. Multiple Wallet Support

### 2.1 Wallet Selector Component

The dashboard must handle multiple wallets:

```
┌─────────────────────────────────────────┐
│  موجودی کل: ۲,۵۰۰,۰۰۰ تومان                 │
│  ─────────────────────────────────────  │
│  کیف پول: [کیف پول اصلی    ▼]           │
│            ├─ کیف پول اصلی ($1,500)      │
│            ├─ کیف پول دوم ($1,000)      │
│            └─ کیف پول سوم (جدید +)      │
└─────────────────────────────────────────┘
```

### 2.2 State Management

```typescript
interface DashboardState {
	wallets: Wallet[]; // All user wallets
	selectedWalletId: number; // Currently selected wallet
	totalBalance: number; // Sum of all wallets
	transactions: Transaction[]; // Transactions for selected wallet
	isLoading: boolean;
	error: string | null;
}
```

---

## 3. Components Needed

### 3.1 Core Components

| Component             | Purpose                    | Location                                            |
| --------------------- | -------------------------- | --------------------------------------------------- |
| `DashboardPage`       | Main page container        | `pages/index.tsx`                                   |
| `TotalBalanceCard`    | Display total balance      | New: `components/dashboard/TotalBalanceCard.tsx`    |
| `WalletSelector`      | Dropdown to select wallet  | New: `components/dashboard/WalletSelector.tsx`      |
| `WalletBalanceCard`   | Display selected wallet    | New: `components/dashboard/WalletBalanceCard.tsx`   |
| `QuickActions`        | Deposit/Withdraw buttons   | New: `components/dashboard/QuickActions.tsx`        |
| `RecentTransactions`  | Transaction list           | New: `components/dashboard/RecentTransactions.tsx`  |
| `TransactionItem`     | Individual transaction row | New: `components/dashboard/TransactionItem.tsx`     |
| `TransactionSkeleton` | Loading skeleton           | New: `components/dashboard/TransactionSkeleton.tsx` |

### 3.2 Reusable UI Components (Existing)

- `Card` - From `components/ui/card.tsx`
- `Button` - From `components/ui/button.tsx`
- `Avatar` - From `components/ui/avatar.tsx`
- `Badge` - From `components/ui/badge.tsx`
- `Select` - From `components/ui/select.tsx`
- `ScrollArea` - From `components/ui/scroll-area.tsx`
- Icons from `lucide-react` (ArrowUpLeft, ArrowDownLeft, Clock, etc.)

---

## 4. API Calls Required

### 4.1 Endpoints Needed

| Endpoint                   | Method | Purpose                   |
| -------------------------- | ------ | ------------------------- |
| `/wallet`                  | GET    | Fetch user's wallets      |
| `/transactions/wallet/:id` | GET    | Fetch recent transactions |

### 4.2 API Service Functions

New file: `src/lib/api/wallet.ts`

```typescript
// Get all user wallets
export async function getUserWallets(): Promise<{ wallets: Wallet[] }>;

// Get wallet transactions (recent)
export async function getWalletTransactions(
	walletId: number,
	limit?: number,
): Promise<{ transactions: Transaction[] }>;
```

### 4.3 Type Definitions

New file: `src/types/wallet.ts`

```typescript
export interface Wallet {
	id: number;
	publicId: string;
	balance: string; // Decimal from Prisma
	createdAt: string;
	updatedAt: string;
}

export interface Transaction {
	id: number;
	publicId: string;
	status: "PENDING" | "OTP_VERIFIED" | "COMPLETED" | "FAILED";
	transactionType:
		| "TRANSFER"
		| "DEPOSIT"
		| "WITHDRAW"
		| "PURCHASE"
		| "REFUND"
		| "ADMIN_ADJUSTMENT";
	amount: string;
	payerWalletId: number;
	receiverWalletId: number | null;
	createdAt: string;
	receiverWallet?: {
		user: {
			phoneNumber: string;
		};
	};
	payerWallet?: {
		user: {
			phoneNumber: string;
		};
	};
}
```

---

## 5. Data Flow

### 5.1 Data Fetching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard Page Load                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Fetch all wallets: GET /wallet                         │
│     → Returns Wallet[]                                       │
│                                                              │
│  2. Calculate total: Sum all wallet balances                │
│                                                              │
│  3. Select default: First wallet (or last used)             │
│                                                              │
│  4. Fetch transactions: GET /transactions/wallet/:id        │
│     → Returns Transaction[]                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  User changes wallet selector → re-fetch transactions        │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Component State

```typescript
// In DashboardPage
const [wallets, setWallets] = useState<Wallet[]>([]);
const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
const [transactions, setTransactions] = useState<Transaction[]>([]);

// Computed
const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0);
const selectedWallet = wallets.find((w) => w.id === selectedWalletId);
```

---

## 6. Wireframe Sketch

### 6.1 Main Dashboard Layout

```
┌────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  داشبورد                                  👤 ۰۹۱۲۳۴۵۶۷۸  │  │
│  └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  موجودی کل: ۲,۵۰۰,۰۰۰ تومان                              │ │
│  │  ─────────────────────────────────────────────────────── │ │
│  │  کیف پول: [کیف پول اصلی              ▼]                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌────────────────────────────┐  ┌──────────────────────────┐ │
│  │  ┌──────────────────────┐  │  │  ┌────┐  ┌────┐         │ │
│  │  │     کیف پول انتخابی  │  │  │  │➕  │  │➖  │         │ │
│  │  │                      │  │  │  │واریز│  │برداشت│        │ │
│  │  │      ۱,۵۰۰,۰۰۰       │  │  │  └────┘  └────┘         │ │
│  │  │       تومان          │  │  │                          │ │
│  │  │                      │  │  │                          │ │
│  │  │  ────────────────    │  │  │                          │ │
│  │  │  شناسه: WA-XXXXX    │  │  │                          │ │
│  │  └──────────────────────┘  │  │                          │ │
│  └────────────────────────────┘  └──────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  تراکنش‌های اخیر                               مشاهده همه │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ 🟢  انتقال وجه دریافتی                           │  │  │
│  │  │    از: ۰۹۱۱۲۳۴۵۶۷۸              ۵۰۰,۰۰۰ تومان │  │  │
│  │  │    ۲ ساعت پیش                                   │  │  │
│  │  ├────────────────────────────────────────────────────┤  │  │
│  │  │ 🔴  برداشت وجه                                   │  │  │
│  │  │    به حساب بانکی              ۲۰۰,۰۰۰ تومان    │  │  │
│  │  │    دیروز                                          │  │  │
│  │  ├────────────────────────────────────────────────────┤  │  │
│  │  │ 🟢  انتقال وجه ارسالی                            │  │  │
│  │  │    به: ۰۹۱۱۲۳۴۵۶۷۸              ۱۰۰,۰۰۰ تومان    │  │  │
│  │  │    دیروز                                          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 6.2 Component Details

#### Total Balance Card

- Shows sum of all wallet balances in Tomans
- Persian currency formatting (using `toLocaleString('fa-IR')`)
- Includes wallet selector dropdown
- Shows "No wallets" if user has no wallets

#### Wallet Selector Dropdown

- Lists all user wallets with balance
- Last option: "Create new wallet" (+ ایجاد کیف پول)
- Persists selection in localStorage

#### Wallet Balance Card (Selected Wallet)

- Shows selected wallet's balance
- Wallet public ID display
- Last updated timestamp

#### Quick Actions Section

- Two buttons: Deposit (واریز) and Withdraw (برداشت)
- Icons: ArrowDownLeft for deposit, ArrowUpLeft for withdraw
- Navigate to respective action pages with wallet ID

#### Recent Transactions List

- Maximum 10 items displayed
- Each item shows:
  - Transaction type icon (color-coded)
  - Transaction type name
  - Counterparty (phone number)
  - Amount (green for incoming, red for outgoing)
  - Relative timestamp (۲ ساعت پیش, دیروز, etc.)
- "View All" link to full transactions page

---

## 7. Implementation Tasks

### 7.1 File Creation Order

1. **Create Type Definitions**
   - `front/src/types/wallet.ts`

2. **Create API Service**
   - `front/src/lib/api/wallet.ts`

3. **Create Utility Functions**
   - `front/src/lib/format.ts` - Number and currency formatting
   - `front/src/lib/date.ts` - Date formatting utilities

4. **Create Dashboard Components**
   - `front/src/components/dashboard/TotalBalanceCard.tsx`
   - `front/src/components/dashboard/WalletSelector.tsx`
   - `front/src/components/dashboard/WalletBalanceCard.tsx`
   - `front/src/components/dashboard/QuickActions.tsx`
   - `front/src/components/dashboard/TransactionItem.tsx`
   - `front/src/components/dashboard/RecentTransactions.tsx`
   - `front/src/components/dashboard/TransactionSkeleton.tsx`
   - `front/src/components/dashboard/index.ts` (barrel export)

5. **Update Dashboard Page**
   - `front/pages/index.tsx`

### 7.2 RTL-Specific Implementations

1. **Number Formatting Utility**

   ```typescript
   // Format numbers to Persian/Arabic numerals
   export function formatNumber(num: number): string;
   ```

2. **Currency Formatting**

   ```typescript
   // Format currency in Tomans
   export function formatCurrency(amount: number | string): string;
   ```

3. **Relative Time**
   ```typescript
   // Persian relative time
   export function getRelativeTime(date: Date | string): string;
   ```

---

## 8. Acceptance Criteria

1. ✅ Dashboard displays total balance across all wallets in Persian locale
2. ✅ Wallet selector dropdown allows switching between wallets
3. ✅ Selected wallet's transactions are displayed
4. ✅ Recent transactions show last 10 items
5. ✅ All text is in Persian/Farsi
6. ✅ Numbers use Persian numerals
7. ✅ RTL layout works correctly
8. ✅ Loading states show skeleton components
9. ✅ Error states are handled gracefully
10. ✅ Quick action buttons are functional and pass selected wallet ID
11. ✅ Transactions are color-coded (green for receive, red for send)
12. ✅ Timestamps show relative Persian time
13. ✅ Empty state when user has no wallets
14. ✅ Wallet selection persists across page refreshes (localStorage)
