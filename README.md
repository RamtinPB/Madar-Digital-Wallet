# Madar Digital Wallet

> A full-stack digital wallet application with multi-wallet support, secure authentication, and real-time transaction management.

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#api-documentation">API Docs</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

**Last Updated:** February 16, 2026

---

## 📋 Executive Summary

Madar is a modern digital wallet application designed to provide secure, intuitive financial management for users. The system enables individuals to create and manage multiple wallets, perform peer-to-peer transfers, deposit and withdraw funds, and maintain a complete transaction history with real-time updates.

Built with a focus on security, the application implements robust authentication mechanisms including phone-based OTP verification and JWT token management. The frontend delivers a responsive, RTL-optimized user experience tailored for Persian-speaking users, while the backend provides a scalable, well-documented REST API.

This project serves as a comprehensive foundation for building financial applications, demonstrating best practices in payment system architecture, security implementation, and modern web development.

---

## 🎯 Background & Problem Statement

### The Challenge

Traditional financial systems often present significant barriers to entry:

- **Complex onboarding** requiring extensive documentation and physical verification
- **Limited wallet options** forcing users to consolidate all funds in a single account
- **Opaque transaction processes** with poor visibility into fund movements
- **Inaccessible interfaces** for non-English speaking populations
- **Fragmented developer experience** lacking comprehensive documentation and modern APIs

### Our Solution

Madar addresses these challenges through:

1. **Streamlined Digital Onboarding** — Phone-based authentication eliminates the need for extensive paperwork, enabling users to create wallets and begin transacting within minutes.

2. **Multi-Wallet Architecture** — Users can create multiple wallets for different purposes (personal, business, savings), maintaining clear separation of funds with unified balance overview.

3. **Transparent Ledger System** — Every transaction is recorded with complete audit trails, providing users and administrators full visibility into fund movements.

4. **Localized Experience** — Full RTL support with Persian (Farsi) interface ensures accessibility for Iranian users and demonstrates internationalization best practices.

5. **Developer-First API** — Comprehensive OpenAPI/Swagger documentation, clean endpoint design, and well-structured responses enable seamless integration.

---

## ✨ Features

### Authentication & Security

| Feature                       | Description                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| **Phone-based OTP Login**     | Secure authentication using time-limited one-time passwords sent to registered phone numbers |
| **JWT Token Management**      | Access and refresh token rotation with automatic token revocation                            |
| **Role-based Access Control** | Distinction between Customer, Business, and Admin user types                                 |
| **Transaction Verification**  | OTP verification required for high-value transactions                                        |

### Wallet Management

| Feature                          | Description                                               |
| -------------------------------- | --------------------------------------------------------- |
| **Multi-Wallet Support**         | Create and manage multiple wallets under a single account |
| **Real-time Balance**            | Instant balance updates following any transaction         |
| **Wallet Public IDs**            | Shareable unique identifiers for receiving transfers      |
| **Complete Transaction History** | Full audit trail for each wallet                          |

### Transaction Processing

| Feature                         | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| **P2P Transfers**               | Send funds directly to other users by phone number or wallet ID      |
| **Deposits**                    | Add funds to wallets through various channels                        |
| **Withdrawals**                 | Transfer funds from wallet to external accounts                      |
| **Purchase Support**            | Business transaction capabilities with refund handling               |
| **Transaction Status Tracking** | Real-time status updates (Pending → OTP Verified → Completed/Failed) |

### Dashboard & UI

| Feature                    | Description                                        |
| -------------------------- | -------------------------------------------------- |
| **Total Balance Overview** | Aggregate view of all wallet balances              |
| **Wallet Selector**        | Quick switching between multiple wallets           |
| **Recent Transactions**    | Paginated transaction list with filtering          |
| **Quick Actions**          | Fast access to deposit, withdraw, and transfer     |
| **Responsive Design**      | Mobile-first approach with adaptive layouts        |
| **RTL Support**            | Full right-to-left layout for Persian localization |

### Business Features

| Feature                 | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| **Product Management**  | Display and manage business products/services        |
| **Purchase Processing** | Handle customer purchases with transaction tracking  |
| **Receipt Generation**  | Generate and display transaction receipts            |
| **Refund Support**      | Handle transaction refunds for business transactions |

### Transaction Management

| Feature                      | Description                                                     |
| ---------------------------- | --------------------------------------------------------------- |
| **Advanced Filtering**       | Filter transactions by status, type, and date range             |
| **Transaction Search**       | Search transactions by description or public ID                 |
| **Pagination**               | Efficient pagination for large transaction histories            |
| **Real-time Status Updates** | Live status updates (Pending → OTP Verified → Completed/Failed) |
| **Transaction Receipts**     | Detailed receipt generation with full transaction metadata      |

### Developer Experience

| Feature                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| **OpenAPI/Swagger Docs** | Interactive API documentation at `/swagger`        |
| **TypeScript Support**   | Full type safety across frontend and backend       |
| **Modular Architecture** | Clean separation of concerns with reusable modules |
| **Database Migrations**  | Version-controlled schema with Prisma              |

---

## 🛠 Tech Stack

### Backend

| Technology                               | Purpose                           |
| ---------------------------------------- | --------------------------------- |
| [Elysia](https://elysiajs.com)           | High-performance web framework    |
| [Prisma](https://prisma.io)              | Type-safe ORM with PostgreSQL     |
| [PostgreSQL](https://www.postgresql.org) | Relational database               |
| [JWT](https://jwt.io)                    | Secure token-based authentication |
| [Zod](https://zod.dev)                   | Schema validation                 |
| [Bun](https://bun.sh)                    | JavaScript runtime                |

### Frontend

| Technology                                   | Purpose                        |
| -------------------------------------------- | ------------------------------ |
| [Next.js](https://nextjs.org)                | React framework with SSR/SSG   |
| [TypeScript](https://www.typescriptlang.org) | Type-safe JavaScript           |
| [Tailwind CSS](https://tailwindcss.com)      | Utility-first CSS framework    |
| [shadcn/ui](https://ui.shadcn.com)           | Reusable UI component library  |
| [Zustand](https://zustand-demo.pmnd.rs)      | Lightweight state management   |
| [Radix UI](https://www.radix-ui.com)         | Unstyled accessible components |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

| Requirement    | Version | Notes                                        |
| -------------- | ------- | -------------------------------------------- |
| **Node.js**    | ≥18.0.0 | Required for frontend                        |
| **Bun**        | ≥1.0.0  | Recommended for backend; npm/yarn acceptable |
| **PostgreSQL** | ≥14.0   | Database for persistence                     |
| **Git**        | Latest  | Version control                              |

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/[your-org]/madar-wallet.git
   cd madar-wallet
   ```

2. **Configure database**

   Create a PostgreSQL database and note your connection string:

   ```bash
   # Example connection string format
   postgresql://username:password@localhost:5432/madar_wallet
   ```

3. **Set up environment variables**

   Create a `.env` file in the `back/` directory:

   ```bash
   # back/.env
   DATABASE_URL="postgresql://username:password@localhost:5432/madar_wallet"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRES_IN="1h"
   JWT_REFRESH_EXPIRES_IN="7d"
   ```

### Installation

#### Backend Setup

```bash
# Navigate to backend directory
cd back

# Install dependencies
bun install

# Generate Prisma client
bunx prisma generate

# Run database migrations
bunx prisma migrate dev

# Start development server
bun run dev
```

The backend server will start at `http://localhost:4000`.

#### Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd front

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

The frontend will be available at `http://localhost:3000`.

---

## 📁 Project Structure

```
madar-wallet/
├── back/                          # Backend application
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Database migrations
│   ├── src/
│   │   ├── infrastructure/       # Infrastructure layer
│   │   │   ├── auth/             # Auth guards & JWT provider
│   │   │   └── db/               # Database client
│   │   ├── modules/              # Feature modules
│   │   │   ├── auth/             # Authentication module
│   │   │   ├── transaction/      # Transaction module
│   │   │   └── wallet/           # Wallet module
│   │   ├── shared/               # Shared utilities
│   │   │   ├── errors/           # HTTP error handling
│   │   │   └── security/         # Security utilities
│   │   └── server.ts             # Application entry point
│   ├── package.json
│   └── tsconfig.json
│
├── front/                         # Frontend application
│   ├── pages/                    # Next.js pages
│   │   ├── _app.tsx             # App wrapper
│   │   ├── index.tsx            # Dashboard page
│   │   ├── login.tsx            # Login page
│   │   ├── signup.tsx           # Signup page
│   │   ├── wallets.tsx          # Wallets management page
│   │   ├── transactions.tsx      # Transaction history page
│   │   └── business.tsx         # Business products page
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   │   ├── QuickActions.tsx
│   │   │   │   ├── RecentTransactions.tsx
│   │   │   │   ├── TotalBalanceCard.tsx
│   │   │   │   ├── TransactionItem.tsx
│   │   │   │   └── WalletSelector.tsx
│   │   │   ├── login/           # Login components
│   │   │   │   ├── LoginHeader.tsx
│   │   │   │   ├── LoginFooterOTP.tsx
│   │   │   │   ├── StagePhone.tsx
│   │   │   │   └── StageOTP.tsx
│   │   │   ├── transactions/    # Transaction components
│   │   │   │   ├── TransactionFilters.tsx
│   │   │   │   ├── TransactionSearch.tsx
│   │   │   │   ├── TransactionTable.tsx
│   │   │   │   ├── TransactionRow.tsx
│   │   │   │   ├── TransactionPagination.tsx
│   │   │   │   └── ActiveFilters.tsx
│   │   │   ├── wallets/         # Wallet components
│   │   │   │   ├── WalletCard.tsx
│   │   │   │   ├── WalletGrid.tsx
│   │   │   │   └── WalletEmpty.tsx
│   │   │   ├── shared/          # Shared components
│   │   │   │   ├── WalletSelector.tsx
│   │   │   │   └── modals/
│   │   │   │       ├── DepositModal.tsx
│   │   │   │       ├── WithdrawModal.tsx
│   │   │   │       ├── TransferModal.tsx
│   │   │   │       ├── PurchaseModal.tsx
│   │   │   │       └── ReceiptModal.tsx
│   │   │   ├── business/        # Business components
│   │   │   │   └── ProductCard.tsx
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── config/              # App configuration
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/
│   │   │   ├── api/             # API client functions
│   │   │   ├── auth/            # Auth utilities
│   │   │   ├── date.ts          # Date utilities
│   │   │   └── utils.ts         # General utilities
│   │   ├── stores/              # Zustand stores
│   │   └── types/               # TypeScript definitions
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                          # Project documentation
│   ├── back/
│   │   └── backend-documentation-plan.md
│   └── front/
│       ├── authentication.md
│       ├── dashboard.md
│       └── frontend-documentation-plan.md
│
└── README.md                     # This file
```

---

## 📖 Usage Documentation

### Authentication Flow

#### Phone Login

1. User enters phone number on login page
2. System sends OTP to registered phone number
3. User enters OTP to verify identity
4. On successful verification, JWT tokens are issued
5. User is redirected to dashboard

#### Registration

1. User enters phone number and password
2. System creates new user account
3. OTP is sent for initial verification
4. Upon verification, user can create wallets and begin transacting

### Creating a Wallet

After authentication, users can create wallets:

```typescript
// API: POST /wallet
const response = await fetch("http://localhost:4000/wallet", {
	method: "POST",
	headers: {
		Authorization: "Bearer <access_token>",
		"Content-Type": "application/json",
	},
	body: JSON.stringify({}),
});

const { wallet } = await response.json();
// wallet: { id: 1, publicId: "cuidxxx", balance: "0.00" }
```

### Performing a Transfer

```typescript
// API: POST /transactions/transfer
const response = await fetch("http://localhost:4000/transactions/transfer", {
	method: "POST",
	headers: {
		Authorization: "Bearer <access_token>",
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		fromWalletId: 1,
		toWalletPublicId: "cuid_receiver_wallet",
		amount: 500000, // Amount in Tomans
	}),
});

const { transaction } = await response.json();
```

### Viewing Transaction History

```typescript
// API: GET /transactions/wallet/:walletId
const response = await fetch(
	"http://localhost:4000/transactions/wallet/1?limit=10",
	{
		headers: {
			Authorization: "Bearer <access_token>",
		},
	},
);

const { transactions } = await response.json();
// Returns array of transactions with status, type, amount, etc.
```

---

## 🔧 Configuration Options

### Backend Environment Variables

| Variable                 | Required | Description                  | Default       |
| ------------------------ | -------- | ---------------------------- | ------------- |
| `DATABASE_URL`           | Yes      | PostgreSQL connection string | -             |
| `JWT_SECRET`             | Yes      | Secret key for JWT signing   | -             |
| `JWT_EXPIRES_IN`         | No       | Access token expiration      | `1h`          |
| `JWT_REFRESH_EXPIRES_IN` | No       | Refresh token expiration     | `7d`          |
| `NODE_ENV`               | No       | Environment mode             | `development` |

### Frontend Configuration

The frontend connects to the backend at `http://localhost:4000`. To change this:

1. Update the API base URL in `front/src/lib/api/fetcher.ts`
2. Update CORS origins in `back/src/server.ts`

### Database Schema Models

#### User

```prisma
model User {
  id           Int      @id @default(autoincrement())
  publicId     String   @unique @default(cuid())
  phoneNumber  String   @unique
  passwordHash String
  userType     UserType @default(CUSTOMER)
  wallets      Wallet[]
  // ... timestamps and relations
}
```

#### Wallet

```prisma
model Wallet {
  id        Int      @id @default(autoincrement())
  publicId  String   @unique @default(cuid())
  balance   Decimal  @db.Decimal(18, 2)
  userId    Int
  // ... timestamps and relations
}
```

#### Transaction

```prisma
model Transaction {
  id               Int               @id @default(autoincrement())
  publicId         String            @unique @default(cuid())
  status           TransactionStatus
  transactionType  TransactionType
  amount           Decimal           @db.Decimal(18, 2)
  payerWalletId    Int
  receiverWalletId Int?
  // ... timestamps and relations
}
```

---

## 📚 API Documentation

Once the backend is running, visit the interactive API documentation:

- **Swagger UI**: [http://localhost:4000/swagger](http://localhost:4000/swagger)
- **OpenAPI JSON**: [http://localhost:4000/swagger/json](http://localhost:4000/swagger/json)

### Core Endpoints

| Endpoint                   | Method | Description             |
| -------------------------- | ------ | ----------------------- |
| `/auth/login`              | POST   | Login with phone + OTP  |
| `/auth/signup`             | POST   | Register new user       |
| `/auth/refresh`            | POST   | Refresh access token    |
| `/auth/logout`             | POST   | Revoke tokens           |
| `/wallet`                  | GET    | Get user wallets        |
| `/wallet`                  | POST   | Create new wallet       |
| `/transactions/transfer`   | POST   | Transfer funds          |
| `/transactions/wallet/:id` | GET    | Get wallet transactions |

### Authentication

All protected endpoints require Bearer token authentication:

```bash
curl -H "Authorization: Bearer <access_token>" \
  http://localhost:4000/wallet
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier/ESLint)
- Write meaningful commit messages
- Add comments for complex logic

### Testing

Before submitting:

1. Run linting: `npm run lint` (frontend) / `bun run lint` (backend)
2. Ensure all migrations are up to date
3. Test the application locally

### Reporting Issues

Use GitHub Issues to report bugs or request features. Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Environment details

---

## 🙏 Credits & Acknowledgments

### Core Technologies

- [ElysiaJS](https://elysiajs.com) — Blazing fast web framework
- [Prisma](https://prisma.io) — Next-generation ORM
- [Next.js](https://nextjs.org) — React framework
- [shadcn/ui](https://ui.shadcn.com) — Beautiful components

### Design Inspiration

- [Radix UI](https://www.radix-ui.com) — Accessible primitives
- [Tailwind CSS](https://tailwindcss.com) — Styling utility

### Community

Thanks to all contributors who have helped shape this project.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Madar Wallet Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ⚠️ Important Notes

### Security Considerations

- **Never commit** sensitive credentials to version control
- Use environment variables for all secrets
- Implement rate limiting in production
- Enable HTTPS in production environments
- Regular security audits recommended

### Production Deployment

This application is currently in development. For production deployment:

1. Set secure environment variables
2. Configure production-grade database
3. Enable HTTPS/SSL
4. Set up monitoring and logging
5. Implement backup strategies
6. Configure CORS for production domains

---

<div align="center">

**Built with ❤️ by the Madar Team**

[↑ Back to Top](#madar-digital-wallet)

</div>
