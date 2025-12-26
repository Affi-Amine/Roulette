# Pizza Roulette - Comprehensive Repository Analysis

**Analysis Date:** 2025-12-26
**Project Type:** Full-Stack Web Application - Gamification Platform
**Status:** Beta Version (Active Development)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Component Structure](#component-structure)
7. [Security Features](#security-features)
8. [User Flows](#user-flows)
9. [Admin & Staff Interfaces](#admin--staff-interfaces)
10. [Key Implementation Details](#key-implementation-details)
11. [Configuration](#configuration)
12. [Development Notes](#development-notes)

---

## Project Overview

**Pizza Roulette** is a promotional prize-spinning game for a pizza restaurant. Customers scan QR codes from their pizza receipts to win various rewards. The platform includes:

- Customer-facing prize wheel game
- Admin dashboard for prize management and analytics
- Staff interface for prize validation
- QR code verification system with HMAC security
- Public session mode (1 free spin per day without QR code)

**Target Platform:** Mobile-first responsive web application
**Language:** French (UI localized)
**Deployment:** Vercel (serverless architecture)

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16.1.0 (App Router)
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.1.9
- **Animations:** Framer Motion 12.23.24
- **Components:** Radix UI (accessible primitives)

### Backend
- **Runtime:** Node.js (Next.js API Routes)
- **Database:** Supabase 2.45.1 (PostgreSQL)
- **Authentication:** Supabase Auth
- **Cryptography:** Node.js crypto module (HMAC-SHA256)

### Key Libraries
- `jsqr` - QR code scanning via camera
- `qrcode` - QR code generation
- `zod` - Schema validation
- `react-hook-form` + `@hookform/resolvers` - Form management
- `recharts` - Data visualization
- `date-fns` - Date formatting
- `sonner` - Toast notifications

### Development Tools
- ESLint
- TypeScript
- Vercel Analytics

---

## Architecture

### Folder Structure

```
/roulette
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Homepage (renders PizzaRouletteApp)
│   ├── layout.tsx                    # Root layout with metadata
│   ├── globals.css                   # Global styles + Tailwind
│   │
│   ├── admin/                        # Admin dashboard (auth-protected)
│   │   ├── page.tsx                  # Dashboard home with stats
│   │   ├── login/page.tsx            # Admin authentication
│   │   ├── prizes/page.tsx           # Prize catalog management
│   │   ├── users/page.tsx            # User management
│   │   ├── spins/page.tsx            # Spin history logs
│   │   ├── wins/page.tsx             # Prize validation tracking
│   │   └── qr/page.tsx               # QR generator (dev tool)
│   │
│   ├── staff/                        # Staff interface
│   │   └── page.tsx                  # Customer search + prize validation
│   │
│   └── api/                          # API Routes (serverless functions)
│       ├── verify-ticket/route.ts    # HMAC validation + anti-rescan
│       ├── spin/route.ts             # Execute spin, return prize
│       ├── claim-prizes/route.ts     # Save user + link prizes
│       ├── public-session/route.ts   # Daily free spin (no QR)
│       │
│       ├── admin/                    # Admin APIs (auth-protected)
│       │   ├── stats/route.ts        # Dashboard analytics
│       │   ├── users/route.ts        # User data retrieval
│       │   ├── spins/route.ts        # Spin logs
│       │   ├── prizes/route.ts       # CRUD for prizes
│       │   ├── prizes/[id]/route.ts  # Update/delete prize
│       │   ├── wins/route.ts         # Prize history
│       │   └── dev/                  # Development tools
│       │       ├── qr/route.ts       # Generate test QR codes
│       │       └── generate-ticket/route.ts
│       │
│       └── staff/                    # Staff APIs
│           ├── search/route.ts       # Search users by name/email
│           └── validate-prize/route.ts  # Mark prize as validated
│
├── components/                       # React components
│   ├── pizza-roulette-app.tsx        # Main app state machine
│   ├── landing-page.tsx              # Entry point with instructions
│   ├── qr-scanner.tsx                # Camera-based QR scanner
│   ├── prize-wheel.tsx               # Animated roulette wheel
│   ├── prize-results.tsx             # Prize display + claim form
│   ├── success-confirmation.tsx      # Final confirmation screen
│   ├── error-states.tsx              # Error handling components
│   └── ui/                           # Radix UI wrapper components
│       └── button.tsx
│
├── lib/                              # Utility modules
│   ├── database.types.ts             # TypeScript types for Supabase
│   ├── supabase.ts                   # Server-side Supabase client
│   ├── supabase-browser.ts           # Browser Supabase client
│   ├── supabase-client.ts            # Client factory
│   ├── validation.ts                 # Zod schemas for API validation
│   ├── rate-limit.ts                 # In-memory rate limiting
│   └── utils.ts                      # Helper functions
│
├── middleware.ts                     # Auth middleware for admin/staff
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
├── prompt.md                         # Complete project specification (918 lines)
├── implementation_checklist.md       # Progress tracker (342 lines)
└── public/                           # Static assets (SVGs)
```

### Architectural Patterns

1. **Server-Side Rendering (SSR):** Next.js App Router with React Server Components
2. **API Route Handlers:** RESTful endpoints in `/app/api/`
3. **Middleware Protection:** Auth guards for `/admin` and `/api/admin` routes
4. **Database-as-a-Service:** Supabase PostgreSQL with typed client
5. **Serverless Functions:** All API routes deployed as edge functions
6. **State Machine Pattern:** Client-side state management in main app component

---

## Database Schema

### Tables

#### 1. `tickets`
Tracks scanned tickets and prevents reuse.

```typescript
{
  id: string (UUID, primary key)
  ticket_id: string (unique, indexed)
  nb_pizzas_classiques: number
  nb_pizzas_premium: number
  spins_simple_remaining: number
  spins_premium_remaining: number
  is_used: boolean (default: false)
  created_at: timestamp
}
```

#### 2. `users`
Customer information for prize claims.

```typescript
{
  id: string (UUID, primary key)
  name: string
  email: string
  created_at: timestamp
}
```

#### 3. `prizes`
Prize catalog with weights for randomization.

```typescript
{
  id: string (UUID, primary key)
  name: string
  emoji: string
  color: string
  weight_simple: number (probability for simple spins)
  weight_premium: number (probability for premium spins)
  active: boolean (default: true)
  created_at: timestamp
}
```

#### 4. `spins`
Individual spin records for analytics.

```typescript
{
  id: string (UUID, primary key)
  ticket_id: string (references tickets.ticket_id)
  prize_id: string (references prizes.id)
  spin_type: "simple" | "premium"
  created_at: timestamp
}
```

#### 5. `user_prizes`
Links users to won prizes, tracks validation.

```typescript
{
  id: string (UUID, primary key)
  user_id: string (references users.id)
  prize_id: string (references prizes.id)
  ticket_id: string (references tickets.ticket_id)
  is_validated: boolean (default: false)
  validated_at: timestamp (nullable)
  validated_by: string (nullable, staff user ID)
  created_at: timestamp
}
```

### Database Functions

#### `select_random_prize(spin_type TEXT)`
PostgreSQL RPC function that selects a prize using weighted randomization.

**Algorithm:**
1. Filters active prizes
2. Uses appropriate weight column (weight_simple or weight_premium)
3. Calculates cumulative weights
4. Generates random number
5. Returns matching prize

---

## API Endpoints

### Public Endpoints

#### POST `/api/verify-ticket`
Verifies ticket QR code and initializes session.

**Request:**
```json
{
  "ticket_id": "string",
  "nb_pizzas_classiques": "number",
  "nb_pizzas_premium": "number",
  "signature": "string (64-char hex)"
}
```

**Response:**
```json
{
  "success": true,
  "ticketId": "string",
  "spinsSimple": number,
  "spinsPremium": number,
  "message": "Ticket vérifié !"
}
```

**Security:**
- HMAC-SHA256 signature verification
- Timing-safe comparison
- Anti-rescan protection
- Rate limit: 10 requests/min per IP

#### POST `/api/spin`
Executes a spin and returns won prize.

**Request:**
```json
{
  "ticketId": "string",
  "spinType": "simple" | "premium"
}
```

**Response:**
```json
{
  "success": true,
  "prize": {
    "id": "string",
    "name": "string",
    "emoji": "string",
    "color": "string"
  },
  "remainingSpins": {
    "simple": number,
    "premium": number
  }
}
```

**Logic:**
- Verifies ticket has remaining spins
- Calls `select_random_prize()` RPC
- Decrements spin count
- Records spin in database
- Rate limit: 20 requests/min per IP

#### POST `/api/claim-prizes`
Saves user info and links prizes to user.

**Request:**
```json
{
  "ticketId": "string",
  "name": "string",
  "email": "string",
  "prizeIds": ["string", "string", ...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lots réclamés avec succès !"
}
```

**Logic:**
- Creates or retrieves user record
- Links prizes to user in `user_prizes` table
- No rate limit (single-use operation)

#### POST `/api/public-session`
Creates a free daily session without QR code.

**Request:** None (uses IP-based tracking)

**Response:**
```json
{
  "success": true,
  "ticketId": "string",
  "spinsSimple": 1,
  "spinsPremium": 0
}
```

**Logic:**
- Generates temporary ticket with ID "public_{timestamp}"
- 1 simple spin only
- Client-side localStorage enforcement (1/day)
- Rate limit: 10 requests/min per IP

### Admin Endpoints (Auth Required)

All admin endpoints require Supabase authentication. Protected by middleware.

#### GET `/api/admin/stats`
Dashboard analytics.

**Response:**
```json
{
  "ticketsScanned": number,
  "prizesDistributed": number,
  "totalUsers": number
}
```

#### GET `/api/admin/users`
List all users with ticket/prize counts.

**Response:**
```json
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "created_at": "timestamp",
      "ticket_count": number,
      "prize_count": number
    }
  ]
}
```

#### GET `/api/admin/spins`
Spin history with prize details.

**Response:**
```json
{
  "spins": [
    {
      "id": "string",
      "ticket_id": "string",
      "spin_type": "simple" | "premium",
      "created_at": "timestamp",
      "prize": { "name": "string", "emoji": "string" }
    }
  ]
}
```

#### GET `/api/admin/prizes`
List all prizes.

#### POST `/api/admin/prizes`
Create new prize.

#### PUT `/api/admin/prizes/[id]`
Update prize.

#### DELETE `/api/admin/prizes/[id]`
Delete prize.

#### GET `/api/admin/wins`
Prize validation history.

#### POST `/api/admin/dev/qr`
Generate test QR codes with HMAC signatures (development only).

### Staff Endpoints (Auth Required)

#### POST `/api/staff/search`
Search users by name or email.

**Request:**
```json
{
  "query": "string"
}
```

**Response:**
```json
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "prizes": [...]
    }
  ]
}
```

#### POST `/api/staff/validate-prize`
Mark prize as validated (redeemed).

**Request:**
```json
{
  "prizeId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prix validé avec succès"
}
```

---

## Component Structure

### Main Application Component

**`pizza-roulette-app.tsx`** - State machine orchestrating entire user flow.

**States:**
- `landing` - Entry screen
- `verifying` - Loading state during ticket verification
- `wheel` - Active prize wheel
- `results` - Won prize display + claim form
- `success` - Final confirmation
- `error-already-used` - Ticket already scanned
- `error-invalid-qr` - Invalid signature
- `error-no-spins` - No spins remaining

**Key Functions:**
- `handleStart()` - Initiates public session
- `handleTicketScanned()` - Processes QR code data
- `handleSpin()` - Executes spin API call
- `handleClaimPrizes()` - Submits user info

### UI Components

#### `landing-page.tsx`
Entry point with game instructions and start button.

#### `qr-scanner.tsx`
Camera-based QR scanner with manual entry fallback.

**Features:**
- Real-time video processing with jsQR
- Animated scanning overlay
- Device camera selection
- Error handling for camera permissions

#### `prize-wheel.tsx`
SVG-based animated roulette wheel.

**Features:**
- 8 segments with dynamic colors
- Spin animation (Framer Motion)
- Remaining spins counter
- Support for simple/premium spins

#### `prize-results.tsx`
Shows won prize and collects user information.

**Features:**
- Prize display with emoji and color
- Form validation (name + email)
- Continue spinning or finish options

#### `success-confirmation.tsx`
Final screen showing claimed prizes.

#### `error-states.tsx`
Multiple error components for different failure modes.

---

## Security Features

### 1. HMAC Signature Verification

**Algorithm:** HMAC-SHA256

**Message Format:**
```
{ticket_id}|{nb_pizzas_classiques}|{nb_pizzas_premium}
```

**Implementation:**
```typescript
const message = `${ticket_id}|${nb_pizzas_classiques}|${nb_pizzas_premium}`
const expectedSig = createHmac('sha256', HMAC_SECRET)
  .update(message)
  .digest('hex')

// Timing-safe comparison
if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
  return error
}
```

**Protection Against:**
- Fraudulent ticket creation
- Man-in-the-middle attacks
- Replay attacks (combined with anti-rescan)

### 2. Anti-Rescan Protection

Each `ticket_id` can only be used once. System checks `is_used` flag before allowing spins.

### 3. Rate Limiting

**Token bucket algorithm** with in-memory storage.

**Limits:**
- `/api/verify-ticket`: 10 requests/min per IP
- `/api/spin`: 20 requests/min per IP
- `/api/public-session`: 10 requests/min per IP

**Implementation:** `/lib/rate-limit.ts`

### 4. Input Validation

**Zod schemas** validate all API inputs:
- `VerifyTicketSchema` - Ticket verification
- `SpinSchema` - Spin requests
- `ClaimPrizesSchema` - User submission

### 5. Authentication

**Supabase Auth** with email/password:
- Admin routes protected by middleware
- Session-based access control
- Automatic token refresh

**Protected Routes:**
- `/admin/*`
- `/staff/*`
- `/api/admin/*`
- `/api/staff/*`

### 6. Environment Variable Protection

Sensitive keys stored in environment variables:
- `HMAC_SECRET` - Signature generation
- `SUPABASE_SERVICE_KEY` - Database admin access
- Not exposed to client (server-side only)

---

## User Flows

### Customer Journey

```
Landing Page
    ↓
[Click "Commencer"]
    ↓
Public Session Created (1 free spin)
    ↓
Prize Wheel Display
    ↓
[Click spin button]
    ↓
Spinning Animation
    ↓
Prize Results Screen
    ↓
Enter Name + Email
    ↓
[Submit]
    ↓
Success Confirmation
    ↓
Return to Landing
```

### Alternative Flow (QR Code - Original Design)

```
Landing Page
    ↓
QR Scanner
    ↓
Scan Receipt QR Code
    ↓
HMAC Verification
    ↓
Prize Wheel (multiple spins based on pizzas)
    ↓
Spin 1 → Prize 1
    ↓
[Continue Spinning or Claim]
    ↓
Spin 2 → Prize 2
    ↓
...
    ↓
Claim All Prizes (single form)
    ↓
Success Confirmation
```

### Error Flows

**Already Used Ticket:**
```
QR Scanner → Verify → Error: Ticket already scanned → Return to Landing
```

**Invalid QR Code:**
```
QR Scanner → Verify → Error: Invalid signature → Return to Landing
```

**No Spins Remaining:**
```
Prize Wheel → Attempt Spin → Error: No spins left → Claim Prizes
```

---

## Admin & Staff Interfaces

### Admin Dashboard

**Route:** `/admin`

**Features:**
1. **Dashboard** (`/admin`)
   - Total tickets scanned
   - Total prizes distributed
   - Total registered users

2. **Prize Management** (`/admin/prizes`)
   - Add new prizes (name, emoji, color, weights)
   - Edit existing prizes
   - Delete prizes
   - Toggle active status
   - Set probability weights (simple vs premium)

3. **User Management** (`/admin/users`)
   - View all users
   - Search by name or email
   - See ticket and prize counts
   - View join dates

4. **Spin History** (`/admin/spins`)
   - All spins with timestamps
   - Prize details
   - Spin type (simple/premium)
   - Analytics and distribution

5. **Prize Validation** (`/admin/wins`)
   - All won prizes
   - Validation status
   - User details
   - Timestamp tracking

6. **QR Generator** (`/admin/qr`) - Development Tool
   - Generate test tickets
   - Specify pizza quantities
   - Auto-generates HMAC signature
   - QR code display

### Staff Interface

**Route:** `/staff`

**Features:**
1. **Customer Search**
   - Search by name or email
   - View customer profile
   - List won prizes

2. **Prize Validation**
   - Mark prizes as "validated"
   - Records staff ID and timestamp
   - Prevents duplicate validation

---

## Key Implementation Details

### 1. Weighted Random Prize Selection

**Location:** `/app/api/spin/route.ts`

**Database Function:** `select_random_prize(spin_type TEXT)`

**Algorithm:**
```sql
WITH weighted_prizes AS (
  SELECT
    id,
    name,
    emoji,
    color,
    CASE
      WHEN spin_type = 'simple' THEN weight_simple
      ELSE weight_premium
    END as weight,
    SUM(weight) OVER (ORDER BY id) as cumulative_weight
  FROM prizes
  WHERE active = true
)
SELECT id, name, emoji, color
FROM weighted_prizes
WHERE cumulative_weight >= random() * (SELECT MAX(cumulative_weight) FROM weighted_prizes)
LIMIT 1
```

**Ensures:** Fair but configurable probability distribution.

### 2. Public Session System

**Location:** `/app/api/public-session/route.ts`

**Purpose:** Allow free daily spins without QR code.

**Implementation:**
- Creates ticket with ID: `public_{timestamp}`
- Grants 1 simple spin, 0 premium spins
- Client-side localStorage tracks last spin date
- Server-side rate limiting prevents abuse

**Client-Side Enforcement:**
```typescript
const lastSpin = localStorage.getItem('lastPublicSpin')
const today = new Date().toDateString()
if (lastSpin === today) {
  // Block spin
}
```

### 3. State Machine Pattern

**Location:** `/components/pizza-roulette-app.tsx`

**State Type:**
```typescript
type AppState =
  | "landing"
  | "verifying"
  | "wheel"
  | "results"
  | "success"
  | "error-already-used"
  | "error-invalid-qr"
  | "error-no-spins"
```

**Benefits:**
- Clear separation of UI states
- Predictable state transitions
- Easy error handling

### 4. HMAC Signature Generation

**Server-Side (Node.js):**
```typescript
import { createHmac } from 'crypto'

const message = `${ticket_id}|${nb_pizzas_classiques}|${nb_pizzas_premium}`
const signature = createHmac('sha256', HMAC_SECRET)
  .update(message)
  .digest('hex')
```

**Verification:**
```typescript
import { timingSafeEqual } from 'crypto'

const expectedSig = createHmac('sha256', HMAC_SECRET)
  .update(message)
  .digest('hex')

if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
  throw new Error('Invalid signature')
}
```

### 5. Rate Limiting Implementation

**Location:** `/lib/rate-limit.ts`

**Token Bucket Algorithm:**
```typescript
class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>()

  async checkLimit(identifier: string, limit: number, windowMs: number): Promise<boolean> {
    const now = Date.now()
    const record = this.requests.get(identifier)

    if (!record || now > record.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count >= limit) {
      return false
    }

    record.count++
    return true
  }
}
```

**Persisted via `globalThis` for serverless:**
```typescript
const globalForRateLimit = globalThis as unknown as {
  rateLimiter: RateLimiter | undefined
}

export const rateLimiter = globalForRateLimit.rateLimiter ?? new RateLimiter()
globalForRateLimit.rateLimiter = rateLimiter
```

### 6. Camera Scanner Implementation

**Location:** `/components/qr-scanner.tsx`

**Tech:** HTML5 Video API + jsQR library

**Process:**
1. Request camera permission
2. Create video stream
3. Draw video to canvas (60fps)
4. Process canvas with jsQR
5. Extract QR data and parse
6. Stop stream and return data

**Features:**
- Device selection (front/back camera)
- Real-time visual feedback
- Automatic focus on QR code
- Fallback to manual entry

---

## Configuration

### Environment Variables

**Required:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...  # Server-side only

# Security
HMAC_SECRET=your-secret-key-here  # Server-side only
```

**Location:** `.env.local` (not committed to git)

### Next.js Configuration

**Location:** `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  // Configuration here
}
```

### Tailwind Configuration

**Location:** `tailwind.config.ts`

**Custom Colors:**
- Primary Red: `#e63946`
- Teal Green: `#2a9d8f`
- Yellow: `#f9c80e`
- Background: `#fffcf5`

### TypeScript Configuration

**Location:** `tsconfig.json`

**Strict Mode:** Enabled for type safety

---

## Development Notes

### Recent Changes (Based on Git History)

1. **e129fec** - "chore: alters to french"
   - Complete French localization

2. **a02f2f6** - "adds admin and staff pages"
   - Admin dashboard implementation
   - Staff validation interface

3. **5ac89cd** - "chore: beta verion of deliverabl"
   - Beta release preparation

4. **68d8f76** - "Fix stuck verification state and add error logging"
   - Bug fix for state machine

5. **39e2ddf** - "adds verifying state and optimize scanner"
   - Scanner performance improvements

### Current Branch
- **main** (clean working tree)

### Deployment Status
- **Target:** Vercel
- **Status:** Beta version, active development

### Testing Scenarios

Documented in `implementation_checklist.md`:
- Ticket verification with valid/invalid signatures
- Anti-rescan protection
- Spin execution with different types
- Prize claiming flow
- Public session limits
- Admin CRUD operations
- Staff prize validation

### Known Limitations

1. **Public Session Enforcement:**
   - Client-side localStorage (can be cleared)
   - Consider server-side IP tracking for production

2. **Rate Limiting:**
   - In-memory storage (resets on server restart)
   - Consider Redis for production

3. **QR Scanner:**
   - Requires HTTPS for camera access
   - Browser compatibility (modern browsers only)

### Future Enhancements (Potential)

Based on codebase structure:
- Email notifications for prize wins
- SMS validation codes
- Multi-language support
- Advanced analytics dashboard
- Prize expiration dates
- Customer prize history
- Loyalty program integration

---

## Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- Supabase account and project
- Environment variables configured

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

### Database Setup
1. Create Supabase project
2. Run SQL from `prompt.md` to create tables
3. Create `select_random_prize` function
4. Set up environment variables

### Testing QR Codes
1. Navigate to `/admin/qr` (after authentication)
2. Generate test tickets
3. Scan with `/` route

---

## Contact & Documentation

**Main Documentation:**
- `prompt.md` - Complete specification (918 lines)
- `implementation_checklist.md` - Progress tracker (342 lines)

**Support:**
- Check documentation files for detailed implementation guides
- Review git history for recent changes

---

**End of Analysis**
