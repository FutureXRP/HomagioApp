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
- NOTE: Interior pages (dashboard, rooms, materials) are currently functional but unstyled.
  A full design polish pass is planned after all core flows are built.

---

## ⚙️ Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | Next.js 14 (App Router), Tailwind CSS   |
| Database       | PostgreSQL via Supabase                 |
| Auth           | Supabase Auth (email + Google OAuth)    |
| Image Storage  | Cloudinary (not yet set up)             |
| AI Detection   | OpenAI Vision API (not yet set up)      |
| Maps           | Mapbox GL (not yet set up)              |
| Payments       | Stripe + Stripe Connect (not yet set up)|
| Email          | Resend (not yet set up)                 |
| Affiliate Mgmt | Skimlinks or custom (not yet set up)    |
| Deploy (web)   | Vercel Pro                              |
| Mobile (later) | React Native                            |

---

## 🔑 Supabase Keys (in Vercel env vars — do not commit)

- NEXT_PUBLIC_SUPABASE_URL = (in Vercel env vars)
- NEXT_PUBLIC_SUPABASE_ANON_KEY = (in Vercel env vars)
- SUPABASE_SECRET_KEY = (in Vercel env vars only — do not commit)

---

## 🗄️ Database Tables (all created in Supabase)

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
│   │   │   └── page.tsx                                  ✅ working
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
│   │   └── auth/
│   │       └── callback/route.ts                         ✅ working
│   ├── middleware.ts                                      ✅ working
│   └── lib/
│       ├── supabase.ts                                   ✅ @supabase/ssr browser client
│       └── supabaseServer.ts                             ✅ @supabase/ssr server client
├── vercel.json                                           ✅ framework: nextjs
├── .cfignore                                             ✅ leftover, harmless
├── next.config.js                                        ✅
├── tailwind.config.ts                                    ✅
├── tsconfig.json                                         ✅
├── postcss.config.js                                     ✅
├── package.json                                          ✅ includes @supabase/ssr
└── CLAUDE.md                                             ✅ this file
```

---

## 🏗️ Build Phases

### ✅ Phase 0 — Complete
- [x] Product vision defined
- [x] Full feature spec documented
- [x] Design language established
- [x] Tech stack decided

### ✅ Phase 1a — Foundation Complete
- [x] GitHub repo created
- [x] Next.js 14 project scaffolded
- [x] Vercel Pro connected and auto-deploying
- [x] Site is LIVE at homagio-app.vercel.app

### ✅ Phase 1b — Auth & Database Complete
- [x] Supabase project created
- [x] Environment variables in Vercel
- [x] Supabase client using @supabase/ssr
- [x] Middleware refreshing session on every request
- [x] Sign up, login, Google OAuth all working
- [x] Auth callback route working
- [x] Dashboard loading homes from Supabase

### ✅ Phase 1c — Core Flows Complete
- [x] Add Home flow working
- [x] Individual home page working
- [x] Add Room flow working
- [x] Room detail page working
- [x] Add Material flow working (name, brand, category, color, finish, cost, purchase URL, affiliate URL)
- [x] Material detail shows in room page

### 📋 Phase 1d — Next Session
- [ ] Design polish pass on all interior pages (dashboard, home, room, material)
- [ ] Stripe subscriptions (Free/Premium/Pro)
- [ ] Email setup with Resend

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

**Concept:** Homagio operates a single master affiliate account across all home improvement retailers
(Home Depot, Amazon, Wayfair, Lowe's, etc.). Every "Shop This Material" link on the platform
routes through Homagio's affiliate links — not the individual user's.

**How it works:**
- User adds a material with a normal product URL (e.g. homedepot.com/stove)
- Backend automatically converts it to a Homagio affiliate link
- Public visitors click "Shop This" → Homagio earns the commission
- Homeowner gets a revenue share paid out via Stripe Connect

**Commission split options (decide before building):**
- Option A: 80% homeowner / 20% Homagio — generous, drives adoption
- Option B: 60% homeowner / 40% Homagio — more platform revenue
- Option C: Tiered by subscription — Free: 70/30, Premium: 80/20, Pro: 85/15

**Why this is better than users managing their own affiliate links:**
- Zero friction for users — paste any normal product URL, we handle the rest
- Users don't need their own affiliate accounts
- Homagio controls the full revenue stream
- Single affiliate relationship with each retailer is easier to manage

**Tech needed:**
- Skimlinks or VigLink for automatic link conversion (easiest), OR custom link management
- Stripe Connect for homeowner payouts
- Dashboard showing homeowner earnings per material/month
- Clear ToS disclosing affiliate relationship to visitors

---

## ⚠️ Important Notes for Claude

- Owner is on Mac
- No local terminal — using GitHub web UI (github.com) to create/edit files
- Use "Add file → Create new file" on GitHub, NOT the pencil edit icon (causes corruption)
- All files committed directly to main branch
- Vercel Pro auto-deploys every commit to main
- Use window.location.href instead of useRouter for redirects
- Never use useRouter for redirects — causes session issues
- All monetary values stored in cents in database
- User roles: 'homeowner' | 'pro' | 'admin'
- Subscription tiers: 'free' | 'premium' | 'pro_studio'
- Always provide files as downloads — pasting long files in chat causes corruption
- @supabase/ssr is required for cookie-based sessions
- vercel.json with {"framework": "nextjs"} is required

## 🔧 Auth Architecture
- supabase.ts: createBrowserClient from @supabase/ssr (client components)
- supabaseServer.ts: createServerClient from @supabase/ssr with cookies (server components)
- middleware.ts: runs on every /dashboard request, refreshes session cookie
- auth/callback/route.ts: exchanges OAuth code for session
- Google OAuth redirect URI in Google Cloud Console: https://emwwijbfyqjtmwkmwgnt.supabase.co/auth/v1/callback
- Supabase redirect URLs: https://homagio-app.vercel.app/** and https://homagio-app.vercel.app/auth/callback

---

## 🚀 How to Start Each New Session

1. Open new chat at claude.ai
2. Paste this entire CLAUDE.md
3. Say what you want to build

---

*Last updated: Session 3 — Auth fixed, all core flows built (Home/Room/Material), affiliate revenue model designed*
*Next session: Design polish pass OR Stripe subscriptions OR Resend email*
