# Transactions History Page Specification

## Overview

- **Route:** `/transactions`
- **File:** `front/pages/transactions.tsx`
- **Purpose:** Global view of all transactions across all wallets with advanced filtering

## Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│  [← بازگشت به داشبورد]                         [-sidebar]      │
│  [Back to Dashboard]                                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    تاریخچه تراکنش‌ها                      │  │
│  │                 Transaction History                      │  │
│  │                                                          │  │
│  │  مجموع: ۱۵ تراکنش                          [صادرات ▼]  │  │
│  │  Total: 15 transactions                    [Export ▼]    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [🔍 جستجوی شماره تراکنش یا شرح...]                      │  │
│  │  [Search transaction ID or description...]               │  │
│  │                                                          │  │
│  │  [کیف پول: همه ▼]  [نوع: همه ▼]  [وضعیت: همه ▼]         │  │
│  │  [Wallet: All]    [Type: All]    [Status: All]          │  │
│  │                                                          │  │
│  │  [از تاریخ: ۱۴۰۴/۰۱/۰۱]  [تا تاریخ: ۱۴۰۴/۱۱/۳۰]       │  │
│  │  [From: 2025-03-21]    [To: 2026-02-15]                 │  │
│  │                                                          │  │
│  │  [فیلتر]  [پاک کردن]                                    │  │
│  │  [Apply]    [Clear]                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📊 خلاصه فیلترها:                                      │  │
│  │  Filter Summary:                                        │  │
│  │  ├─ نوع: افزایش موجودی                                   │  │
│  │  ├─ وضعیت: تکمیل شده                                    │  │
│  │  └─ [پاک کردن همه]                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  📥  افزایش موجودی                    +۵۰۰,۰۰۰  │  │  │
│  │  │      توسط: ۰۹۱۲۳۴۵۶۷۸۹                   ۱۴۰۴/۱۱/۲۵│  │  │
│  │  │      کیف پول اصلی                              ✅   │  │  │
│  │  │      [مشاهده جزئیات]                            ▼   │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  📤  برداشت                         -۱۰۰,۰۰۰  │  │  │
│  │  │      به حساب: ۱۲۳۴...                          │  │  │
│  │  │      کیف پول اصلی                    ۱۴۰۴/۱۱/۲۴ ❌   │  │  │
│  │  │      [مشاهده جزئیات]                            ▼   │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  ↔️  انتقال به کیف پول دوم          -۲۰۰,۰۰۰  │  │  │
│  │  │      به: ۰۹۱۲۳۴۵۶۷۸۹۰                         │  │  │
│  │  │      کیف پول دوم                  ۱۴۰۴/۱۱/۲۳ ⏳   │  │  │
│  │  │      [مشاهده جزئیات]                            ▼   │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  📥  افزایش موجودی                    +۱۰۰,۰۰۰  │  │  │
│  │  │      توسط: ۰۹۱۲۳۴۵۶۷۸۹                   ۱۴۰۴/۱۱/۲۲│  │  │
│  │  │      کیف پول اصلی                              ✅   │  │  │
│  │  │      [مشاهده جزئیات]                            ▼   │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  🛒  خرید                        -۵۰,۰۰۰  │  │  │
│  │  │      فروشگاه: دیجی‌کالا                       │  │  │
│  │  │      کیف پول دوم                    ۱۴۰۴/۱۱/۲۱ ✅   │  │  │
│  │  │      [مشاهده جزئیات]                            ▼   │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                    [1] [2] [3] [بعدی]                   │  │
│  │                    [1] [2] [3] [Next]                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Page Header

- **Title:** "تاریخچه تراکنش‌ها" (Transaction History)
- **Total Count:** "مجموع: ۱۵ تراکنش"
- **Export Dropdown:** CSV, PDF options

### 2. Search Bar

- **Input:** Search by transaction ID or description
- **Placeholder:** "جستجوی شماره تراکنش یا شرح..."
- **Real-time filtering**

### 3. Filter Section

#### Wallet Filter

- **Label:** "کیف پول"
- **Options:** "همه" (All), list of user's wallets
- **Default:** All wallets

#### Transaction Type Filter

- **Label:** "نوع تراکنش"
- **Options:**
  - "همه" (All)
  - 📥 افزایش موجودی (Deposit)
  - 📤 برداشت (Withdraw)
  - ↔️ انتقال (Transfer)
  - 🛒 خرید (Purchase)
  - ↩️ بازگشت (Refund)
  - 🔧 تعدیل (Admin Adjustment)

#### Status Filter

- **Label:** "وضعیت"
- **Options:**
  - "همه" (All)
  - ⏳ در انتظار (Pending)
  - 🔐 نیاز به تایید (OTP Verified)
  - ✅ تکمیل شده (Completed)
  - ❌ ناموفق (Failed)

#### Date Range Filter

- **From Date:** Date picker
- **To Date:** Date picker

#### Filter Actions

- **Apply:** Apply filters
- **Clear:** Reset all filters

### 4. Active Filters Summary

- Shows currently active filters as removable tags
- "پاک کردن همه" (Clear All) button

### 5. Transaction List

- **Format:** Table or card list
- **Sortable:** By date, amount
- **Pagination:** 20 items per page

### 6. Transaction Row/Item

| Field       | Display                   |
| ----------- | ------------------------- |
| Type Icon   | Emoji + colored icon      |
| Type Name   | Transaction type in Farsi |
| Amount      | + Green / - Red           |
| Description | Recipient, merchant, etc. |
| Wallet      | Which wallet was used     |
| Date        | Formatted Persian date    |
| Status      | Badge with status         |
| Actions     | Expand/View Details       |

### 7. Transaction Detail (Expandable/Modal)

```
┌────────────────────────────────────────┐
│  شماره تراکنش: TXN-۱۲۳۴۵۶۷۸۹         │
│                                        │
│  نوع: افزایش موجودی                    │
│  مبلغ: ۵۰۰,۰۰۰ تومان                 │
│  کیف پول: کیف پول اصلی                │
│  تاریخ: ۱۴۰۴/۱۱/۲۵ - ساعت ۱۴:۳۰    │
│  وضعیت: تکمیل شده                      │
│                                        │
│  ──────────────────────────────────   │
│                                        │
│  جزئیات:                               │
│  از: ۰۹۱۲۳۴۵۶۷۸۹                       │
│  به: کیف پول اصلی شما                 │
│                                        │
│  [دریافت فاکتور]                       │
│  [بستن]                                │
└────────────────────────────────────────┘
```

### 8. Pagination

- Page numbers
- Items per page: 20, 50, 100
- Total pages indicator

## Functionality

### User Interactions

1. **View all transactions** - Paginated list
2. **Search** - By transaction ID or description
3. **Filter by wallet** - Show only specific wallet
4. **Filter by type** - Deposit, Withdraw, Transfer, etc.
5. **Filter by status** - Pending, Completed, Failed
6. **Filter by date** - Date range picker
7. **Sort transactions** - By date (default), amount
8. **View transaction details** - Expand or click
9. **Export transactions** - Download CSV/PDF
10. **Pagination** - Navigate through pages

### Data Handling

- Fetch all transactions via new API endpoint (or aggregate from wallets)
- Apply filters on client or server-side
- Debounce search input
- Store filter state in URL params

### API Endpoints Needed

- `GET /transactions` - Global transaction list with filters (may need to create)
- `GET /transactions/:id` - Single transaction details

## Filter Logic

```typescript
interface TransactionFilters {
	walletId?: number; // Specific wallet or 'all'
	type?: TransactionType; // DEPOSIT, WITHDRAW, TRANSFER, etc.
	status?: TransactionStatus; // PENDING, COMPLETED, FAILED
	startDate?: string; // ISO date
	endDate?: string; // ISO date
	search?: string; // Transaction ID or description
	page?: number;
	limit?: number;
	sortBy?: "date" | "amount";
	sortOrder?: "asc" | "desc";
}
```

## Responsive Design

| Breakpoint          | Layout                                     |
| ------------------- | ------------------------------------------ |
| Mobile (<640px)     | Single column, horizontal scroll for table |
| Tablet (640-1024px) | Collapsible filters                        |
| Desktop (>1024px)   | Full layout as shown                       |

## Acceptance Criteria

1. ✅ Page loads all transactions (paginated)
2. ✅ Search filters transactions by ID/description
3. ✅ Wallet filter shows only selected wallet's transactions
4. ✅ Type filter shows only specific transaction types
5. ✅ Status filter shows only specific statuses
6. ✅ Date range filter works correctly
7. ✅ Active filters shown as removable tags
8. ✅ "پاک کردن همه" resets all filters
9. ✅ Clicking transaction shows details (expandable or modal)
10. ✅ Export downloads CSV/PDF
11. ✅ Pagination works correctly
12. ✅ Loading states shown during fetch
13. ✅ Empty state when no transactions match filters
14. ✅ Error state handled gracefully

## Component Structure

```
front/pages/
└── transactions.tsx          # Main page
    ├── components/
    │   ├── TransactionFilters.tsx    # Filter controls
    │   ├── ActiveFilters.tsx         # Active filter tags
    │   ├── TransactionTable.tsx      # Table layout
    │   ├── TransactionRow.tsx        # Single row
    │   ├── TransactionDetail.tsx    # Detail modal/panel
    │   ├── TransactionExport.tsx    # Export dropdown
    │   └── TransactionPagination.tsx # Pagination
    └── hooks/
        └── useTransactions.ts      # Fetch and filter logic
```

## Tailwind CSS Classes Reference

```tsx
// Page Container
<div className="space-y-6 p-6">

// Header
<div className="flex items-center justify-between">
  <h1 className="text-2xl font-bold">تاریخچه تراکنش‌ها</h1>
  <ExportDropdown />
</div>

// Filters Card
<div className="bg-card rounded-lg border p-4 space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Input placeholder="جستجو..." />
    <Select>
      <SelectTrigger>کیف پول</SelectTrigger>
      <SelectContent>...</SelectContent>
    </Select>
    <Select>
      <SelectTrigger>نوع</SelectTrigger>
      <SelectContent>...</SelectContent>
    </Select>
    <Select>
      <SelectTrigger>وضعیت</SelectTrigger>
      <SelectContent>...</SelectContent>
    </Select>
  </div>
  <div className="flex gap-2">
    <DatePicker placeholder="از تاریخ" />
    <DatePicker placeholder="تا تاریخ" />
    <Button>فیلتر</Button>
    <Button variant="outline">پاک کردن</Button>
  </div>
</div>

// Active Filters
<div className="flex gap-2 flex-wrap">
  <Badge>نوع: افزایش موجودی <X /></Badge>
  <Badge>وضعیت: تکمیل شده <X /></Badge>
  <Button variant="link" size="sm">پاک کردن همه</Button>
</div>

// Transaction Row
<div className="flex items-center justify-between p-4 border-b hover:bg-muted/50 cursor-pointer">
  <div className="flex items-center gap-4">
    <TransactionIcon className="w-10 h-10" />
    <div>
      <p className="font-medium">{type}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex gap-2 mt-1">
        <Badge variant="outline">{wallet}</Badge>
        <Badge variant={statusVariant}>{status}</Badge>
      </div>
    </div>
  </div>
  <div className="text-left">
    <p className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? '+' : '-'}{amount}
    </p>
    <p className="text-sm text-muted-foreground">{date}</p>
  </div>
</div>
```

## Implementation Notes

1. **API Consideration:** May need new endpoint `/transactions` that aggregates across all wallets
2. **Filter Persistence:** Store filters in URL params for shareability
3. **Performance:** Use virtualization for large transaction lists
4. **Date Format:** Use Persian calendar (use `@date-fns/jalali` or similar)
5. **Amount Formatting:** Use thousand separators and proper currency format
6. **Export:** Generate CSV client-side or request from backend
