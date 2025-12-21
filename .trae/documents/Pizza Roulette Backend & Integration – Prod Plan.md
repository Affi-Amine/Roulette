## Verification Summary
- API routes present and aligned with spec:
  - `app/api/verify-ticket/route.ts` verifies HMAC, anti-rescan, inserts ticket, returns spin counts.
  - `app/api/spin/route.ts` checks remaining spins, selects prize via `select_random_prize`, records spin, decrements count.
  - `app/api/claim-prizes/route.ts` upserts user, links ticket, writes `user_prizes`.
  - Staff/Admin: `app/api/staff/search`, `app/api/staff/validate-prize`, `app/api/admin/stats` implemented.
- Auth protection: `middleware.ts` guards `/admin/*` and `/api/admin/*` using Supabase session.
- Admin UI: `app/admin/login/page.tsx` (password login) and `app/admin/page.tsx` (basic stats) exist.
- Supabase helpers: `lib/supabase.ts` (service-key server client), `lib/supabase-browser.ts` (anon browser client) exist.
- Env: `.env` contains Supabase URL/keys, admin credentials, `HMAC_SECRET`.
- Frontend still uses mocked logic; it does not call new APIs yet.

## Gaps To Reach Prod
- Input validation and error shaping for all API routes.
- Timing-safe HMAC comparison and strict type checks.
- Rate limiting for `POST /api/verify-ticket` and ideally spin routes.
- Frontend integration with real APIs (scan → verify → spin → claim).
- Staff UI for search and validate actions.
- Admin pages for prize CRUD, users list, spins history.
- Logging/observability and consistent error responses.
- Next.js/Turbopack root config warning cleanup.
- RLS policies verified and documented; server routes use service key appropriately.

## Implementation Plan
### Backend Hardening
- Add Zod schemas to `verify-ticket`, `spin`, `claim-prizes`, `staff/validate-prize` to validate body and query inputs and return uniform errors.
- Replace `sig === expectedSig` with timing-safe comparison using `crypto.timingSafeEqual(Buffer.from(sig,'hex'), Buffer.from(expectedSig,'hex'))`, with guards for length.
- Add structured error responses: `{ error_code, message }` and consistent status codes.
- Add rate limiting middleware for `verify-ticket` and `spin`:
  - Option A: Upstash Rate Limit (production-ready).
  - Option B: Simple in-memory token bucket as interim (not distributed); recommend A for prod.
- Add basic request logging (method, route, outcome) with `console.info` on server (no secrets).

### Frontend Integration
- Wire `components/qr-scanner.tsx` to call `POST /api/verify-ticket` with scanned JSON, manage returned spins in state.
- Update `components/pizza-roulette-app.tsx` to:
  - Store `ticket_id` after verification.
  - Call `POST /api/spin` for each spin; collect `spin_ids` and prize details.
  - Call `POST /api/claim-prizes` with name, phone, and collected `spin_ids`.
  - Use existing error components for API errors (invalid signature, already used, no spins).
- Keep UI and animations intact; only replace mocked transitions with API calls and error handling.

### Staff UI
- Create `/staff/page.tsx`:
  - Search input tied to `GET /api/staff/search`.
  - Render users with their prizes.
  - “Validate” button invoking `POST /api/staff/validate-prize`.
  - Feedback toasts and loading states.

### Admin UI Expansion
- `/admin/prizes/page.tsx`:
  - Table of prizes with edit/delete/toggle active.
  - Forms to create/edit prize with validation.
  - New API routes: `app/api/admin/prizes` (POST/PUT/DELETE) using service key.
- `/admin/users/page.tsx`:
  - List users, search by name/phone, prize counts, expand prize history.
- `/admin/spins/page.tsx`:
  - Spins table with timestamp, user, ticket, prize, type, date range filter.

### Config & Security
- Add `turbopack.root` in `next.config.ts` to remove workspace root warning.
- Ensure `.env` is used only server-side for `SUPABASE_SERVICE_KEY` and `HMAC_SECRET`.
- Document and verify RLS is enabled for all tables; confirm server routes use service key (bypasses RLS) and client-side reads (if any) use anon.

### Testing & Verification
- Add Thunder Client collection (or Postman) covering all endpoints and error scenarios.
- Add minimal Jest tests for utility functions (e.g., signature verification helper) if desired.
- Manual E2E:
  - Scan valid ticket → verify → perform spins → claim → staff validates → admin stats update.
  - Error paths: invalid signature, already used, zero spins, invalid phone.

### Deployment Readiness
- Production environment variables in Vercel.
- Remove `console.log` noise; keep minimal structured logs.
- Monitor Supabase and Vercel logs.
- Optional: Upstash rate limit credentials and wiring.

## Deliverables
- Hardened API routes with validation, timing-safe HMAC, and rate limiting.
- Frontend integrated with real backend.
- Staff page for search/validation.
- Admin prize/users/spins pages with CRUD.
- Config cleanup and documented RLS usage.
- Tests and manual E2E verification steps.

Please confirm this plan. Once approved, I will implement the changes and verify with lint/build and live dev testing. 