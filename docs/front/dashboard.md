# Dashboard Page Documentation - Madar Digital Wallet

## Overview

This document describes the complete implementation of the Dashboard page in the Madar Digital Wallet application. The dashboard provides users with a comprehensive view of their wallet(s), recent transactions, and quick access to financial operations.

**Language Support**: Persian/Farsi with full RTL (Right-to-Left) support

**Key Features**:

- Multiple wallet support per user
- Real-time balance display
- Transaction history per wallet
- Quick action buttons for Deposit, Withdraw, Transfer, and Create Wallet

---

## 1. Page Layout and Structure

### 1.1 Page Sections

The Dashboard page consists of the following sections:

```
┌─────────────────────────────────────────────────────────────┐
│                        Header                               │
│         (Page title + Welcome message + User info)         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Total Balance Card                      │   │
│  │     (Total balance + Wallet Selector Dropdown)      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │                     │  │                             │  │
│  │   Quick Actions     │  │    Wallet Details Card     │  │
│  │   (2x2 Grid with    │  │    (Selected wallet info)  │  │
│  │    4 buttons)       │  │                             │  │
│  │                     │  │                             │  │
│  └─────────────────────┘  └─────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │              Recent Transactions List                │   │
│  │               (Scrollable, max 10 items)            │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 RTL Considerations

- All text is in Persian/Farsi
- Layout flows from right to left
- Icons and arrows are positioned appropriately for RTL
- Numbers use Persian/Arabic numerals (۰۱۲۳۴۵۶۷۸۹)
- Currency formatting uses Persian locale (Tomans/تومان)
- Wallet selector uses Radix UI Select with `dir="rtl"` attribute

---

## 2. Multiple Wallet Support

### 2.1 Wallet Selector Component

The dashboard supports multiple wallets per user:

```
┌─────────────────────────────────────────────────────────┐
│  موجودی کل: ۲,۵۰۰,۰۰۰ تومان                             │
│  ─────────────────────────────────────────────────────  │
│  کیف پول: [کیف پول اصلی              ▼]                │
│            ├─ کیف پول اصلی (۱,۵۰۰,۰۰۰ تومان)           │
│            ├─ کیف پول دوم (۱,۰۰۰,۰۰۰ تومان)           │
│            └─ کیف پول جدید +                            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 State Management

```typescript
interface DashboardState {
	wallets: Wallet[]; // All user wallets
	selectedWalletId: string | null; // Currently selected wallet (as string)
	totalBalance: number; // Sum of all wallets
	transactions: Transaction[]; // Transactions for selected wallet
	isLoadingWallets: boolean;
	isLoadingTransactions: boolean;
	isCreatingWallet: boolean;
	error: string | null;
}
```

---

## 3. Frontend Components

### 3.1 Component Hierarchy

```
DashboardPage (pages/index.tsx)
├── TotalBalanceCard
├── WalletSelector
├── QuickActions
└── RecentTransactions
    └── TransactionItem
```

### 3.2 Core Components

| Component            | File                                          | Purpose                                   |
| -------------------- | --------------------------------------------- | ----------------------------------------- |
| `DashboardPage`      | `pages/index.tsx`                             | Main page container with state management |
| `TotalBalanceCard`   | `components/dashboard/TotalBalanceCard.tsx`   | Display sum of all wallet balances        |
| `WalletSelector`     | `components/dashboard/WalletSelector.tsx`     | Dropdown to select between wallets        |
| `QuickActions`       | `components/dashboard/QuickActions.tsx`       | 2x2 grid of action buttons                |
| `RecentTransactions` | `components/dashboard/RecentTransactions.tsx` | Transaction list for selected wallet      |
| `TransactionItem`    | `components/dashboard/TransactionItem.tsx`    | Individual transaction display            |

### 3.3 Component Details

#### DashboardPage (`pages/index.tsx`)

**State Variables**:

```typescript
const [wallets, setWallets] = useState<Wallet[]>([]);
const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [isLoadingWallets, setIsLoadingWallets] = useState(true);
const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
const [isCreatingWallet, setIsCreatingWallet] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Data Flow**:

1. On mount: Fetch all user wallets via [`getUserWallets()`](front/src/lib/api/wallet.ts:10)
2. Auto-select first wallet (or prompt to create one)
3. Fetch transactions for selected wallet via [`getWalletTransactions()`](front/src/lib/api/wallet.ts:48)
4. When wallet changes: Re-fetch transactions

**Computed Values**:

```typescript
const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0);
const selectedWallet = wallets.find(
	(w) => w.id.toString() === selectedWalletId,
);
```

#### TotalBalanceCard (`components/dashboard/TotalBalanceCard.tsx`)

**Props**:

```typescript
interface TotalBalanceCardProps {
	totalBalance: number;
	isLoading?: boolean;
}
```

**Features**:

- Gradient emerald background
- Displays total balance across all wallets
- Shows loading skeleton when `isLoading` is true
- Uses [`formatCurrency()`](front/src/lib/format.ts:7) for Persian formatting

#### WalletSelector (`components/dashboard/WalletSelector.tsx`)

**Props**:

```typescript
interface WalletSelectorProps {
	wallets: Wallet[];
	selectedWalletId: string | null;
	onSelect: (walletId: string) => void;
	isLoading?: boolean;
}
```

**Features**:

- Uses Radix UI Select component with `dir="rtl"`
- Shows wallet name or generated name from last 8 characters of publicId
- Displays balance alongside each option
- Last option: "ایجاد کیف پول جدید +" for creating new wallet
- Empty state: "کیف‌ پولی یافت نشد"

#### QuickActions (`components/dashboard/QuickActions.tsx`)

**Props**:

```typescript
interface QuickActionsProps {
	onDeposit: () => void;
	onWithdraw: () => void;
	onTransfer: () => void;
	onCreateWallet: () => void;
}
```

**Layout**: 2x2 grid with four action buttons:

| Button            | Icon        | Color  | Action                    |
| ----------------- | ----------- | ------ | ------------------------- |
| واریز (Deposit)   | ArrowDown   | Green  | Navigate to deposit flow  |
| برداشت (Withdraw) | ArrowUp     | Orange | Navigate to withdraw flow |
| انتقال (Transfer) | ArrowUpDown | Blue   | Navigate to transfer flow |
| ایجاد کیف پول     | Plus        | Amber  | Create new wallet         |

**Note**: Currently, these are TODO placeholders - navigation and functionality not yet implemented.

#### RecentTransactions (`components/dashboard/RecentTransactions.tsx`)

**Props**:

```typescript
interface RecentTransactionsProps {
	transactions: Transaction[];
	currentWalletId: number | null;
	isLoading?: boolean;
	onViewAll?: () => void;
}
```

**Features**:

- Displays transactions for the selected wallet
- Maximum 10 items (no pagination yet)
- Loading: Shows 5 skeleton items
- Empty state: "تراکنشی یافت نشد"
- `onViewAll` callback is defined but not wired to parent

#### TransactionItem (`components/dashboard/TransactionItem.tsx`)

**Props**:

```typescript
interface TransactionItemProps {
	transaction: Transaction;
	currentWalletId: number;
}
```

**Features**:

- **Icon Mapping by Transaction Type**:
  | Type | Icon | Color |
  |------|------|-------|
  | DEPOSIT | ArrowDown | Green |
  | WITHDRAW | ArrowUp | Red |
  | TRANSFER | ArrowLeftRight | Blue |
  | PURCHASE | ShoppingCart | Orange |
  | REFUND | RefreshCcw | Purple |
  | ADMIN_ADJUSTMENT | ShieldAlert | Yellow |

- **Title Logic**:
  - If TRANSFER and `currentWalletId === payerWalletId`: "انتقال به" (sent to)
  - If TRANSFER and `currentWalletId === receiverWalletId`: "انتقال از" (received from)
  - Otherwise: Transaction type in Persian

- **Amount Display**:
  - Positive (green): Deposits, refunds, receiving transfers
  - Negative (red): Withdrawals, purchases, sending transfers

- **Timestamp**: Uses [`getRelativeTime()`](front/src/lib/date.ts:2) for Persian relative time

### 3.4 Reusable UI Components

- `Card` - From `components/ui/card.tsx`
- `Button` - From `components/ui/button.tsx`
- `Badge` - From `components/ui/badge.tsx`
- `Select` - From `components/ui/select.tsx`
- `ScrollArea` - From `components/ui/scroll-area.tsx`
- `Skeleton` - From `components/ui/skeleton.tsx`
- Icons from `lucide-react` (ArrowDown, ArrowUp, ArrowLeftRight, ShoppingCart, RefreshCcw, ShieldAlert, Plus, Clock)

---

## 4. Backend API Integration

### 4.1 API Endpoints

#### Wallet Endpoints

| Endpoint                   | Method | Description             | Auth Required |
| -------------------------- | ------ | ----------------------- | ------------- |
| `/wallet`                  | POST   | Create new wallet       | ✅            |
| `/wallet`                  | GET    | Get all user wallets    | ✅            |
| `/wallet/:id`              | GET    | Get wallet by ID        | ✅            |
| `/wallet/public/:publicId` | GET    | Get wallet by public ID | ✅            |

#### Transaction Endpoints

| Endpoint                        | Method | Description                    | Auth Required |
| ------------------------------- | ------ | ------------------------------ | ------------- |
| `/transaction/transfer`         | POST   | Transfer between wallets       | ✅            |
| `/wallet/:id/withdraw`          | POST   | Withdraw from wallet           | ✅            |
| `/wallet/:id/deposit`           | POST   | Deposit to wallet              | ✅            |
| `/transaction/:id`              | GET    | Get transaction by ID          | ✅            |
| `/transaction/public/:publicId` | GET    | Get transaction by public ID   | ✅            |
| `/transactions/wallet/:id`      | GET    | Get wallet transaction history | ✅            |
| `/ledger/wallet/:id`            | GET    | Get wallet ledger entries      | ✅            |

### 4.2 Frontend API Client

**File**: [`front/src/lib/api/wallet.ts`](front/src/lib/api/wallet.ts)

```typescript
// Get all user wallets
export async function getUserWallets(): Promise<{ wallets: Wallet[] }>;

// Get wallet by ID
export async function getWalletById(id: string): Promise<{ wallet: Wallet }>;

// Get wallet transactions (recent)
export async function getWalletTransactions(
	id: string,
	limit?: number,
): Promise<{ transactions: Transaction[] }>;

// Create new wallet
export async function createWallet(): Promise<{ wallet: Wallet }>;

// Deposit to wallet
export async function depositToWallet(
	id: string,
	amount: string,
): Promise<{ transaction: Transaction }>;

// Withdraw from wallet
export async function withdrawFromWallet(
	id: string,
	amount: string,
): Promise<{ transaction: Transaction }>;

// Transfer funds between wallets
export async function transferFunds(
	fromWalletId: string,
	toWalletId: string,
	amount: string,
): Promise<{ transaction: Transaction }>;
```

**Authentication**: All API functions use [`authenticatedFetch()`](front/src/lib/api/auth.ts) which:

- Automatically adds `Authorization: Bearer <token>` header
- Handles 401 by attempting token refresh
- Retries request with new token after refresh

### 4.3 Type Definitions

**File**: [`front/src/types/wallet.ts`](front/src/types/wallet.ts)

```typescript
export interface Wallet {
	id: number;
	publicId: string;
	name?: string;
	balance: string; // Decimal from Prisma as string
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

## 5. Backend Architecture

### 5.1 Database Schema

**File**: [`back/prisma/schema.prisma`](back/prisma/schema.prisma)

#### User Model

```prisma
model User {
  id            Int       @id @default(autoincrement())
  publicId      String    @unique @default(cuid("public_id"))
  phoneNumber   String    @unique
  passwordHash  String
  userType      UserType  @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  wallets       Wallet[]
  otps          Otp[]
  refreshTokens RefreshToken[]
  paymentIntents PaymentIntent[]
}

enum UserType {
  CUSTOMER
  BUSINESS
  ADMIN
}
```

#### Wallet Model

```prisma
model Wallet {
  id            Int       @id @default(autoincrement())
  publicId      String    @unique @default(cuid("public_id"))
  balance       Decimal   @db.Decimal(18, 2) // Balance in Tomans
  userId        Int
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  user          User      @relation(fields: [userId], references: [id])
  payerTransactions Transaction[] @relation("PayerWallet")
  receiverTransactions Transaction[] @relation("ReceiverWallet")
  ledgerEntries LedgerEntry[]
  paymentIntents PaymentIntent[]
}
```

#### Transaction Model

```prisma
model Transaction {
  id               Int            @id @default(autoincrement())
  publicId         String         @unique @default(cuid("public_id"))
  status           TransactionStatus @default(PENDING)
  transactionType  TransactionType
  amount           Decimal        @db.Decimal(18, 2)
  payerWalletId    Int
  receiverWalletId Int?
  createdAt        DateTime       @default(now())
  payerWallet      Wallet         @relation("PayerWallet", fields: [payerWalletId], references: [id])
  receiverWallet   Wallet?        @relation("ReceiverWallet", fields: [receiverWalletId], references: [id])
  ledgerEntries    LedgerEntry[]
}

enum TransactionStatus {
  PENDING
  OTP_VERIFIED
  COMPLETED
  FAILED
}

enum TransactionType {
  TRANSFER       // P2P transfer
  DEPOSIT        // External deposit
  WITHDRAW       // External withdrawal
  PURCHASE       // Purchase
  REFUND        // Refund
  ADMIN_ADJUSTMENT // Admin adjustment
}
```

#### LedgerEntry Model

```prisma
model LedgerEntry {
  id            Int       @id @default(autoincrement())
  walletId      Int
  transactionId Int
  type          LedgerType
  amount        Decimal   @db.Decimal(18, 2) // Positive = deposit, Negative = withdrawal
  createdAt     DateTime  @default(now())
  wallet        Wallet    @relation(fields: [walletId], references: [id])
  transaction   Transaction @relation(fields: [transactionId], references: [id])
}

enum LedgerType {
  WITHDRAW
  DEPOSIT
  P2P
  PURCHASE
  REFUND
}
```

### 5.2 Backend Modules

#### Wallet Module

**Controller**: [`back/src/modules/wallet/wallet.controller.ts`](back/src/modules/wallet/wallet.controller.ts)

- Handles HTTP requests for wallet operations
- Returns formatted JSON responses

**Service**: [`back/src/modules/wallet/wallet.service.ts`](back/src/modules/wallet/wallet.service.ts)

- `createWalletForUser(userId)` - Creates wallet with 0 balance
- `getWallet(walletId)` - Fetches wallet by internal ID
- `getWalletByPublicId(publicId)` - Fetches wallet by public ID
- `getUserWallets(userId)` - Gets all wallets for user
- `fundWallet(walletId, amount)` - Deposits money (internal use)
- `withdrawFromWallet(walletId, amount)` - Withdraws money (internal use)
- `getWalletBalance(walletId)` - Gets wallet balance

**Repository**: [`back/src/modules/wallet/wallet.repository.ts`](back/src/modules/wallet/wallet.repository.ts)

- Database operations using Prisma ORM
- Methods: `createWallet`, `findWalletById`, `findWalletByPublicId`, `findWalletsByUserId`, `updateWalletBalance`, `getWalletBalance`

#### Transaction Module

**Controller**: [`back/src/modules/transaction/transaction.controller.ts`](back/src/modules/transaction/transaction.controller.ts)

- Handles HTTP requests for transaction operations

**Service**: [`back/src/modules/transaction/transaction.service.ts`](back/src/modules/transaction/transaction.service.ts)

- `transferFunds(payerWalletId, receiverWalletId, amount, userId)` - P2P transfer with atomic transaction
- `withdrawFunds(walletId, amount, userId)` - External withdrawal
- `depositFunds(walletId, amount, userId)` - External deposit
- `getTransaction(transactionId)` - Get by internal ID
- `getTransactionByPublicId(publicId)` - Get by public ID
- `getWalletTransactions(walletId, userId)` - Transaction history
- `getWalletLedger(walletId, userId)` - Ledger entries

**Repository**: [`back/src/modules/transaction/transaction.repository.ts`](back/src/modules/transaction/transaction.repository.ts)

- Database operations using Prisma ORM
- Methods: `createTransaction`, `findTransactionById`, `findTransactionByPublicId`, `updateTransactionStatus`, `findTransactionsByWalletId`, `createLedgerEntry`, `findLedgerEntriesByWalletId`

### 5.3 Authentication & Authorization

**JWT Implementation**: [`back/src/infrastructure/auth/jwt.provider.ts`](back/src/infrastructure/auth/jwt.provider.ts)

- **Access Token**: Signed with `JWT_ACCESS_SECRET`, configurable expiry
- **Refresh Token**: Signed with `JWT_REFRESH_SECRET`, longer expiry
- Token payload: `{userId, userType}`

**Auth Guard**: [`back/src/infrastructure/auth/auth.guard.ts`](back/src/infrastructure/auth/auth.guard.ts)

- `requireAuth` middleware extracts "Bearer \<token\>" from Authorization header
- Verifies token using JWT
- Attaches user info to context: `{id, userType}`
- Returns 401 on invalid/missing token

**All protected routes** require valid JWT token.

---

## 6. Data Flow

### 6.1 Dashboard Page Load Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard Page Load                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Fetch all wallets: GET /wallet                         │
│     Headers: Authorization: Bearer <access_token>          │
│     → Returns { wallets: Wallet[] }                         │
│                                                              │
│  2. Calculate total: Sum all wallet balances               │
│                                                              │
│  3. Select default: First wallet (or prompt to create)     │
│                                                              │
│  4. Fetch transactions: GET /transactions/wallet/:id       │
│     → Returns { transactions: Transaction[] }              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  User changes wallet selector → setSelectedWalletId(id)    │
│                            │                                │
│                            ▼                                │
│  Fetch transactions for new wallet                         │
│  GET /transactions/wallet/:newId                           │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Create Wallet Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User clicks "ایجاد کیف پول جدید" in selector              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  POST /wallet                                               │
│  Headers: Authorization: Bearer <access_token>             │
│  Body: {} (empty - uses authenticated user's ID)            │
│     → Returns { wallet: Wallet }                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Add new wallet to wallets array                           │
│  Auto-select newly created wallet                          │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 API Request/Response Formats

#### Success Response (GET /wallet)

```json
{
	"wallets": [
		{
			"id": 1,
			"publicId": "ck123abc456",
			"balance": "1500000",
			"createdAt": "2026-02-14T12:00:00.000Z",
			"updatedAt": "2026-02-14T12:00:00.000Z"
		}
	]
}
```

#### Success Response (GET /transactions/wallet/:id)

```json
{
	"transactions": [
		{
			"id": 1,
			"publicId": "tr123abc",
			"status": "COMPLETED",
			"transactionType": "TRANSFER",
			"amount": "500000",
			"payerWalletId": 1,
			"receiverWalletId": 2,
			"createdAt": "2026-02-14T12:00:00.000Z",
			"receiverWallet": {
				"user": {
					"phoneNumber": "09123456789"
				}
			}
		}
	]
}
```

#### Error Response

```json
{
	"error": "Insufficient balance"
}
```

HTTP Status Codes: 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)

---

## 7. Utility Functions

### 7.1 Number/Currency Formatting

**File**: [`front/src/lib/format.ts`](front/src/lib/format.ts)

```typescript
// Converts number to Persian numerals
formatNumber(num: number): string
// Example: 1000 → "۱,۰۰۰"

// Formats currency in Tomans
formatCurrency(amount: number | string): string
// Example: 1000000 → "۱,۰۰۰,۰۰۰ تومان"

// Shows last 8 characters of publicId
formatWalletId(publicId: string): string
// Example: "ck123abc456def" → "abc456de"
```

### 7.2 Date Utilities

**File**: [`front/src/lib/date.ts`](front/src/lib/date.ts)

```typescript
// Returns Persian relative time
getRelativeTime(date: Date | string): string
// Examples: "همین الان", "۵ دقیقه پیش", "۱ ساعت پیش", "دیروز", "۲ روز پیش"

// Returns Persian date
formatDate(date: Date | string): string
// Example: "۱۴ فروردین ۱۴۰۴"
```

---

## 8. Wireframe Sketch

### 8.1 Main Dashboard Layout

```
┌────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  داشبورد                                  👤 ۰۹۱۲۳۴۵۶۷۸  │  │
│  └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  موجودی کل: ۲,۵۰۰,۰۰۰ تومان                              │  │
│  │  ───────────────────────────────────────────────────────│  │
│  │  کیف پول: [کیف پول اصلی              ▼]                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────┐  ┌──────────────────────────┐    │
│  │  ┌────┐ ┌────┐         │  │  ┌──────────────────────┐│    │
│  │  │➕  │ │➖  │         │  │  │    کیف پول انتخابی  ││    │
│  │  │واریز│ │برداشت│        │  │  │                      ││    │
│  │  └────┘ └────┘         │  │  │      ۱,۵۰۰,۰۰۰       ││    │
│  │  ┌────┐ ┌────┐         │  │  │       تومان          ││    │
│  │  │↔️  │ │➕  │         │  │  │                      ││    │
│  │  │انتقال│ │کیف پول│       │  │  │  ────────────────    ││    │
│  │  └────┘ └────┘         │  │  │  شناسه: ck123abc     ││    │
│  └────────────────────────┘  └──────────────────────────────┘│
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  تراکنش‌های اخیر                                          │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ 🟢  انتقال وجه دریافتی                           │  │ │
│  │  │    از: ۰۹۱۱۲۳۴۵۶۷۸              ۵۰۰,۰۰۰ تومان │  │ │
│  │  │    ۲ ساعت پیش                                   │  │ │
│  │  ├────────────────────────────────────────────────────┤  │ │
│  │  │ 🔴  برداشت وجه                                   │  │ │
│  │  │    به حساب بانکی              ۲۰۰,۰۰۰ تومان    │  │ │
│  │  │    دیروز                                          │  │ │
│  │  ├────────────────────────────────────────────────────┤  │ │
│  │  │ 🟢  انتقال وجه ارسالی                            │  │ │
│  │  │    به: ۰۹۱۱۲۳۴۵۶۷۸              ۱۰۰,۰۰۰ تومان    │  │ │
│  │  │    دیروز                                          │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 9. Acceptance Criteria

| #   | Criterion                                                                    | Status |
| --- | ---------------------------------------------------------------------------- | ------ |
| 1   | Dashboard displays total balance across all wallets in Persian locale        | ✅     |
| 2   | Wallet selector dropdown allows switching between wallets                    | ✅     |
| 3   | Selected wallet's transactions are displayed                                 | ✅     |
| 4   | Recent transactions show last 10 items                                       | ✅     |
| 5   | All text is in Persian/Farsi                                                 | ✅     |
| 6   | Numbers use Persian numerals                                                 | ✅     |
| 7   | RTL layout works correctly                                                   | ✅     |
| 8   | Loading states show skeleton components                                      | ✅     |
| 9   | Error states are handled gracefully                                          | ✅     |
| 10  | Quick action buttons are displayed (Deposit/Withdraw/Transfer/Create Wallet) | ✅     |
| 11  | Transactions are color-coded (green for receive, red for send)               | ✅     |
| 12  | Timestamps show relative Persian time                                        | ✅     |
| 13  | Empty state when user has no wallets                                         | ✅     |
| 14  | Wallet selection allows creating new wallet                                  | ✅     |

---

## 10. Implementation Notes

### 10.1 Current Limitations

- Quick action buttons (Deposit, Withdraw, Transfer) are visual placeholders only - navigation and functionality not yet implemented
- No pagination for transactions (limited to 10 most recent)
- No wallet naming/editing functionality (uses auto-generated names from publicId)
- No localStorage persistence for selected wallet

### 10.2 Future Enhancements

- Implement full deposit/withdraw/transfer flows
- Add transaction pagination
- Add wallet rename functionality
- Persist selected wallet in localStorage
- Add "View All Transactions" page link
- Implement wallet creation form with custom name

---

## 11. File Structure Summary

### Frontend Files

```
front/
├── pages/
│   ├── index.tsx              # Dashboard page (main container)
│   ├── _app.tsx               # App wrapper
│   ├── login.tsx              # Login page
│   └── signup.tsx             # Signup page
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── index.ts                   # Barrel export
│   │   │   ├── TotalBalanceCard.tsx       # Total balance display
│   │   │   ├── WalletSelector.tsx         # Wallet dropdown
│   │   │   ├── QuickActions.tsx           # Action buttons
│   │   │   ├── RecentTransactions.tsx     # Transaction list
│   │   │   └── TransactionItem.tsx        # Transaction row
│   │   └── ui/                            # Reusable UI components
│   ├── lib/
│   │   ├── api/
│   │   │   ├── wallet.ts                  # Wallet API client
│   │   │   ├── auth.ts                    # Auth API client
│   │   │   └── fetcher.ts                 # Fetch utility
│   │   ├── format.ts                      # Number/currency formatting
│   │   └── date.ts                        # Date utilities
│   └── types/
│       └── wallet.ts                      # TypeScript interfaces
```

### Backend Files

```
back/
├── src/
│   ├── modules/
│   │   ├── wallet/
│   │   │   ├── wallet.controller.ts       # HTTP handlers
│   │   │   ├── wallet.service.ts          # Business logic
│   │   │   ├── wallet.repository.ts        # Database operations
│   │   │   └── wallet.route.ts             # Route definitions
│   │   ├── transaction/
│   │   │   ├── transaction.controller.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── transaction.repository.ts
│   │   │   └── transaction.route.ts
│   │   └── auth/
│   ├── infrastructure/
│   │   ├── auth/
│   │   │   ├── auth.guard.ts               # JWT authentication
│   │   │   ├── jwt.provider.ts             # Token management
│   │   │   └── role.guard.ts               # Role authorization
│   │   └── db/
│   │       └── prisma.client.ts            # Database client
│   └── shared/
├── prisma/
│   └── schema.prisma                        # Database schema
```
