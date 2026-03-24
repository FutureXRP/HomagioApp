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
- Brand name: homagio (lowercase logo, blue accent on "agio")
- Flagship product term: "Homagio Estimate™" (like Zillow's Zestimate)
- NOTE: Interior pages are functional but unstyled. Design polish pass planned after all core flows are built.

---

## ⚙️ Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | Next.js 14 (App Router), Tailwind CSS   |
| Database       | PostgreSQL via Supabase                 |
| Auth           | Supabase Auth (email + Google OAuth)    |
| Email          | Resend (welcome email working)          |
| Image Storage  | Cloudinary (not yet set up)             |
| AI Detection   | OpenAI Vision API (not yet set up)      |
| Maps           | Mapbox GL (not yet set up)              |
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

---

## 🗄️ Database Tables (all in Supabase)

- profiles (id, email, full_name, avatar_url, role, subscription_tier, created_at)
- homes (id, user_id, name, address, city, state, zip, lat, lng, year_built, square_feet, bedrooms, bathrooms, value_estimate, is_public, created_at)
- rooms (id, home_id, name, type, floor, notes, created_at)
- materials (id, room_id, home_id, name, brand, color, finish, notes, cost, purchase_url, affiliate_url, ai_detected, ai_confidence, created_at)
- photos (id, home_id, room_id, url, ai_tags, ai_confidence, created_at)
- budgets (id, home_id, room_id, project_name, estimated, actual, status, created_at)
- saved_homes (id, user_id, home_id, created_at)
- home_timeline (id, home_id, event_type, description, cost, event_date, created_at)
- Row Level Security enabled on all tables
- Auto profile creation trigger on new user signup

---

## 📁 Current File Structure

```
HomagioApp/
├── src/
│   ├── app/
│   │   ├── page.tsx                                      ✅ landing page
│   │   ├── globals.css                                   ✅
│   │   ├── layout.tsx                                    ✅
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx                            ✅ working
│   │   │   └── signup/page.tsx                           ✅ working
│   │   ├── dashboard/
│   │   │   ├── page.tsx                                  ✅ welcome screen with feature cards
│   │   │   └── homes/page.tsx                            ✅ my homes list
│   │   ├── homes/
│   │   │   ├── add/page.tsx                              ✅ working
│   │   │   └── [id]/
│   │   │       ├── page.tsx                              ✅ working
│   │   │       └── rooms/
│   │   │           ├── add/page.tsx                      ✅ working
│   │   │           └── [roomId]/
│   │   │               ├── page.tsx                      ✅ working
│   │   │               └── materials/
│   │   │                   └── add/page.tsx              ✅ working
│   │   ├── loading/
│   │   │   └── page.tsx                                  ✅ session loading spinner
│   │   ├── api/
│   │   │   └── send-welcome/route.ts                     ✅ welcome email via Resend
│   │   └── auth/
│   │       └── callback/route.ts                         ✅ OAuth code exchange
│   ├── middleware.ts                                      ✅ calls proxy to refresh session
│   └── lib/
│       └── supabase/
│           ├── client.ts                                 ✅ browser client
│           ├── server.ts                                 ✅ server client
│           └── proxy.ts                                  ✅ session refresh middleware
├── vercel.json                                           ✅ framework: nextjs
├── next.config.js                                        ✅
├── tailwind.config.ts                                    ✅
├── tsconfig.json                                         ✅
├── postcss.config.js                                     ✅
├── package.json                                          ✅ includes @supabase/ssr, resend
└── CLAUDE.md                                             ✅ this file
```

---

## 🏗️ Build Phases

### ✅ Phase 0 — Complete
- [x] Product vision, feature spec, design language, tech stack

### ✅ Phase 1a — Foundation Complete
- [x] GitHub repo, Next.js 14, Vercel Pro, live site

### ✅ Phase 1b — Auth Complete
- [x] Supabase + @supabase/ssr (browser + server + proxy architecture)
- [x] Email/password login working
- [x] Google OAuth working
- [x] Auth callback route working
- [x] Middleware protecting /dashboard routes
- [x] Welcome email via Resend on signup

### ✅ Phase 1c — Core Flows Complete
- [x] Add Home flow
- [x] Individual home page
- [x] Add Room flow
- [x] Room detail page
- [x] Add Material flow (name, brand, category, color, finish, cost, purchase URL, affiliate URL)
- [x] New dashboard welcome screen ("Welcome back, Matt!")
- [x] My Homes moved to /dashboard/homes

### ⚠️ Known Issues (low priority, don't fix yet)
- Google OAuth signup creates account then requires a second login before reaching dashboard
  - Root cause: session cookie not fully propagated before /dashboard checks it
  - Fix approach: update auth/callback to redirect to /dashboard (not /loading) and rely on onAuthStateChange
  - HOLD OFF — app is working, risk of regression too high right now

### 📋 Phase 1d — Next
- [ ] Design polish pass on all interior pages
- [ ] Stripe subscriptions (Free/Premium/Pro)

### 📋 Phase 2 — Core Product
- [ ] Photo upload (Cloudinary)
- [ ] AI material detection (OpenAI Vision)
- [ ] Budget tracker + ROI calculator
- [ ] Shopping list generator + PDF export
- [ ] Homagio Estimate™
- [ ] Home Value Impact per material category

### 📋 Phase 3 — Explore + Discovery + Affiliate System
- [ ] Mapbox map integration
- [ ] Public home profiles
- [ ] Browse + filter nearby homes
- [ ] Homagio Affiliate Revenue System (see below)

### 📋 Phase 4 — Pro Studio
- [ ] Pro user dashboard
- [ ] Client management
- [ ] PDF spec sheet exports

### 📋 Phase 5 — Retention + Growth
- [ ] Email notifications (Resend)
- [ ] Home timeline
- [ ] Maintenance reminders
- [ ] React Native mobile app

---

## 💰 Affiliate Revenue Model (build in Phase 3)

Homagio operates a single master affiliate account across all retailers.
Every "Shop This Material" link routes through Homagio's affiliate links.

**Commission split options:**
- Option A: 80% homeowner / 20% Homagio
- Option B: 60% homeowner / 40% Homagio
- Option C: Tiered by subscription — Free: 70/30, Premium: 80/20, Pro: 85/15

**Tech needed:**
- Skimlinks or VigLink for automatic link conversion
- Stripe Connect for homeowner payouts
- Earnings dashboard for homeowners
- Clear ToS disclosing affiliate relationship

---

## ⚠️ Important Notes for Claude

- Owner is on Mac, no local terminal
- Use GitHub web UI to create/edit files — always use Add File → Create New File (pencil edit icon corrupts files)
- All files committed directly to main branch
- Vercel Pro auto-deploys every commit to main
- Always use window.location.href for redirects — never useRouter
- All monetary values stored in cents in database
- User roles: 'homeowner' | 'pro' | 'admin'
- Subscription tiers: 'free' | 'premium' | 'pro_studio'

## 🔧 Auth Architecture
- `src/lib/supabase/client.ts` — createBrowserClient for client components
- `src/lib/supabase/server.ts` — createServerClient with cookies for server components
- `src/lib/supabase/proxy.ts` — session refresh logic called by middleware
- `src/middleware.ts` — calls updateSession from proxy on every request
- `src/app/auth/callback/route.ts` — exchanges OAuth code for session, redirects to /dashboard
- Google OAuth redirect URI in Google Cloud Console: https://emwwijbfyqjtmwkmwgnt.supabase.co/auth/v1/callback
- Supabase redirect URLs: https://homagio-app.vercel.app/** and https://homagio-app.vercel.app/auth/callback
- Supabase Site URL: https://homagio-app.vercel.app
- Email confirmation: OFF in Supabase

## 📧 Email Architecture
- Provider: Resend (free tier)
- From address: onboarding@resend.dev (until custom domain set up)
- Welcome email fires on signup via /api/send-welcome route
- Future: swap to hello@homagio.com once domain purchased

---

## 🚀 How to Start Each New Session

1. Open new chat at claude.ai
2. Paste this entire CLAUDE.md
3. Say what you want to build

---

*Last updated: Session 4 — Auth fully rebuilt with @supabase/ssr proxy architecture, Resend welcome email working, dashboard welcome screen built, all core flows updated*
*Next session: Design polish pass OR Stripe subscriptions*
