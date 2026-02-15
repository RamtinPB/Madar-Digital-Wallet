# Create Wallet Page Specification

## Overview

- **Route:** `/wallets/create`
- **File:** `front/pages/wallets/create.tsx`
- **Purpose:** Dedicated flow for creating a new wallet

## Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│  [← بازگشت به کیف پول‌ها]                       [-sidebar]      │
│  [Back to Wallets]                                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    ایجاد کیف پول جدید                    │  │
│  │                 Create New Wallet                        │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │                                                    │  │  │
│  │  │  نام کیف پول (اختیاری)                            │  │  │
│  │  │  Wallet Name (Optional)                           │  │  │
│  │  │                                                    │  │  │
│  │  │  [________________________]                        │  │  │
│  │  │                                                    │  │  │
│  │  │  می‌توانید برای کیف پول خود یک نام انتخاب کنید    │  │  │
│  │  │  You can choose a name for your wallet            │  │  │
│  │  │                                                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │                                                    │  │  │
│  │  │              [wallet-icon]                        │  │  │
│  │  │                                                    │  │  │
│  │  │     کیف پول شما به صورت خودکار ایجاد می‌شود       │  │  │
│  │  │     Your wallet will be created automatically     │  │  │
│  │  │                                                    │  │  │
│  │  │     شماره کیف پول: ۱۲۳۴-۵۶۷۸-۹۰۱۲-۳۴۵۶          │  │  │
│  │  │     Wallet ID: 1234-5678-9012-3456               │  │  │
│  │  │                                                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │                                                    │  │  │
│  │  │              [+ ایجاد کیف پول]                    │  │  │
│  │  │              [Create Wallet]                       │  │  │
│  │  │                                                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Back Navigation

- **Link:** "← بازگشت به کیف پول‌ها" → navigates to `/wallets`
- **Position:** Top left

### 2. Page Header

- **Title:** "ایجاد کیف پول جدید" (Create New Wallet)
- **Subtitle:** Brief description

### 3. Wallet Name Input

- **Label:** "نام کیف پول (اختیاری)" (Wallet Name - Optional)
- **Placeholder:** "مثلاً: کیف پول شخصی"
- **Type:** Text input
- **Max Length:** 50 characters
- **Validation:** Optional field

### 4. Preview Card

- Shows what the wallet will look like
- Displays generated wallet ID (from API)
- Visual representation of wallet

### 5. Create Button

- **Label:** "ایجاد کیف پول" (Create Wallet)
- **Style:** Primary button, full width
- **States:** Default, Loading, Disabled

## States

### Loading State

- Button shows spinner
- Input disabled
- "در حال ایجاد..." (Creating...)

### Success State

```
┌────────────────────────────────────────────────────────────┐
│                    ✓ کیف پول ایجاد شد                      │
│                 ✓ Wallet Created Successfully              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              [wallet-icon]                           │  │
│  │                                                      │  │
│  │     کیف پول اصلی                                    │  │
│  │     Main Wallet                                      │  │
│  │                                                      │  │
│  │     موجودی: ۰ تومان                                 │  │
│  │     Balance: 0                                       │  │
│  │                                                      │  │
│  │     شماره کیف پول: ۱۲۳۴-۵۶۷۸-۹۰۱۲-۳۴۵۶            │  │
│  │     1234-5678-9012-3456                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [بازگشت به کیف پول‌ها]         [مشاهده کیف پول]          │
│  [Back to Wallets]              [View Wallet]              │
└────────────────────────────────────────────────────────────┘
```

### Error State

- Show error message
- "خطا در ایجاد کیف پول"
- Retry button

## Functionality

### User Interactions

1. **Enter wallet name** - Optional, can skip
2. **Click create** - Submits to API
3. **View success** - Shows created wallet details
4. **Navigate** - Go back or view new wallet

### Data Handling

- Call `createWallet()` API with optional name
- Get generated wallet ID from response
- Navigate to success state or wallet details

### API Endpoints Used

- `POST /wallet` - Create new wallet

## Responsive Design

| Breakpoint          | Layout                           |
| ------------------- | -------------------------------- |
| Mobile (<640px)     | Single column, full width inputs |
| Tablet (640-1024px) | Centered card, max-width 500px   |
| Desktop (>1024px)   | Centered card, max-width 500px   |

## Acceptance Criteria

1. ✅ Page shows form with optional wallet name input
2. ✅ Preview shows wallet that will be created
3. ✅ Create button submits to API
4. ✅ Loading state while creating
5. ✅ Success state shows created wallet
6. ✅ Back link returns to `/wallets`
7. ✅ Error handling with retry option
8. ✅ Form works without wallet name (optional)

## Component Structure

```
front/pages/wallets/
└── create.tsx              # Main page
    ├── components/
    │   ├── WalletNameInput.tsx
    │   ├── WalletPreview.tsx
    │   ├── CreateSuccess.tsx
    │   └── CreateButton.tsx
```

## Tailwind CSS Classes Reference

```tsx
// Container
<div className="max-w-md mx-auto p-6">

// Page Title
<h1 className="text-2xl font-bold text-center mb-2">
  ایجاد کیف پول جدید
</h1>

// Input Field
<div className="space-y-2">
  <Label>نام کیف پول (اختیاری)</Label>
  <Input
    placeholder="مثلاً: کیف پول شخصی"
    maxLength={50}
  />
</div>

// Preview Card
<div className="bg-muted rounded-lg p-6 text-center space-y-4">
  <WalletIcon className="w-16 h-16 mx-auto" />
  <p className="text-muted-foreground">
    کیف پول شما به صورت خودکار ایجاد می‌شود
  </p>
  <p className="font-mono text-sm">1234-5678-9012-3456</p>
</div>

// Create Button
<Button className="w-full" disabled={isLoading}>
  {isLoading ? 'در حال ایجاد...' : 'ایجاد کیف پول'}
</Button>

// Success State
<div className="text-center space-y-4">
  <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500" />
  <h2>کیف پول ایجاد شد</h2>
</div>
```

## Implementation Notes

1. **Wallet ID Generation:** The backend generates the wallet ID automatically
2. **Optional Name:** User can create wallet without a name (system generates default name)
3. **Immediate Creation:** No OTP required for creation (only for transactions)
4. **Redirect After Success:** User can go back to wallets list or view the new wallet
