# Wallets Management Page Specification

## Overview

- **Route:** `/wallets`
- **File:** `front/pages/wallets.tsx`
- **Purpose:** Central hub for managing all user wallets

## Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│  [← بازگشت به داشبورد]                         [-sidebar]      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  کیف‌ پول‌های من                              [+ کیف پول جدید] │ │
│  │  Manage your wallets                                 [Create] │ │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [🔍 جستجو...]  [فیلتر ▼]                  مجموع: ۱,۵۰۰,۰۰۰ │ │
│  │  [Search]        [Filter]                  Total: 1,500,000│ │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ کیف پول اصلی │  │ کیف پول دوم  │  │ + کیف پول جدید│          │
│  │ Main Wallet │  │ Second Wallet│  │ + New Wallet │          │
│  │              │  │              │  │              │          │
│  │ موجودی:      │  │ موجودی:      │  │              │          │
│  │ ۱,۰۰۰,۰۰۰    │  │ ۵۰۰,۰۰۰      │  │              │          │
│  │              │  │              │  │ [+ ایجاد]    │          │
│  │ ───────────  │  │ ───────────  │  │ [+ Create]   │          │
│  │ ⭐ پیش‌فرض    │  │              │  │              │          │
│  │              │  │              │  │              │          │
│  │ [افزایش]     │  │ [افزایش]     │  │              │          │
│  │ [برداشت]     │  │ [برداشت]     │  │              │          │
│  │ [انتقال]     │  │ [انتقال]     │  │              │          │
│  │              │  │              │  │              │          │
│  │ [⋮]          │  │ [⋮]          │  │              │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  کیف پول اصلی                              [مشاهده جزئیات] │ │
│  │  1234-5678-9012-3456                                    │  │
│  │  ایجاد: ۱۴۰۴/۰۸/۱۵                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Page Header

- **Title:** "کیف‌ پول‌های من" (My Wallets)
- **Primary CTA Button:** "+ کیف پول جدید" → navigates to `/wallets/create`
- **Subtitle:** Total balance of all wallets

### 2. Search & Filter Bar

- **Search Input:** Filter by wallet name or public ID
- **Filter Dropdown:** By balance range, creation date
- **Total Balance Display:** Sum of all wallet balances

### 3. Wallet Card Component

```
┌────────────────────────────────┐
│  [Wallet Icon]  نام کیف پول    │
│             ⭐ پیش‌فرض (badge)  │
│                                │
│  ۱,۰۰۰,۰۰۰ تومان               │
│  1234-5678-9012-3456           │
│                                │
│  [افزایش موجودی] [برداشت] [انتقال] │
│                                │
│  [⋮] More menu                │
│   - مشاهده جزئیات → /wallets/[id]│
│   - ویرایش نام                  │
│   - حذف کیف پول                 │
└────────────────────────────────┘
```

**States:**

- Default: Normal display
- Selected/Active: Highlighted border
- Empty: Show "کیف پول خالی" card with CTA

### 4. Empty State

- **Icon:** Wallet with plus sign
- **Text:** "شما هنوز کیف پول ندارید" (You don't have a wallet yet)
- **CTA:** "ایجاد کیف پول جدید" → `/wallets/create`

## Functionality

### User Interactions

1. **View all wallets** - Grid/list of wallet cards
2. **Create new wallet** - Click CTA → `/wallets/create`
3. **Quick actions** - Deposit/Withdraw/Transfer as modals
4. **View wallet details** - Click card or "مشاهده جزئیات" → `/wallets/[id]`
5. **Set default wallet** - From more menu (⋮)
6. **Search wallets** - Real-time filtering by name/ID

### Data Handling

- Fetch all wallets via `getUserWallets()`
- Calculate total balance from all wallets
- Show loading skeleton while fetching
- Handle empty state when no wallets

### API Endpoints Used

- `GET /wallet` - Fetch all user wallets
- `POST /wallet` - Create new wallet (via `/wallets/create`)

## Modal Dialogs (Quick Actions)

### Deposit Modal

- Select wallet (if multiple)
- Enter amount
- Confirm deposit
- OTP verification
- Success/Error handling

### Withdraw Modal

- Select wallet (if multiple)
- Enter amount
- Confirm withdrawal
- OTP verification
- Success/Error handling

### Transfer Modal

- Select source wallet
- Enter recipient (phone number or wallet ID)
- Enter amount
- Confirm transfer
- OTP verification
- Success/Error handling

## Responsive Design

| Breakpoint          | Layout                       |
| ------------------- | ---------------------------- |
| Mobile (<640px)     | Single column, stacked cards |
| Tablet (640-1024px) | 2 columns grid               |
| Desktop (>1024px)   | 3-4 columns grid             |

## Acceptance Criteria

1. ✅ Page loads with all user wallets displayed
2. ✅ Total balance shown at top
3. ✅ "+ کیف پول جدید" button navigates to creation page
4. ✅ Each wallet shows: name, balance, public ID, creation date
5. ✅ Quick action buttons (Deposit/Withdraw/Transfer) open modals
6. ✅ Search filters wallets in real-time
7. ✅ Empty state shown when no wallets exist
8. ✅ Loading states displayed during API calls
9. ✅ Error states handled gracefully
10. ✅ Clicking wallet navigates to `/wallets/[id]`

## Component Structure

```
front/pages/wallets.tsx          # Main page
├── components/
│   └── wallets/
│       ├── WalletCard.tsx       # Individual wallet card
│       ├── WalletGrid.tsx       # Grid layout for wallets
│       ├── WalletEmpty.tsx      # Empty state
│       ├── QuickActionsModals.tsx # Deposit/Withdraw/Transfer modals
│       └── SearchBar.tsx        # Search and filter
```

## Tailwind CSS Classes Reference

```tsx
// Container
<div className="space-y-6 p-6">

// Header
<h1 className="text-2xl font-bold">کیف‌ پول‌های من</h1>

// CTA Button
<Button>+ کیف پول جدید</Button>

// Wallet Card
<div className="bg-card rounded-lg border p-4 space-y-4">
  <div className="flex items-center justify-between">
    <span className="font-medium">{wallet.name}</span>
    {wallet.isDefault && <Badge>پیش‌فرض</Badge>}
  </div>
  <div className="text-2xl font-bold">{formatBalance(wallet.balance)}</div>
  <div className="text-sm text-muted-foreground">{wallet.publicId}</div>
  <div className="flex gap-2">
    <Button variant="outline" size="sm">افزایش</Button>
    <Button variant="outline" size="sm">برداشت</Button>
    <Button variant="outline" size="sm">انتقال</Button>
  </div>
</div>
```
