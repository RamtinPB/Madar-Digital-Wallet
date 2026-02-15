# Wallet Details Page Specification

## Overview

- **Route:** `/wallets/[id]`
- **File:** `front/pages/wallets/[id].tsx`
- **Purpose:** Deep dive into a single wallet with full transaction history

## Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│  [← بازگشت به کیف پول‌ها]                       [-sidebar]      │
│  [Back to Wallets]                                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │                                                    │  │  │
│  │  │              [کیف پول اصلی]                        │  │  │
│  │  │              [Main Wallet]                         │  │  │
│  │  │                                                    │  │  │
│  │  │         ۱,۰۰۰,۰۰۰ تومان                           │  │  │
│  │  │         1,000,000 Toman                           │  │  │
│  │  │                                                    │  │  │
│  │  │    شماره کیف پول: ۱۲۳۴-۵۶۷۸-۹۰۱۲-۳۴۵۶          │  │  │
│  │  │    Wallet ID: 1234-5678-9012-3456                │  │  │
│  │  │                                                    │  │  │
│  │  │    ایجاد: ۱۴۰۴/۰۸/۱۵                             │  │  │
│  │  │    Created: 2025-11-06                           │  │  │
│  │  │                                                    │  │  │
│  │  │  [افزایش موجودی]  [برداشت]  [انتقال]  [⋮]       │  │  │
│  │  │  [Deposit]    [Withdraw]  [Transfer]  [More]     │  │  │
│  │  │                                                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  تاریخچه تراکنش‌ها                        [صادرات ▼]   │  │
│  │  Transaction History                  [Export ▼]       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  [🔍 جستجو...]  [فیلتر تاریخ]  [فیلتر نوع]            │  │
│  │  [Search...]    [Date Filter]  [Type Filter]           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  📥  افزایش موجودی                    +۵۰۰,۰۰۰  │  │  │
│  │  │      توسط: ۰۹۱۲۳۴۵۶۷۸۹                   ۱۴۰۴/۱۱/۲۵│  │  │
│  │  │      تکمیل شده                                   │  │  │
│  │  │      [مشاهده جزئیات]                            │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  📤  برداشت                         -۱۰۰,۰۰۰  │  │  │
│  │  │      به حساب: ۱۲۳۴...                          │  │  │
│  │  │      تکمیل شده                       ۱۴۰۴/۱۱/۲۴ │  │  │
│  │  │      [مشاهده جزئیات]                            │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  ↔️  انتقال به کیف پول دوم          -۲۰۰,۰۰۰  │  │  │
│  │  │      به: ۰۹۱۲۳۴۵۶۷۸۹۰                         │  │  │
│  │  │      در حال تایید                   ۱۴۰۴/۱۱/۲۳ │  │  │
│  │  │      [مشاهده جزئیات]                            │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  📥  افزایش موجودی                    +۱۰۰,۰۰۰  │  │  │
│  │  │      توسط: ۰۹۱۲۳۴۵۶۷۸۹                   ۱۴۰۴/۱۱/۲۲│  │  │
│  │  │      تکمیل شده                                   │  │  │
│  │  │      [مشاهده جزئیات]                            │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  🛒  خرید                        -۵۰,۰۰۰  │  │  │
│  │  │      فروشگاه: دیجی‌کالا                       │  │  │
│  │  │      تکمیل شده                       ۱۴۰۴/۱۱/۲۱ │  │  │
│  │  │      [مشاهده جزئیات]                            │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                    [1] [2] [3] [بعدی]                   │
│  │                    [1] [2] [3] [Next]                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Back Navigation

- **Link:** "← بازگشت به کیف پول‌ها" → navigates to `/wallets`

### 2. Wallet Header Card

- **Wallet Name:** Display name or "کیف پول اصلی"
- **Balance:** Large, prominent display
- **Wallet ID:** Formatted as `1234-5678-9012-3456`
- **Created Date:** "ایجاد: ۱۴۰۴/۰۸/۱۵"
- **Quick Action Buttons:** Deposit, Withdraw, Transfer
- **More Menu (⋮):** Edit name, Set as default, Delete

### 3. Transaction History Section

- **Header:** "تاریخچه تراکنش‌ها" with Export dropdown
- **Filters:** Search, Date range, Transaction type
- **Transaction List:** Scrollable, paginated

### 4. Transaction Item Component

```
┌────────────────────────────────────────────┐
│  [Icon]  [Type]              [+Amount]     │
│         [Description]        [Date]        │
│         [Status Badge]                     │
│         [View Details →]                  │
└────────────────────────────────────────────┘
```

**Transaction Types:**

- 📥 Deposit (افزایش موجودی) - Green
- 📤 Withdraw (برداشت) - Orange
- ↔️ Transfer (انتقال) - Blue
- 🛒 Purchase (خرید) - Red
- ↩️ Refund (بازگشت) - Purple

**Status Badges:**

- ✅ تکمیل شده (Completed) - Green
- ⏳ در انتظار (Pending) - Yellow
- ❌ ناموفق (Failed) - Red
- 🔐 نیاز به تایید (OTP Required) - Blue

### 5. Pagination

- Page numbers
- Next/Previous buttons
- Items per page selector

## Functionality

### User Interactions

1. **View wallet details** - Header shows all wallet info
2. **Quick actions** - Deposit/Withdraw/Transfer as modals
3. **View transactions** - Scroll through history
4. **Filter transactions** - By date, type, status
5. **Search transactions** - By ID, recipient
6. **View transaction details** - Click to expand or modal
7. **Export history** - Download as CSV/PDF
8. **Wallet settings** - Edit name, set default, delete

### Data Handling

- Fetch wallet via `getWalletById(id)`
- Fetch transactions via `getWalletTransactions(id, page)`
- Calculate balance from wallet object
- Handle pagination for transactions

### API Endpoints Used

- `GET /wallet/:id` - Fetch wallet details
- `GET /transactions/wallet/:id` - Fetch wallet transactions
- `POST /wallet/:id/deposit` - Deposit (via modal)
- `POST /wallet/:id/withdraw` - Withdraw (via modal)
- `POST /transaction/transfer` - Transfer (via modal)

## More Menu Options

| Option                          | Action                              |
| ------------------------------- | ----------------------------------- |
| ویرایش نام (Edit Name)          | Open modal to rename wallet         |
| ستاره‌دار کردن (Set as Default) | Mark as primary wallet              |
| حذف کیف پول (Delete Wallet)     | Confirm and delete (if balance = 0) |
| صادرات (Export)                 | Download statement                  |

## Responsive Design

| Breakpoint          | Layout                                  |
| ------------------- | --------------------------------------- |
| Mobile (<640px)     | Stacked header, full-width transactions |
| Tablet (640-1024px) | Side-by-side header elements            |
| Desktop (>1024px)   | Full layout as shown                    |

## Acceptance Criteria

1. ✅ Page loads wallet details by ID from URL
2. ✅ Balance displayed prominently
3. ✅ Wallet ID and creation date shown
4. ✅ Quick action buttons work (open modals)
5. ✅ Transaction history loads with pagination
6. ✅ Filters work (date, type, status)
7. ✅ Search finds transactions
8. ✅ Clicking transaction shows details
9. ✅ Export downloads transaction history
10. ✅ More menu has edit/delete options
11. ✅ Back navigation works
12. ✅ Loading states shown during API calls
13. ✅ Error states handled gracefully

## Component Structure

```
front/pages/wallets/
└── [id].tsx                 # Main page (dynamic route)
    ├── components/
    │   ├── WalletHeader.tsx     # Wallet info card
    │   ├── QuickActions.tsx    # Deposit/Withdraw/Transfer buttons
    │   ├── WalletMenu.tsx      # More menu dropdown
    │   ├── TransactionList.tsx # Transaction history
    │   ├── TransactionItem.tsx # Single transaction row
    │   ├── TransactionFilters.tsx # Search and filters
    │   ├── TransactionModal.tsx # Transaction detail modal
    │   └── Pagination.tsx      # Page navigation
    └── hooks/
        └── useWallet.ts        # Fetch wallet data
```

## Tailwind CSS Classes Reference

```tsx
// Wallet Header Card
<div className="bg-linear-to-br from-primary to-primary/80 rounded-xl p-6 text-white">
  <h1 className="text-3xl font-bold">{wallet.name}</h1>
  <p className="text-4xl font-bold mt-4">{formatBalance(wallet.balance)}</p>
  <p className="font-mono mt-2">{formatWalletId(wallet.publicId)}</p>
  <p className="text-sm opacity-80 mt-2">ایجاد: {formatDate(wallet.createdAt)}</p>

  <div className="flex gap-2 mt-6">
    <Button variant="secondary">افزایش موجودی</Button>
    <Button variant="secondary">برداشت</Button>
    <Button variant="secondary">انتقال</Button>
  </div>
</div>

// Transaction Item
<div className="flex items-center justify-between p-4 border-b hover:bg-muted/50">
  <div className="flex items-center gap-4">
    <TransactionIcon className="w-10 h-10" />
    <div>
      <p className="font-medium">{transaction.type}</p>
      <p className="text-sm text-muted-foreground">{transaction.description}</p>
      <Badge variant={getStatusVariant(transaction.status)}>
        {transaction.status}
      </Badge>
    </div>
  </div>
  <div className="text-left">
    <p className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? '+' : '-'}{formatBalance(transaction.amount)}
    </p>
    <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
  </div>
</div>
```

## Implementation Notes

1. **Route Parameter:** Use `useRouter` to get `id` from URL
2. **Data Fetching:** Use `getWalletById` and `getWalletTransactions` in parallel
3. **Wallet Not Found:** Show 404 page if wallet doesn't exist or doesn't belong to user
4. **Large Balances:** Format with thousand separators (e.g., ۱,۰۰۰,۰۰۰)
5. **Transaction Loading:** Load initial 20, then paginate
6. **Real-time Updates:** Consider refetching on page focus
