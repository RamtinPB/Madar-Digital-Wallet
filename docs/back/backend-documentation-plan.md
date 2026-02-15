# Backend Documentation Plan

This document provides a comprehensive inventory and prioritized documentation plan for the Madar Digital Wallet backend codebase.

## Table of Contents

1. [Documentation Priority Overview](#documentation-priority-overview)
2. [Tier 1: Critical \& Foundational Components](#tier-1-critical--foundational-components)
3. [Tier 2: High-Traffic Business Logic](#tier-2-high-traffic-business-logic)
4. [Tier 3: Utility \& Helper Modules](#tier-3-utility--helper-modules)
5. [Tier 4: Configuration \& Infrastructure](#tier-4-configuration--infrastructure)
6. [Documentation Structure Template](#documentation-structure-template)

---

## Documentation Priority Overview

| Priority | Tier   | Component Types                                | Rationale                                              |
| -------- | ------ | ---------------------------------------------- | ------------------------------------------------------ |
| **P0**   | Tier 1 | Database Schema, Auth Guards, JWT Provider     | Core foundation - without these, nothing works         |
| **P1**   | Tier 2 | Auth Module, Wallet Module, Transaction Module | High-traffic endpoints with significant business logic |
| **P2**   | Tier 3 | Error Handling, Hash Utilities                 | Shared utilities used across the application           |
| **P3**   | Tier 4 | Server Configuration, Prisma Client            | Infrastructure configuration                           |

---

## Tier 1: Critical \& Foundational Components

### 1.1 Database Schema \& Models

**File:** `back/prisma/schema.prisma`

**Priority:** P0 - Critical

**Rationale:** This is the single source of truth for all data structures. Every module depends on these models.

**Documentation Topics:**

- Schema overview and entity relationship diagram
- Model definitions:
  - `User` - Core user entity with phone authentication
  - `Wallet` - Digital wallet with balance tracking
  - `Transaction` - All financial transactions
  - `LedgerEntry` - Immutable transaction history
  - `OTP` - One-time password for authentication
  - `RefreshToken` - Token refresh mechanism
  - `RevokedAccessToken` - Token blacklist management
  - `Invoice` / `PaymentIntent` - Future payment features
- Enum definitions: `UserType`, `OTPPurpose`, `TransactionType`, `TransactionStatus`, `LedgerType`
- Indexes and performance considerations
- Migration history and versioning

---

### 1.2 Authentication Guards

**File:** `back/src/infrastructure/auth/auth.guard.ts`

**Priority:** P0 - Critical

**Rationale:** Every protected endpoint uses this guard. It is the first line of defense for API security.

**Documentation Topics:**

- How `requireAuth` middleware works
- Authorization header parsing (Bearer token)
- Token validation flow
- User context attachment to request
- Error responses (401 Unauthorized)
- Usage in route definitions

---

### 1.3 JWT Provider

**File:** `back/src/infrastructure/auth/jwt.provider.ts`

**Priority:** P0 - Critical

**Rationale:** All token generation and verification flows depend on this module.

**Documentation Topics:**

- JWT token structure (access vs refresh tokens)
- Token signing functions: `signAccessToken()`, `signRefreshToken()`
- Token verification: `verifyAccessToken()`, `verifyRefreshToken()`
- Token expiration configuration (`ACCESS_EXP`, `REFRESH_EXP`)
- Environment variables required: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `parseExpiryToMs()` utility for time conversion

---

### 1.4 Role Guard

**File:** `back/src/infrastructure/auth/role.guard.ts`

**Priority:** P0 - Critical

**Rationale:** Implements role-based access control (RBAC) for admin features.

**Documentation Topics:**

- Role-based authorization flow
- User types: `CUSTOMER`, `BUSINESS`, `ADMIN`
- Error responses (401 Unauthorized, 403 Forbidden)
- Integration with auth guard

---

### 1.5 Prisma Client Configuration

**File:** `back/src/infrastructure/db/prisma.client.ts`

**Priority:** P0 - Critical

**Rationale:** Single database connection instance used across all repositories.

**Documentation Topics:**

- Prisma client initialization
- PostgreSQL adapter configuration
- Connection string management
- Singleton pattern usage
- Environment variables: `DATABASE_URL`

---

## Tier 2: High-Traffic Business Logic

### 2.1 Authentication Module

**Directory:** `back/src/modules/auth/`

**Priority:** P1 - High

**Rationale:** Contains all authentication flows - signup, login, logout, token refresh. This is the entry point for all users.

#### 2.1.1 Auth Routes

**File:** `back/src/modules/auth/auth.route.ts`

**Documentation Topics:**

- Endpoint definitions with request/response schemas
- Route: `POST /auth/request-otp` - OTP generation
- Route: `POST /auth/signup` - User registration
- Route: `POST /auth/login` - User authentication
- Route: `POST /auth/refresh` - Token refresh
- Route: `POST /auth/logout` - Session termination
- Route: `GET /auth/me` - Current user info
- Body validation with Elysia `t` schema

#### 2.1.2 Auth Controller

**File:** `back/src/modules/auth/auth.controller.ts`

**Documentation Topics:**

- Request handling for each endpoint
- Input validation and sanitization
- Response formatting
- Cookie management for refresh tokens
- Error handling patterns

#### 2.1.3 Auth Service

**File:** `back/src/modules/auth/auth.service.ts`

**Documentation Topics:**

- Business logic for OTP generation (`generateAndStoreOTP()`)
- OTP validation and consumption (`validateOtpAndConsume()`)
- User signup flow (`signupWithPasswordOtp()`)
- User login flow (`loginWithPasswordOtp()`)
- Token refresh logic (`refreshAccessToken()`)
- Token revocation (`revokeRefreshToken()`, `revokeAccessToken()`)
- Token rotation strategy
- Environment variables: `OTP_LENGTH`, `OTP_EXPIRE_IN`, `REFRESH_TOKEN_EXPIRE_IN`

#### 2.1.4 Auth Repository

**File:** `back/src/modules/auth/auth.repository.ts`

**Documentation Topics:**

- User CRUD operations
- OTP storage and retrieval
- Refresh token management
- Revoked token tracking
- Database query optimization

---

### 2.2 Wallet Module

**Directory:** `back/src/modules/wallet/`

**Priority:** P1 - High

**Rationale:** Core digital wallet functionality - balance management, wallet creation, retrieval.

#### 2.2.1 Wallet Routes

**File:** `back/src/modules/wallet/wallet.route.ts`

**Documentation Topics:**

- Endpoint definitions
- Route: `POST /wallet` - Create wallet
- Route: `GET /wallet` - List user wallets
- Route: `GET /wallet/:id` - Get wallet by ID
- Route: `GET /wallet/public/:publicId` - Get wallet by public ID

#### 2.2.2 Wallet Controller

**File:** `back/src/modules/wallet/wallet.controller.ts`

**Documentation Topics:**

- Request handling
- Input validation
- Error handling

#### 2.2.3 Wallet Service

**File:** `back/src/modules/wallet/wallet.service.ts`

**Documentation Topics:**

- Wallet creation (`createWalletForUser()`)
- Wallet retrieval (`getWallet()`, `getWalletByPublicId()`, `getUserWallets()`)
- Wallet funding (`fundWallet()`)
- Wallet withdrawal (`withdrawFromWallet()`)
- Balance retrieval (`getWalletBalance()`)
- Business rules validation

#### 2.2.4 Wallet Repository

**File:** `back/src/modules/wallet/wallet.repository.ts`

**Documentation Topics:**

- Wallet CRUD operations
- Balance updates using atomic increments
- User-wallet relationship queries

---

### 2.3 Transaction Module

**Directory:** `back/src/modules/transaction/`

**Priority:** P1 - High

**Rationale:** Core financial transaction logic - transfers, deposits, withdrawals, ledger management.

#### 2.3.1 Transaction Routes

**File:** `back/src/modules/transaction/transaction.route.ts`

**Documentation Topics:**

- Endpoint definitions
- Route: `POST /transaction/transfer` - P2P transfer
- Route: `POST /wallet/:id/withdraw` - Withdrawal
- Route: `POST /wallet/:id/deposit` - Deposit
- Route: `GET /transaction/:id` - Get transaction
- Route: `GET /transaction/public/:publicId` - Get by public ID
- Route: `GET /transactions/wallet/:id` - Transaction history
- Route: `GET /ledger/wallet/:id` - Ledger entries

#### 2.3.2 Transaction Controller

**File:** `back/src/modules/transaction/transaction.controller.ts`

**Documentation Topics:**

- Request handling for each transaction type
- Input validation
- Error responses

#### 2.3.3 Transaction Service

**File:** `back/src/modules/transaction/transaction.service.ts`

**Documentation Topics:**

- P2P transfer logic (`transferFunds()`) - Uses Prisma transactions for atomicity
- Withdrawal logic (`withdrawFunds()`)
- Deposit logic (`depositFunds()`)
- Wallet ownership verification (`verifyWalletOwnership()`)
- Transaction status management
- Ledger entry creation
- Database transaction patterns

#### 2.3.4 Transaction Repository

**File:** `back/src/modules/transaction/transaction.repository.ts`

**Documentation Topics:**

- Transaction CRUD
- Transaction lookup by wallet ID
- Ledger entry management
- Query optimization with relations

---

## Tier 3: Utility \& Helper Modules

### 3.1 Error Handling

**File:** `back/src/shared/errors/http-errors.ts`

**Priority:** P2 - Medium

**Rationale:** Centralized error classes used throughout the application.

**Documentation Topics:**

- Custom error classes:
  - `ValidationError` - Input validation failures
  - `NotFoundError` - Resource not found
  - `ForbiddenError` - Access denied
  - `BadRequestError` - Invalid requests
  - `UnauthorizedError` - Authentication failures
- Error response helper (`createErrorResponse()`)
- Error serialization

---

### 3.2 Security Utilities

**File:** `back/src/shared/security/hash.ts`

**Priority:** P2 - Medium

**Rationale:** Password hashing is critical for security.

**Documentation Topics:**

- Password hashing with bcrypt (`hashPassword()`)
- Password verification (`comparePassword()`)
- Salt rounds configuration
- Security best practices

---

## Tier 4: Configuration \& Infrastructure

### 4.1 Server Configuration

**File:** `back/src/server.ts`

**Priority:** P3 - Low

**Rationale:** Main entry point that configures the Elysia framework.

**Documentation Topics:**

- Elysia app initialization
- CORS configuration
- Swagger/OpenAPI documentation setup
- Route registration
- Server listening port (4000)
- Environment variables: `NODE_ENV`

---

### 4.2 Prisma Configuration

**File:** `back/prisma.config.ts`

**Priority:** P3 - Low

**Rationale:** Prisma CLI configuration.

**Documentation Topics:**

- Generator settings
- Output paths
- Migration settings

---

### 4.3 Package Configuration

**File:** `back/package.json`

**Priority:** P3 - Low

**Documentation Topics:**

- Dependencies overview
- Scripts (dev, build, start)
- TypeScript configuration reference

---

### 4.4 TypeScript Configuration

**File:** `back/tsconfig.json`

**Priority:** P3 - Low

**Documentation Topics:**

- Compiler options
- Path aliases
- Module resolution

---

## Documentation Structure Template

For each documented component, use the following structure:

```markdown
# Component Name

## Overview

Brief description of what this component does and its role in the system.

## Location

File path or directory.

## Dependencies

List of other modules/files this component depends on.

## Key Functions/Classes

### Function/Class Name

- **Purpose**: What it does
- **Parameters**: Input parameters
- **Returns**: Return value
- **Errors**: Possible error cases

## Usage Examples

Code examples showing how to use the component.

## API Reference (for routes)

- **Endpoint**: HTTP method and path
- **Request Body**: Expected fields
- **Response**: Success/error responses
- **Authentication**: Required credentials

## Business Rules

Any business logic or validation rules enforced by this component.

## Security Considerations

Security implications and best practices.
```

---

## Recommended Documentation Order

1. **Start with Tier 1** (Database Schema and Auth Infrastructure)
   - This establishes the foundation for understanding all other components
2. **Move to Tier 2** (Business Logic Modules)
   - Document Auth Module first (entry point)
   - Then Wallet Module (core functionality)
   - Finally Transaction Module (most complex business logic)
3. **Continue with Tier 3** (Utilities)
   - Error handling (used everywhere)
   - Security utilities
4. **Finish with Tier 4** (Configuration)
   - Server setup last (wraps everything together)

---

## File Inventory Summary

| Tier | Files                                                                          | Priority |
| ---- | ------------------------------------------------------------------------------ | -------- |
| 1    | schema.prisma, auth.guard.ts, jwt.provider.ts, role.guard.ts, prisma.client.ts | P0       |
| 2    | auth/_, wallet/_, transaction/\*                                               | P1       |
| 3    | http-errors.ts, hash.ts                                                        | P2       |
| 4    | server.ts, prisma.config.ts, package.json, tsconfig.json                       | P3       |
