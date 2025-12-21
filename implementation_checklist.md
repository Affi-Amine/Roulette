# 📋 Backend Implementation Checklist

Use this to track your progress building the Pizza Roulette backend.

---

## ⚙️ SETUP (Start Here)

### Supabase Project
- [ ] Create new Supabase project at supabase.com
- [ ] Copy project URL and anon key
- [ ] Copy service role key (Settings → API)
- [ ] Add to .env.local:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_KEY=eyJhbGc...
  HMAC_SECRET=your-secret-key-2025
  ```

### Database Schema
- [ ] Open Supabase SQL Editor
- [ ] Copy full schema from system prompt
- [ ] Run CREATE TABLE commands
- [ ] Run CREATE INDEX commands
- [ ] Run CREATE FUNCTION for select_random_prize
- [ ] Seed initial prizes
- [ ] Verify tables exist in Table Editor

### NPM Packages
- [ ] Install Supabase client:
  ```bash
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
  ```
- [ ] Verify no errors in package.json

---

## 🔌 PHASE 1: Core API Routes

### POST /api/verify-ticket
- [ ] Create file: `app/api/verify-ticket/route.ts`
- [ ] Import crypto and Supabase client
- [ ] Extract ticket data from request body
- [ ] Build HMAC message: `${ticket_id}|${classiques}|${premium}`
- [ ] Calculate expected signature using HMAC-SHA256
- [ ] Compare with provided signature
- [ ] Check if ticket_id already exists in database
- [ ] If exists → return 409 "already used"
- [ ] If valid → insert into tickets table
- [ ] Return success with spin counts
- [ ] **TEST:** Use Postman/Thunder Client to send POST request

**Test Data:**
```json
{
  "ticket_id": "TEST-001",
  "nb_pizzas_classiques": 2,
  "nb_pizzas_premium": 1,
  "sig": "[calculate using HMAC tool]"
}
```

### POST /api/spin
- [ ] Create file: `app/api/spin/route.ts`
- [ ] Extract ticket_id and spin_type from body
- [ ] Query ticket from database
- [ ] Check if spins remaining > 0
- [ ] Call select_random_prize(spin_type) DB function
- [ ] Get prize details
- [ ] Insert into spins table
- [ ] Decrement spin count in tickets table
- [ ] Return prize data
- [ ] **TEST:** Verify spin count decrements correctly

### POST /api/claim-prizes
- [ ] Create file: `app/api/claim-prizes/route.ts`
- [ ] Extract ticket_id, name, phone, spin_ids from body
- [ ] Check if user exists by phone
- [ ] If not → create new user
- [ ] Update ticket with user_id
- [ ] Insert records into user_prizes for each spin
- [ ] Return success with user_id
- [ ] **TEST:** Verify user created and prizes linked

---

## 👥 PHASE 2: Staff Routes

### GET /api/staff/search
- [ ] Create file: `app/api/staff/search/route.ts`
- [ ] Get query parameter from URL
- [ ] Search users by name OR phone (ilike for case-insensitive)
- [ ] Join with user_prizes and prizes tables
- [ ] Return user list with their prizes
- [ ] **TEST:** Search for existing user

### POST /api/staff/validate-prize
- [ ] Create file: `app/api/staff/validate-prize/route.ts`
- [ ] Extract prize_id from body
- [ ] Update user_prizes set status='validated'
- [ ] Set validated_at timestamp
- [ ] Return success
- [ ] **TEST:** Verify status changes in database

---

## 🔐 PHASE 3: Admin Authentication

### Supabase Auth Setup
- [ ] Go to Supabase → Authentication → Users
- [ ] Click "Add User" (Email Provider)
- [ ] Create admin user (e.g., admin@pizza.com)
- [ ] Set strong password
- [ ] Copy user UUID for reference

### Login Page
- [ ] Create file: `app/admin/login/page.tsx`
- [ ] Build login form (email + password)
- [ ] Use Supabase auth.signInWithPassword()
- [ ] On success → redirect to /admin
- [ ] On error → show error message
- [ ] **TEST:** Log in with admin credentials

### Middleware Protection
- [ ] Create file: `middleware.ts` at root
- [ ] Import Supabase middleware client
- [ ] Check session for /admin/* routes
- [ ] Redirect to /admin/login if no session
- [ ] **TEST:** Try accessing /admin without login

---

## 📊 PHASE 4: Admin Dashboard

### GET /api/admin/stats
- [ ] Create file: `app/api/admin/stats/route.ts`
- [ ] Count total tickets
- [ ] Count total prizes won
- [ ] Count total users
- [ ] Get prize distribution stats
- [ ] Return JSON with all stats
- [ ] **TEST:** Verify numbers match database

### Admin Dashboard Page
- [ ] Create file: `app/admin/page.tsx`
- [ ] Fetch stats from /api/admin/stats
- [ ] Display stat cards (total tickets, prizes, users)
- [ ] Add navigation to prizes, users, spins pages
- [ ] Show recent activity (last 10 spins)
- [ ] **TEST:** All stats display correctly

### Manage Prizes Page
- [ ] Create file: `app/admin/prizes/page.tsx`
- [ ] Fetch all prizes from database
- [ ] Display in table: name, emoji, weights, active status
- [ ] Add "New Prize" button → opens form modal
- [ ] Add "Edit" button per row → opens edit form
- [ ] Add "Delete" button with confirmation
- [ ] Form fields: name, emoji, color, weight_simple, weight_premium, active
- [ ] Create API routes: POST/PUT/DELETE /api/admin/prizes
- [ ] **TEST:** Add, edit, delete prizes

### Users Page
- [ ] Create file: `app/admin/users/page.tsx`
- [ ] Fetch all users with prize counts
- [ ] Display table: name, phone, created_at, prizes_won
- [ ] Add search filter
- [ ] Click user → expand to show prize history
- [ ] **TEST:** User list loads, search works

### Spins History Page
- [ ] Create file: `app/admin/spins/page.tsx`
- [ ] Fetch all spins with user and prize details
- [ ] Display table: timestamp, user, ticket, prize, type
- [ ] Add date range filter
- [ ] Add export to CSV button (optional)
- [ ] **TEST:** Spins display with correct data

---

## 🧪 TESTING PHASE

### End-to-End Flow
- [ ] Frontend: Scan QR code → ticket verified
- [ ] Frontend: Spin wheel (simple) → prize shown
- [ ] Frontend: Spin wheel (premium) → prize shown
- [ ] Frontend: Enter name/phone → prizes saved
- [ ] Staff dashboard: Search user → found
- [ ] Staff dashboard: Validate prize → status updated
- [ ] Admin: View stats → correct numbers
- [ ] Admin: Edit prize → changes saved

### Error Scenarios
- [ ] Scan invalid signature → error shown
- [ ] Scan same ticket twice → "already used" error
- [ ] Spin with 0 remaining → error shown
- [ ] Access /admin without login → redirected
- [ ] Invalid phone format → validation error

### Performance
- [ ] API responses < 500ms
- [ ] Database queries optimized (check indexes)
- [ ] No N+1 query problems
- [ ] Frontend loads smoothly

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All environment variables set in Vercel
- [ ] Supabase production keys (not dev keys)
- [ ] HMAC_SECRET matches cash register secret
- [ ] Database has RLS enabled
- [ ] Service role key kept secret
- [ ] No console.logs in production code

### Vercel Deployment
- [ ] Push code to GitHub
- [ ] Import project to Vercel
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test production URL

### Post-Deployment
- [ ] Test ticket scanning on real mobile device
- [ ] Verify HTTPS works
- [ ] Test admin login
- [ ] Check Supabase logs for errors
- [ ] Monitor for 24 hours

---

## 🎯 DONE CRITERIA

You're finished when all these work:

### User Flow ✅
- [x] Customer scans QR code
- [x] Ticket is verified (HMAC + anti-rescan)
- [x] Customer spins wheel multiple times
- [x] Prizes are shown correctly
- [x] Customer enters name/phone
- [x] Prizes are saved to database

### Staff Flow ✅
- [x] Staff can log in
- [x] Staff can search by name/phone
- [x] Staff can see user's prizes
- [x] Staff can mark prize as validated

### Admin Flow ✅
- [x] Admin can log in
- [x] Admin sees dashboard with stats
- [x] Admin can add/edit/delete prizes
- [x] Admin can view all users
- [x] Admin can view spin history

### Data Persistence ✅
- [x] Tickets can't be rescanned
- [x] User data persists
- [x] Prize claims saved correctly
- [x] Validations tracked

---

## 📞 HELP & DEBUGGING

### Common Issues:

**"Cannot connect to Supabase"**
- Check NEXT_PUBLIC_SUPABASE_URL is correct
- Verify SUPABASE_SERVICE_KEY is set
- Check internet connection

**"Invalid signature"**
- Verify HMAC_SECRET matches cash register
- Check message format: `ticket_id|classiques|premium`
- Ensure no extra spaces in message

**"Ticket already used"**
- Check tickets table for duplicate ticket_id
- This is expected behavior for anti-rescan

**"No spins remaining"**
- Check tickets.spins_simple_remaining value
- Verify spin decrement logic works

**"Unauthorized" on admin routes**
- Check if logged in
- Verify middleware.ts is configured
- Check Supabase session

### Debugging Tools:
- Supabase Table Editor (view data)
- Supabase Logs (view queries)
- Vercel Logs (view API errors)
- Browser DevTools Network tab
- Thunder Client (test APIs)

---

## 📝 NOTES & TIPS

### HMAC Testing:
```bash
# Test HMAC signature generation:
echo -n "TEST-001|2|1" | openssl dgst -sha256 -hmac "test-secret-2025"

# Use this sig in Postman test request
```

### Database Inspection:
```sql
-- View tickets
SELECT * FROM tickets ORDER BY created_at DESC LIMIT 10;

-- View prizes won
SELECT u.name, p.name as prize, up.status 
FROM user_prizes up
JOIN users u ON up.user_id = u.id
JOIN prizes p ON up.prize_id = p.id;

-- Check spin counts
SELECT ticket_id, spins_simple_remaining, spins_premium_remaining 
FROM tickets;
```

### Quick Supabase Client:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Server-side only
);
```

---

**Good luck! Check off items as you complete them. 🚀**