# Login & Signup Pages Documentation - Madar Digital Wallet

## Overview

This document describes the complete implementation of the Login and Signup pages in the Madar Digital Wallet application. Both pages share similar functionality including phone-based OTP authentication, password verification, and multi-stage forms.

**Language Support**: Persian/Farsi with full RTL (Right-to-Left) support

**Key Features**:

- Two-stage authentication (Phone + OTP)
- Password-based login/signup
- OTP countdown and resend functionality
- JWT-based session management with refresh tokens
- Auto wallet creation on signup

---

## 1. Architecture Overview

### 1.1 Page Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                     Authentication Flow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐     OTP Request     ┌──────────────┐            │
│   │ Login/  │ ──────────────────► │  Backend API │            │
│   │ Signup  │                     │  /auth/*     │            │
│   │  Page   │ ◄────────────────── │              │           {
```
