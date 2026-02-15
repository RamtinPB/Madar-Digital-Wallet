# function authenticatedFetch(input: RequestInfo, init?: RequestInit) {

    init = init || {};
    init.credentials = init.credentials ?? "include";
    init.headers = init.headers || {};

    // Add authorization header
    if (accessToken) {
        (init.headers as any)["Authorization"] = `Bearer ${accessToken}`;
    }

    let res = await fetch(input, Frontend Documentation Plan - Madar Digital Wallet

## Overview

This document outlines the complete frontend codebase structure and provides a prioritized recommendation for documentation coverage. The frontend is built with Next.js, TypeScript init);

    // Handle 401: Try to refresh token
    if (res.status !== 401) return res;

    try {
        await refreshAccessToken();
    } catch (err), and uses various UI libraries including Radix UI and Tailwind CSS.

---

## 1. File Structure Analysis

### 1.1 Pages (`front/pages/`)

| File | Purpose | {
clearTokens();
return res;
}

    // Retry with new token
    if (accessToken)
        (init.headers as any)["Authorization"] = `Bearer ${accessToken Documentation Priority |

|------|---------|----------------------|
| `front/pages/index.tsx` | Dashboard page - main user interface after login | **P1** - Already documented in `dashboard.md`}`;
res = await fetch(input, init);
return res;
}

````

---

## 4. Backend Implementation

### 4.1 Database Schema

**File**: [`back/prisma/schema |
| `front/pages/login.tsx` | Login page with phone/OTP flow | **P1** - Authentication entry point |
| `front/pages/signup.tsx` | Signup page.prisma`](back/prisma/schema.prisma)

#### User Model

```prisma
model User {
  id            Int       @id @default(autoincrement())
  publicId      String    @unique @default(cuid())
  phoneNumber   String    @unique
  passwordHash  String
  userType      UserType  @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  otps          OTP[]
  refreshTokens RefreshToken[]
  wallets       Wallet[]
}

enum User for new users | **P1** - Authentication entry point |
| `front/pages/_app.tsx` | App wrapper with providers | **P2** - Framework configuration |

### 1.Type {
  CUSTOMER
  BUSINESS
  ADMIN
}
````

#### OTP Model

```prisma
model OTP {
  id          Int        @id @default(autoincrement())
 2 Core Components (`front/src/components/`)

#### Layout Components

| File | Purpose | Priority |
|------|---------|----------|
| `front/src/components/MainLayout.tsx` | Main app layout phoneNumber String
  codeHash    String     // Bcrypt hashed OTP
  expiresAt   DateTime
  consumed    Boolean    @default(false)
  purpose     OTPPurpose // LOG with sidebar navigation | **P1** |
| `front/src/components/AuthBootstrap.tsx` | Authentication state bootstrap | **P1** |

#### Dashboard Components

| File | Purpose | Priority |
|------|---------|----------|
| `front/src/components/dashboard/TotalBalanceCard.tsx` | Total balance display | **P1** - Documented |
| `front/src/components/dashboard/WalletSelector.tsx` | Wallet selection dropdown | **P1** - Documented |
| `front/src/components/dashboard/QuickActions.tsx` | Quick action buttons | **P1** - Documented |
| `front/src/components/dashboard/RecentTransactions.tsx` | Transaction list | **P1** - Documented |
| `front/src/components/dashboard/TransactionItem.tsx` | Transaction row | **P1** - Documented |
| `front/src/components/dashboard/index.ts` | Barrel export | **P3** |

#### Login Components

| File | Purpose | Priority |
|------|---------|----------|
| `front/src/components/login/StagePhone.tsx` | Phone number input stage | **P1** |
| `front/src/components/login/StageOTP.tsx` | OTP verification stage | **P1** |
| `front/src/components/login/LoginHeader.tsx` | Login page header | **P2** |
| `front/src/components/login/LoginFooterPhone.tsx` | Footer for phone stage | **P2** |
| `front/src/components/login/LoginFooterOTP.tsx` | Footer for OTP stage | **P2** |
| `front/src/components/login/index.ts` | Barrel export | **P3** |

### 1.3 Login Hooks (`front/src/components/login/hooks/`)

| File | Purpose | Priority |
|------|---------|----------|
| `front/src/components/login/hooks/useLoginStages.ts` | Login stage state management | **P1** |
| `front/src/components/login/hooks/useOTPCountdown.ts` | OTP resend countdown timer | **P2** |

### 1.4 Login Utilities (`front/src/components/login/utils/`)

| File | Purpose | Priority |
|------|---------|----------|
| `front/src/components/login/utils/formatTime.ts` | Time formatting for countdown | **P2** |

### 1.5 UI Components (`front/src/components/ui/`)

The project uses 30+ reusable UI components built on Radix UI. These are low-level components and typically don't need individual documentation unless they have custom behavior.

| Component | File | Priority |
|-----------|------|----------|
| Button | `front/src/components/ui/button.tsx` | **P2** |
| Card | `front/src/components/ui/card.tsx` | **P2** |
| Input | `front/src/components/ui/input.tsx` | **P2** |
| Select | `front/src/components/ui/select.tsx` | **P2** |
| Dialog | `front/src/components/ui/dialog.tsx` | **P2** |
| Avatar | `front/src/components/ui/avatar.tsx` | **P3** |
| Badge | `front/src/components/ui/badge.tsx` | **P3** |
| Skeleton | `front/src/components/ui/skeleton.tsx` | **P3** |
| Spinner | `front/src/components/ui/spinner.tsx` | **P3** |

**Note**: Most UI components are standard wrappers around Radix UI primitives and shadcn/ui patterns. They may not need individual documentation.

### 1.6 API Layer (`front/src/lib/api/`)

| File | Purpose | Priority |
|------|---------|----------|
| `front/src/lib/api/auth.ts` | Authentication API client | **P1** |
| `front/src/lib/api/wallet.ts` | Wallet/Transaction API client | **P1** - Documented in dashboard.md |
| `front/src/lib/api/fetcher.ts` | Base fetch utility | **P2** |

### 1.7IN, SIGNUP, VERIFY_TRANSACTION

  user   User?  @relation(fields: [userId], references: [id])
  userId Int?

  createdAt DateTime Utility Functions (`front/src/lib/`)

| File | Purpose | Priority |
|------|---------|----------|
| `front/src/lib/format.ts` | Number/currency formatting | **P1** - Documented in dashboard.md |
| `front/src/lib/date.ts` | Date utilities | **P1** - Documented in dashboard.md |
| `front/src/lib/utils.ts` | General utilities (cn function) | **P2** |

### 1.8 Auth Utilities (`front/src/lib/auth/`)

| File | Purpose | Priority |
|------|---------|----------|
| @default(now())

  @@index([phoneNumber])
}

enum OTPPurpose {
  LOGIN
  SIGNUP
  VERIFY_TRANSACTION
}
```

#### RefreshToken Model

```prisma
model RefreshToken {
  id        Int       @id @default(autoincrement())
  tokenHash String    // Bcrypt hashed token
  revoked   Boolean   @default(false `front/src/lib/auth/bootstrap.ts` | Auth bootstrap logic | **P1** |

### 1.9 Custom Hooks (`front/src/hooks/`)

| File | Purpose | Priority |
|------|---------|----------|
| `front/src/hooks/useAuth.ts` | Authentication state hook | **P1** |
| `front/src/hooks/use-mobile.ts` | Mobile)
  expiresAt DateTime

  user   User @relation(fields: [userId], references: [id])
  userId Int

  createdAt DateTime @default(now())
}
```

device detection | **P3** |

### 1.10 State Management (`front/src/stores/`)

| File | Purpose | Priority |
| ---- | ------- | -------- |

| `front/src/st### 4.2 Auth Controller

**File**: [`back/src/modules/auth/auth.controller.ts`](back/src/modules/auth/auth.controller.ts)

#### requestOtp Handler

```typescript
export const requestOtp = async (ctx: any) => {
    const body = await ctx.body;
    const phoneNumber = body.phoneNumber;
    let purpose = body.purpose;

    // Convert purposeores/auth.store.ts` | Auth state (Zustand) | **P1** |

### 1.11 Type Definitions (`front/src/types/`)

| File | Purpose | Priority |
| to uppercase enum
    if (purpose) {
        purpose = purpose.toUpperCase() as "SIGNUP" | "LOGIN" | "VERIFY_TRANSACTION";
    }

    if (!phone------|---------|----------|
| `front/src/types/wallet.ts` | Wallet/Transaction types | **P1** - Documented in dashboard.md |
| `front/src/types/auth.ts` | Auth types | **P2** |

### 1.12 Configuration (`front/src/config/`)

| File | Purpose | Priority |
|------|---------|----------|
| `front/src/config/sideNumber) {
        ctx.set.status = 400;
        return { error: "Phone number is required" };
    }

    try {
        const result = await authService.generateAndStoreOTP(bar.ts` | Sidebar navigation config | **P2** |

### 1.13 Styling (`front/src/`)

| File | Purpose | Priority |
|------|---------|----------|
| `front/src/globals.css` | Global CSS/Tailwind | **P2** |

### 1.14 Project Configuration

| File | Purpose | Priority |
|------|---------|----------|
phoneNumber, purpose);
        return { success: true, otp: result.otp }; // OTP returned in development
    } catch (err: any) {
        ctx.set.status = | `front/next.config.ts` | Next.js config | **P3** |
| `front/tsconfig.json` | TypeScript config | **P3** |
| `front/package.json400;
        return { error: err.message || "Failed to generate OTP" };
    }
};
```

#### signup Handler

```typescript
export const signup = async (ctx: any) => {
` | Dependencies | **P3** |
| `front/components.json` | shadcn/ui config | **P3** |

---

## 2. Priority Recommendations

### Priority 1 (    const body = await ctx.body;
    const { phoneNumber, password, otp, userType } = body || {};

    if (!phoneNumber || !password || !otp) {
       High) - Core User Flows

These files are critical for understanding the main application functionality:

1. **Authentication Flow** (for `docs/front/authentication.md`)
   - `front/pages/login.ts ctx.set.status = 400;
        return { error: "Phone number, password and OTP are required" };
    }

    const userAccountType = userType === "BUSINESS" ? "x` - Login page
   - `front/pages/signup.tsx` - Signup page
   - `front/src/components/login/StagePhone.tsx` - Phone input
   -BUSINESS" : "CUSTOMER";

    try {
        const created = await authService.signupWithPasswordOtp(
            phoneNumber,
            password,
            otp,
            userAccount `front/src/components/login/StageOTP.tsx` - OTP verification
   - `front/src/components/login/hooks/useLoginStages.ts` - Stage management
   - `front/src/lib/apiType,
        );

        // Set refresh token in httpOnly cookie
        ctx.cookie.refreshToken.set({
            value: created.refreshToken,
            httpOnly: true,
            sameSite: "/auth.ts` - Auth API
   - `front/src/hooks/useAuth.ts` - Auth hook
   - `front/src/stores/auth.store.ts` - Auth store
   - `front/src/lib/auth/bootstrap.ts` - Auth bootstrap

2. **Dashboard Flow** (already in `docs/front/dashboard.md`)
   - All dashboard components - ✅ Documented

3. **none",
            secure: true,
            path: "/",
            maxAge: Math.floor(parseExpiryToMs(REFRESH_TOKEN_EXP!) / 1000),
        });

        return { user: created.user, accessToken: created.accessToken };
    } catch (err: any) {
        ctx.set.status = 400;
        return { error: err.message || "signup failed" };
Core API & Types**
   - `front/src/lib/api/wallet.ts` - ✅ Documented in dashboard.md
   - `front/src/types/wallet.ts` - ✅ Documented in dashboard    }
};
```

#### login Handler

```typescript
export const login = async (ctx: any) => {
    const body = await ctx.body;
    const { phoneNumber, password, ot.md
   - `front/src/types/auth.ts` - Needs documentation

4. **Layout**
   - `front/src/components/MainLayout.tsx` - Main layout with sidebar
   - `p } = body || {};

    if (!phoneNumber || !password || !otp) {
        ctx.set.status = 400;
        return { error: "Phone number, password and OTP arefront/src/components/AuthBootstrap.tsx` - Auth initialization

### Priority 2 (Medium) - Supporting Components

These files support the core flows and would benefit from documentation:

1. **UI Components** - Only if custom behavior differs from standard
2. **Utility Functions**
   - `front/src/lib/format.ts` - ✅ Documented in dashboard.md
   - `front/src required" };
    }

    try {
        const res = await authService.loginWithPasswordOtp(phoneNumber, password, otp);

        // Set refresh token cookie
        ctx.cookie.refreshToken.set({
            value: res.refreshToken,
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/",
            maxAge: Math.floor/lib/date.ts` - ✅ Documented in dashboard.md
3. **Configuration**
   - `front/src/config/sidebar.ts` - Navigation config

### Priority 3 (Low)(parseExpiryToMs(REFRESH_TOKEN_EXP!) / 1000),
        });

        return { user: res.user, accessToken: res.accessToken };
    } catch (err: any) - Infrastructure

These are standard configuration files that rarely need documentation:

- Project config files (next.config.ts, tsconfig.json, etc.)
- Standard UI component wrappers
- Mobile detection hook

---

 {
        ctx.set.status = 400;
        return { error: err.message || "login failed" };
    }
};
```

#### refresh Handler

```typescript
export const refresh = async (ctx## 3. Recommended Documentation Order

### Phase 1: Authentication Documentation (Immediate)

Create/update `docs/front/authentication.md` with:

1. Login page (`login.tsx`)
2: any) => {
    let raw = ctx.cookie.refreshToken.value;

    // Dev mode: allow body parameter
    if (!raw && process.env.NODE_ENV === "development") {
        const body = await ctx.body;
        raw = body?.refreshToken;
    }

    if (!raw) {
        ctx.set.status = 401;
        return { error: "Refresh token is. Signup page (`signup.tsx`)
3. Login components:
   - StagePhone
   - StageOTP
   - LoginHeader
   - LoginFooterPhone
   - LoginFooterOTP required" };
    }

    try {
        const payload = verifyRefreshToken(raw);
        const tokens = await authService.refreshAccessToken(raw, payload);

        // Set new refresh token cookie

4. Login hooks:
   - useLoginStages
   - useOTPCountdown
5. Auth API client (`auth.ts`)
6. Auth types (`auth.ts`)
7. Auth ctx.cookie.refreshToken.set({
            value: tokens.refreshToken,
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/",
            maxAge hook (`useAuth.ts`)
8. Auth store (`auth.store.ts`)
9. Auth bootstrap (`bootstrap.ts`)

### Phase 2: Layout & Navigation

1. MainLayout component
2. AuthBootstrap component
3. Sidebar configuration

### Phase 3: Additional Utilities

1. Format utilities (if not covered)
2. Date utilities (if not covered)
3.: Math.floor(parseExpiryToMs(REFRESH_TOKEN_EXP!) / 1000),
        });

        return { accessToken: tokens.accessToken };
    } catch (err: any) {
        ctx.set.status = 401;
        return { error: err.message || "Invalid refresh token" };
    }
};
```

#### logout Handler

```typescript
export const logout = async (ctx: any) => {
    let refreshToken = ctx.cookie.refreshToken.value;

    // Allow supplying the refresh token in the request body for Swagger testing
    if (!refreshToken) {
        const body = await ctx.body;
        refreshToken = body?.refreshToken;
    }

    // Revoke refresh token if it exists
    if (refreshToken) {
        await authService.revokeRefreshToken(refreshToken);
    }

    // Clear the cookie (maxAge 0 = delete)
    ctx.cookie.refreshToken.set({
        value: "",
        httpOnly: true API fetcher

### Phase 4: UI Components (Optional)

Only document if custom behavior exists beyond Radix UI defaults.

---

## 4. Documentation Status Summary

| Category | Total Files,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 0, // delete immediately
    });

    return { ok: true };
};
```

| Documented      | Needs Documentation |
| --------------- | ------------------- | ---------------------------------- | --- |
| Pages           | 4                   | 1 (dashboard)                      | 3   |
| Core Components | 8                   | #### me Handler (Get Current User) |

```typescript
export const me = async (ctx: any) => {
    try {
        if (!ctx.user) {
            ctx.set.status = 401;
            return { error: "User not authenticated" };
        }

        // Return the user info from the token
6 (dashboard) | 2 |
| Login Components | 11 | 0 | 11 |
| Login Hooks | 2 | 0 | 2 |
| Login Utils | 1 | 0 | 1 |
| UI Components | 30+ | 0 | 0 (low priority) |
| API Layer | 3 | 1 | 2 |
| Utilities | 3 | 2 | 1 |
| Auth Utils | 1 | 0 | 1 |
| Hooks | 2 | 0 | 2 |
| Stores        return {
            user: { id: ctx.user.id, userType: ctx.user.userType },
        };
    } catch (error) {
        ctx.set.status = 401;
        return | 1 | 0 | 1 |
| Types | 2 | 1 | 1 |
| Config | 2 | 0 | 2 |
| **Total** | ** { error: "Invalid token" };
    }
};
```

### 4.3 Auth Service

**File**: [`back/src/modules/auth/auth.service.ts`](back/src/modules/auth/auth.service.ts)

~70** | **~12** | **~28\*\* |

---

## 5. Next Steps

1. **Immediate**: Complete `docs/front/authentication.md` covering:
   - Login#### OTP Generation

```typescript
const generateNumericOtp = (length: number) => {
    return String(Math.floor(Math.random() * Math.pow(10, length))).pad flow (phone → OTP → authenticated)
   - Signup flow
   - Auth state management
   - API integration

2. **Short-term**: Document layout and navigation:
   - MainStart(length, "0");
};

export const generateAndStoreOTP = async (
    phoneNumber: string,
    purpose: "SIGNUP" | "LOGIN" | "VERIFY_TRANSACTION",
Layout
   - Sidebar config

3. **Medium-term**: Document remaining utilities and API layer

4. **Optional**: Document any custom UI component behavior
```
