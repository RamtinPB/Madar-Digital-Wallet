# Sidebar Navigation Update Specification

## Current Sidebar (front/src/config/sidebar.ts)

```typescript
export const navItems: NavItem[] = [
	{
		key: "dashboard",
		name: "داشبورد",
		icon: LayoutDashboard,
		subNavItems: [],
		href: "/",
	},
	{
		key: "wallet",
		name: "کیف پول",
		icon: CreditCard,
		subNavItems: [
			{
				key: "wallets",
				name: "مدیریت کیف پول ها",
				href: "",
				icon: undefined,
			},
		],
		href: "",
	},
];
```

## Recommended Sidebar Update

```typescript
import {
	LayoutDashboard,
	CreditCard,
	Wallet,
	History,
	Settings,
	PlusCircle,
} from "lucide-react";

export const navItems: NavItem[] = [
	{
		key: "dashboard",
		name: "داشبورد",
		icon: LayoutDashboard,
		subNavItems: [],
		href: "/",
	},
	{
		key: "wallet",
		name: "کیف پول",
		icon: CreditCard,
		subNavItems: [
			{
				key: "wallets",
				name: "مدیریت کیف پول‌ها",
				icon: Wallet,
				href: "/wallets",
			},
			{
				key: "create-wallet",
				name: "ایجاد کیف پول جدید",
				icon: PlusCircle,
				href: "/wallets/create",
			},
		],
		href: "/wallets", // Parent links to management
	},
	{
		key: "transactions",
		name: "تاریخچه تراکنش‌ها",
		icon: History,
		subNavItems: [],
		href: "/transactions",
	},
	{
		key: "settings",
		name: "تنظیمات",
		icon: Settings,
		subNavItems: [],
		href: "/settings", // Future page
	},
];
```

## Updated Navigation Structure

| Key             | Name               | Route             | Icon            | Notes                 |
| --------------- | ------------------ | ----------------- | --------------- | --------------------- |
| dashboard       | داشبورد            | `/`               | LayoutDashboard | Already exists        |
| wallet          | کیف پول            | `/wallets`        | CreditCard      | Parent (opens subnav) |
| → wallets       | مدیریت کیف پول‌ها  | `/wallets`        | Wallet          | **NEW - implement**   |
| → create-wallet | ایجاد کیف پول جدید | `/wallets/create` | PlusCircle      | **NEW - implement**   |
| transactions    | تاریخچه تراکنش‌ها  | `/transactions`   | History         | **NEW - implement**   |
| settings        | تنظیمات            | `/settings`       | Settings        | Future                |

## Implementation Changes

### 1. Update sidebar.ts

- Add icons import
- Update wallet subNavItems with proper hrefs
- Add transactions nav item
- Add settings nav item (future)

### 2. Add new routes to Next.js

```typescript
// front/pages/wallets.tsx
// front/pages/wallets/create.tsx
// front/pages/wallets/[id].tsx
// front/pages/transactions.tsx
```

### 3. Update MainLayout.tsx (Optional)

- Update isPathActive logic if needed

## Quick Actions from Sidebar

The sidebar provides primary navigation. For quick actions (Deposit/Withdraw/Transfer), users will:

1. Navigate to `/wallets`
2. Click quick action buttons on wallet cards
3. Actions open as modals (not new pages)

This keeps navigation clean while providing fast access to common operations.

## File Changes Summary

| File                             | Change                          |
| -------------------------------- | ------------------------------- |
| `front/src/config/sidebar.ts`    | Update navItems with new routes |
| `front/pages/wallets.tsx`        | Create new page                 |
| `front/pages/wallets/create.tsx` | Create new page                 |
| `front/pages/wallets/[id].tsx`   | Create new page                 |
| `front/pages/transactions.tsx`   | Create new page                 |

## Navigation Flow Diagram

```mermaid
flowchart LR
    subgraph Sidebar
    A[داشبورد /] --> B[کیف پول /wallets]
    B --> C[مدیریت کیف پول‌ها]
    B --> D[ایجاد کیف پول جدید]
    A --> E[تاریخچه تراکنش‌ها /transactions]
    A --> F[تنظیمات /settings]
    end

    subgraph Pages
    C --> G[Wallet Details /wallets/[id]]
    G --> H[Transactions]
    end
```
