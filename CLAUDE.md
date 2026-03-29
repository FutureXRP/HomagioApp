# HOMAGIO — PROJECT CONTEXT FOR CLAUDE

> Paste this file at the start of every new Claude session.
> At the end of each session, ask Claude: "Update my CLAUDE.md to reflect what we built today."

---

## 🌐 Live URLs
- **GitHub:** https://github.com/FutureXRP/HomagioApp
- **Vercel (Live Site):** https://homagio-app.vercel.app
- **Supabase Project URL:** https://emwwijbfyqjtmwkmwgnt.supabase.co

---

## 🏠 What Is Homagio

Homagio is a **Home Intelligence Platform** — the "Home Operating System."
Positioning: Zillow + Pinterest + Houzz + Excel + AI, combined into one platform.

Two user types:
1. Homeowners — track, improve, plan, and shop their home
2. Pro Users (Designers, Builders, Realtors) — manage clients, showcase portfolios

---

## 🎨 Design Language

- Style: Zillow-inspired (clean, white, minimal, trustworthy)
- Primary color: #006aff (Zillow blue)
- Typography: System sans-serif, clean hierarchy
- Brand name: homagio (lowercase logo, blue "hom" accent)
- Flagship product term: "Homagio Estimate™" (like Zillow's Zestimate)
- NOTE: Full design polish pass planned after all core flows are built

---

## ⚙️ Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | Next.js 14 (App Router), Tailwind CSS   |
| Database       | PostgreSQL via Supabase                 |
| Auth           | Supabase Auth (email + Google OAuth)    |
| Email          | Resend (welcome email working)          |
| Image Storage  | Cloudinary (✅ working)                 |
| Maps           | Mapbox GL JS v3.3.0 (✅ working)        |
| Geocoding      | Mapbox Geocoding API (✅ working)       |
| AI Detection   | OpenAI Vision API (not yet set up)      |
| Payments       | Stripe + Stripe Connect (not yet set up)|
| Affiliate Mgmt | Skimlinks or custom (not yet set up)    |
| Deploy (web)   | Vercel Pro                              |
| Mobile (later) | React Native                            |

---

## 🔑 Keys (all in Vercel env vars — never commit)

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SECRET_KEY
- RESEND_API_KEY
- RESEND_FROM_EMAIL
- NEXT_PUBLIC_MAPBOX_TOKEN
- MAPBOX_TOKEN (server-side, same value — env var doesn't load reliably, token is hardcoded in route.ts)

## ☁️ Cloudinary
- Cloud Name: dlb0guicc
- Upload Preset: HomagioApp (unsigned)
- Folders: homagio/homes, homagio/rooms, homagio/materials
- Upload goes directly from browser to Cloudinary (no server needed)

## 🗺️ Mapbox
- Token stored in NEXT_PUBLIC_MAPBOX_TOKEN in Vercel
- Also hardcoded in ExploreClient.tsx (public pk. token — safe to commit)
- Also hardcoded in src/app/api/geocode/route.ts (same public token — safe to commit)
- Token name in Mapbox dashboard: "Homagio App"
- Allowed URL: https://homagio-app.vercel.app (cannot remove — needed for map)
- Default map center: Tulsa, OK [-95.9928, 36.1540], zoom 11
- Use default Mapbox marker with color option — NOT custom HTML elements (causes pin jumping bug)
- Homes need lat + lng columns populated in Supabase to show as pins
- The Blair House: lat=36.0868, lng=-96.0639

## 📍 Geocoding
- API route at src/app/api/geocode/route.ts handles both suggest and geocode modes
- Token hardcoded in route.ts (NEXT_PUBLIC_ vars don't load server-side reliably; MAPBOX_TOKEN env var also tried but failed — hardcode is the working solution)
- Mapbox token has URL restriction (homagio-app.vercel.app) — this blocks server-side geocoding API calls
- WORKAROUND: Token is hardcoded directly in route.ts since it's a public token (same as ExploreClient.tsx)
- Address autocomplete UI is built in Add Home form but blocked by Mapbox URL token restriction
- TODO: Create a second unrestricted Mapbox token for server-side geocoding, store as MAPBOX_GEOCODE_TOKEN

---

## 🗄️ Database Tables (all in Supabase)

- **profiles** (id, email, full_name, avatar_url, role, subscription_tier, created_at)
- **homes** (id, user_id, name, address, city, state, zip, lat, lng, year_built, square_feet, bedrooms, bathrooms, value_estimate, photo_url, is_public, created_at)
- **rooms** (id, home_id, name, type, floor, notes, photo_url, created_at)
- **materials** (id, room_id, home_id, name, brand, color, finish, category, notes, cost, purchase_url, affiliate_url, photo_url, ai_detected, ai_confidence, created_at)
- **photos** (id, home_id, room_id, url, ai_tags, ai_confidence, created_at)
- **budgets** (id, home_id, room_id, project_name, estimated, actual, status, created_at)
- **saved_homes** (id, user_id, home_id, created_at)
- **home_timeline** (id, home_id, event_type, description, cost, event_date, created_at)
- Row Level Security enabled on all tables
- Auto profile creation trigger on new user signup
- NOTE: materials.category column was missing — added via SQL: `ALTER TABLE materials ADD COLUMN IF NOT EXISTS category text;`

---

## 📁 Current File Structure

```
HomagioApp/
├── src/
│   ├── app/
│   │   ├── page.tsx                                      ✅ landing page (server component, fault-tolerant fetch, no createClient)
│   │   ├── globals.css                                   ✅
│   │   ├── layout.tsx                                    ✅
│   │   ├── about/
│   │   │   └── page.tsx                                  ✅ About Us page with Blair House origin story
│   │   ├── faq/
│   │   │   └── page.tsx                                  ✅ FAQ accordion (10 questions, client component)
│   │   ├── contact/
│   │   │   └── page.tsx                                  ✅ Contact form — wired to /api/send-contact, shows success state
│   │   ├── explore/
│   │   │   ├── page.tsx                                  ✅ server component, fetches public homes
│   │   │   ├── ExploreClient.tsx                         ✅ Mapbox map, left panel list, sidebar panel on pin click
│   │   │   └── [homeId]/
│   │   │       ├── page.tsx                              ✅ server component, public profile
│   │   │       └── PublicHomeClient.tsx                  ✅ hero photo, stats, expandable rooms + materials, buy links
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx                            ✅ email + Google OAuth working
│   │   │   └── signup/page.tsx                           ✅ working, triggers welcome email
│   │   ├── dashboard/
│   │   │   ├── page.tsx                                  ✅ server component, auth checked server-side
│   │   │   ├── DashboardClient.tsx                       ✅ welcome screen, feature cards, Explore link active
│   │   │   └── homes/
│   │   │       ├── page.tsx                              ✅ server component
│   │   │       └── HomesDashboardClient.tsx              ✅ homes grid, stats, add home button
│   │   ├── homes/
│   │   │   ├── add/page.tsx                              ✅ 2-step form, geocoding on submit, address autocomplete UI built (dropdown blocked by Mapbox token URL restriction)
│   │   │   └── [id]/
│   │   │       ├── page.tsx                              ✅ server component
│   │   │       ├── HomeDetailClient.tsx                  ✅ home photo upload, public/private toggle, rooms grid, recent materials
│   │   │       └── rooms/
│   │   │           ├── add/page.tsx                      ✅ add room form with type + floor selector
│   │   │           └── [roomId]/
│   │   │               ├── page.tsx                      ✅ server component
│   │   │               ├── RoomDetailClient.tsx          ✅ room photo upload, materials list with thumbnails, clickable rows
│   │   │               └── materials/
│   │   │                   ├── add/page.tsx              ✅ full form with Cloudinary photo upload
│   │   │                   └── [materialId]/
│   │   │                       ├── page.tsx              ✅ server component
│   │   │                       ├── MaterialDetailClient.tsx  ✅ full photo, detail grid, buy button, edit button
│   │   │                       └── edit/
│   │   │                           ├── page.tsx          ✅ server component
│   │   │                           └── EditMaterialClient.tsx ✅ pre-populated form, photo change/remove, delete with confirm
│   │   ├── loading/
│   │   │   └── page.tsx                                  ✅ simple redirect to /dashboard
│   │   ├── api/
│   │   │   ├── send-welcome/route.ts                     ✅ welcome email via Resend on signup
│   │   │   ├── send-contact/route.ts                     ✅ contact form emails via Resend (2 emails: notify you + confirm to sender)
│   │   │   └── geocode/route.ts                          ✅ Mapbox geocoding + autosuggest, token hardcoded (public token)
│   │   └── auth/
│   │       └── callback/route.ts                         ✅ OAuth code exchange, redirects to /dashboard
│   ├── middleware.ts                                      ✅ protects /dashboard + /homes, public routes bypass entirely
│   └── lib/
│       └── supabase/
│           ├── client.ts                                 ✅ createBrowserClient for client components
│           └── server.ts                                 ✅ createServerClient with cookies for server components
├── vercel.json                                           ✅
├── next.config.js                                        ✅
├── tailwind.config.ts                                    ✅
├── tsconfig.json                                         ✅
├── postcss.config.js                                     ✅
└── package.json                                          ✅ includes @supabase/ssr, resend
```

---

## 🔧 Auth Architecture (CRITICAL — hard-won fix, do not change)

The auth was completely rebuilt in Session 5 after major race condition issues.

**Key principles:**
- All protected pages are **server components** that call `supabase.auth.getUser()` server-side before rendering anything
- Middleware at `src/middleware.ts` protects `/dashboard` and `/homes` routes — redirects to `/login` if no session
- **Public routes bypass ALL Supabase processing in middleware** — no getUser(), no cookie touching, just NextResponse.next()
- Client components handle UI only — no auth checks in client components
- Login page calls `signInWithPassword` and redirects to `/dashboard` when `data.session` is confirmed
- `proxy.ts` has been DELETED — do not recreate it
- Never use `getSession()` for auth — always use `getUser()`
- The landing page uses direct REST fetch (not createClient) to avoid session interference

**Public routes (middleware skips entirely):**
`/`, `/explore/*`, `/about`, `/faq`, `/contact`, `/auth/*`, `/api/*`, `/loading`

**Protected routes (redirect to /login if no session):**
`/dashboard/*`, `/homes/*`

**Standard page pattern:**
```
page.tsx (async server component)
  → await supabase.auth.getUser()
  → if !user: redirect('/login')
  → fetch data from Supabase
  → return <XxxClient data={data} />

XxxClient.tsx ('use client')
  → pure UI component
  → uses window.location.href for navigation
  → imports createClient() only for mutations (update, insert, delete)
```

**Known issue (deferred to Bolt.new):**
Clicking the homagio logo from the dashboard to `/` sometimes logs the user out. Root cause unclear — possibly session cookie interference on the landing page server render. Do not attempt to fix without a live debug environment.

---

## 🏗️ Build Phases

### ✅ Phase 0 — Complete
- [x] Product vision, feature spec, design language, tech stack decisions

### ✅ Phase 1a — Foundation Complete
- [x] GitHub repo created
- [x] Next.js 14 App Router initialized
- [x] Vercel Pro deployment configured
- [x] Live site at homagio-app.vercel.app

### ✅ Phase 1b — Auth Complete
- [x] Supabase project connected with @supabase/ssr package
- [x] Browser client (client.ts) and server client (server.ts) set up
- [x] Email/password login working — single login, no race conditions
- [x] Google OAuth working
- [x] Auth callback route at /auth/callback exchanges code for session
- [x] Middleware protecting /dashboard and /homes routes
- [x] Welcome email via Resend fires on new signup
- [x] Auto profile creation trigger in Supabase on new user

### ✅ Phase 1c — Core Flows Complete
- [x] Add Home flow — 2-step form (address → details)
- [x] Exterior room auto-created on every new home
- [x] Individual home page with all details
- [x] Add Room flow with room type and floor selector
- [x] Room detail page
- [x] Add Material flow — name, brand, category, color, finish, cost, purchase URL, affiliate URL
- [x] Material detail page — full info display
- [x] Edit Material — pre-populated form, update, delete with confirmation
- [x] Dashboard welcome screen with feature cards
- [x] My Homes page with homes grid

### ✅ Phase 2a — Photo Upload Complete
- [x] Cloudinary account connected (cloud: dlb0guicc, preset: HomagioApp)
- [x] Home exterior photo upload
- [x] Room hero photo upload
- [x] Material photo upload
- [x] Room cards on home detail page show photo thumbnail if available
- [x] Material rows show 52x52 photo thumbnail if available

### ✅ Phase 2b — Public/Private Toggle Complete
- [x] is_public column on homes table
- [x] Toggle UI on home detail page
- [x] Public homes appear on landing page and Explore map

### ✅ Phase 3a — Explore + Map Complete
- [x] Mapbox GL JS v3.3.0 loaded dynamically in ExploreClient
- [x] /explore page — full screen map with left panel home list
- [x] Map pins, sidebar panel, public home profile page all working

### ✅ Phase 3b — Landing Page + Nav Complete
- [x] Full nav, mobile hamburger menu, featured homes, stats section, footer

### ✅ Phase 3c — Public Pages Complete
- [x] /faq, /about, /contact pages all built

### ✅ Phase 3d — Geocoding + Contact Email Complete
- [x] Contact form wired to Resend API via /api/send-contact
- [x] Two emails on submit: notification to owner + confirmation to sender
- [x] Contact form emails blocked until custom domain added to Resend (free tier limitation)
- [x] Geocoding API route at /api/geocode (suggest + geocode modes)
- [x] Add Home form geocodes address on submit → saves lat/lng to homes table
- [x] Address autocomplete UI built — dropdown blocked by Mapbox token URL restriction
- [x] Fixed missing materials.category column in Supabase

### 📋 Phase 3e — Remaining Nice-to-Haves
- [ ] Fix address autocomplete — create second unrestricted Mapbox token (MAPBOX_GEOCODE_TOKEN)
- [ ] Wire contact form email — requires custom domain in Resend
- [ ] Public room pages: /explore/[homeId]/rooms/[roomId]
- [ ] Public material pages: /explore/[homeId]/rooms/[roomId]/materials/[materialId]
- [ ] Add "Save this home" / favorites functionality for logged-in users

### 📋 Phase 4 — Core Product Features
- [ ] Budget tracker — track spending per room, total vs estimated
- [ ] ROI calculator — estimated home value impact per material category
- [ ] Shopping list generator — export all materials as a shoppable list
- [ ] PDF export of shopping list and home spec sheet
- [ ] Homagio Estimate™ — home value estimate based on materials cataloged

### 📋 Phase 5 — AI Features
- [ ] AI material detection — OpenAI Vision API
- [ ] Upload photo → AI identifies material, brand, color, finish automatically
- [ ] AI confidence score stored in materials.ai_confidence
- [ ] Manual override if AI is wrong

### 📋 Phase 6 — Stripe + Monetization
- [ ] Stripe subscriptions — Free / Premium / Pro Studio tiers
- [ ] Gate AI detection behind paid tier
- [ ] Stripe Connect for homeowner affiliate payouts
- [ ] Affiliate earnings dashboard for homeowners
- [ ] Commission split: Free 70/30, Premium 80/20, Pro 85/15

### 📋 Phase 7 — Pro Studio
- [ ] Pro user dashboard — separate from homeowner dashboard
- [ ] Client management — add/manage client homes
- [ ] Portfolio view — showcase completed projects
- [ ] PDF spec sheet exports for clients
- [ ] Pro badge on public home profiles

### 📋 Phase 8 — Retention + Growth
- [ ] Custom domain for Resend (unlocks sending to any email)
- [ ] Email notifications via Resend (reminders, updates)
- [ ] Home timeline — log events, renovations, purchases over time
- [ ] Maintenance reminders — schedule reminders per material/system
- [x] Welcome email on signup ✅ already done

### 📋 Phase 9 — Polish + Mobile
- [ ] Full mobile responsive pass on all interior pages
- [ ] React Native mobile app
- [ ] Design polish pass (once all features built)
- [ ] Fix login navigation issue (logo click logs out — defer to Bolt.new)

---

## 💰 Affiliate Revenue Model (build in Phase 6)

Homagio operates a single master affiliate account across all retailers.
Every "Shop This Material" link routes through Homagio's affiliate links.

**Commission split options:**
- Option A: 80% homeowner / 20% Homagio
- Option B: 60% homeowner / 40% Homagio
- Option C: Tiered by subscription — Free: 70/30, Premium: 80/20, Pro: 85/15

---

## ⚠️ Important Notes for Claude

- Owner is on Mac, no local terminal experience
- Use GitHub web UI to create/edit files — Add File → Create New File for new files
- All files committed directly to main branch
- Vercel Pro auto-deploys every commit to main
- Always use `window.location.href` for redirects in client components — never useRouter
- All monetary values stored in cents in database
- User roles: 'homeowner' | 'pro' | 'admin'
- Subscription tiers: 'free' | 'premium' | 'pro_studio'
- **proxy.ts is DELETED** — do not recreate it
- **Never use custom HTML elements for Mapbox markers** — use `new mapboxgl.Marker({ color: '#006aff' })`
- **Landing page must use direct REST fetch, NOT createClient()** — prevents session logout bug
- **Contact form emails deferred** — Resend free tier requires custom domain to send to arbitrary emails
- **NEXT_PUBLIC_ env vars do not load reliably server-side** — hardcode public tokens in server files instead
- **Mapbox token has URL restriction** — cannot be used unrestricted server-side; hardcode in route.ts is the workaround
- TypeScript: always use `interface PageProps { params: { id: string } }` for dynamic route server components
- **Always provide complete file paths** when giving files to commit (e.g. `src/app/api/geocode/route.ts`)
- **Always deliver code as downloadable files** — not pasted in chat

## 📧 Email Architecture
- Provider: Resend (free tier)
- From address: onboarding@resend.dev (until custom domain set up)
- Welcome email fires on signup via /api/send-welcome route
- Contact form emails via /api/send-contact route (2 emails: owner notification + sender confirmation)
- Contact form email delivery blocked until custom domain added to Resend

---

## 🚀 How to Start Each New Session

1. Open new chat at claude.ai
2. Paste this entire CLAUDE.md
3. Say what you want to build

---

*Last updated: Session 7 — Contact form wired to Resend API (two emails: owner notification + sender confirmation). Geocoding added to Add Home form via /api/geocode route — new homes auto-get lat/lng saved to Supabase. Address autocomplete UI built but dropdown blocked by Mapbox token URL restriction (TODO: create unrestricted token). Fixed missing materials.category column in Supabase. Established pattern of delivering code as downloadable files with full paths.*

*Next session options: Fix address autocomplete with unrestricted Mapbox token, build budget tracker, build public room/material pages, or wire contact form email via custom Resend domain.*
