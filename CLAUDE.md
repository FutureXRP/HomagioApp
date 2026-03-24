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
| Payments       | Stripe (not yet set up)                 |
| Email          | Resend (not yet set up)                 |
| Deploy (web)   | Vercel Pro                              |
| Mobile (later) | React Native                            |

---

## 🔑 Supabase Keys (in Vercel env vars)

- NEXT_PUBLIC_SUPABASE_URL = https://emwwijbfyqjtmwkmwgnt.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_j-Uu80wYijMHaDBeNgQzDg_N-tfhCMp
- SUPABASE_SECRET_KEY = (stored in Vercel env vars only — do not commit)

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
│   │   ├── page.tsx                    ✅ landing page
│   │   ├── globals.css                 ✅
│   │   ├── layout.tsx                  ✅
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx          ✅ working
│   │   │   └── signup/page.tsx         ✅ working
│   │   ├── dashboard/
│   │   │   └── page.tsx                ✅ working
│   │   ├── homes/
│   │   │   ├── add/page.tsx            ✅ working
│   │   │   └── [id]/page.tsx           ✅ working
│   │   └── auth/
│   │       └── callback/route.ts       ✅ working
│   ├── middleware.ts                   ✅ working (session refresh)
│   └── lib/
│       ├── supabase.ts                 ✅ using @supabase/ssr browser client
│       └── supabaseServer.ts           ✅ using @supabase/ssr server client
├── vercel.json                         ✅ framework: nextjs
├── .cfignore                           ✅ (leftover from Cloudflare attempt, harmless)
├── next.config.js                      ✅
├── tailwind.config.ts                  ✅
├── tsconfig.json                       ✅
├── postcss.config.js                   ✅
├── package.json                        ✅ includes @supabase/ssr
└── CLAUDE.md                           ✅ this file
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
- [x] Vercel connected and auto-deploying
- [x] Site is LIVE at homagio-app.vercel.app

### ✅ Phase 1b — Auth & Database Complete
- [x] Supabase project created
- [x] Environment variables in Vercel
- [x] Supabase client using @supabase/ssr (browser + server)
- [x] Middleware refreshing session on every request
- [x] Sign up page working
- [x] Login page working
- [x] Google OAuth working (redirect URIs configured in both Google Cloud Console and Supabase)
- [x] Auth callback route working (exchanges code for session via @supabase/ssr)
- [x] Dashboard page working (loads homes from Supabase)
- [x] Add Home flow working (tested and confirmed)
- [x] Individual home page built

### 📋 Phase 1c — Next Session
- [ ] Add Room flow
- [ ] Add Material flow
- [ ] Stripe subscriptions (Free/Premium/Pro)
- [ ] Email setup with Resend

### 📋 Phase 2 — Core Product
- [ ] Photo upload (Cloudinary)
- [ ] AI material detection (OpenAI Vision)
- [ ] Budget tracker + ROI calculator
- [ ] Shopping list generator + PDF export
- [ ] Homagio Estimate™

### 📋 Phase 3 — Explore + Discovery
- [ ] Mapbox map integration
- [ ] Public home profiles
- [ ] Browse + filter nearby homes

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

## ⚠️ Important Notes for Claude

- Owner is on Mac
- No local terminal — using GitHub web UI (github.com) to create/edit files
- Use "Add file → Create new file" on GitHub, NOT the pencil edit icon (causes corruption)
- All files committed directly to main branch
- Vercel Pro auto-deploys every commit to main
- Use window.location.href instead of useRouter for redirects
- Never use useRouter for redirects — it causes session issues
- All monetary values stored in cents in database
- User roles: 'homeowner' | 'pro' | 'admin'
- Subscription tiers: 'free' | 'premium' | 'pro_studio'
- Always provide files as downloads for long files — pasting in chat causes corruption
- GitHub web editor corrupts files — always use Add File → Create New File
- @supabase/ssr is required (not just @supabase/supabase-js) for cookie-based sessions
- vercel.json with {"framework": "nextjs"} is required for correct output directory

## 🔧 Auth Architecture (how it works)
- supabase.ts: createBrowserClient from @supabase/ssr (used in client components)
- supabaseServer.ts: createServerClient from @supabase/ssr with cookie handling (used in server components)
- middleware.ts: runs on every /dashboard request, refreshes session cookie
- auth/callback/route.ts: exchanges OAuth code for session using createServerClient
- Google OAuth redirect URI in Google Cloud Console: https://emwwijbfyqjtmwkmwgnt.supabase.co/auth/v1/callback
- Supabase redirect URLs: https://homagio-app.vercel.app/** and https://homagio-app.vercel.app/auth/callback

---

## 🚀 How to Start Each New Session

1. Open new chat at claude.ai
2. Paste this entire CLAUDE.md
3. Say what you want to build

---

*Last updated: Session 3 — Auth fully fixed, Google OAuth working, Add Home flow confirmed working, upgraded to Vercel Pro*
*Next session: Build Add Room + Add Material flows (Phase 1c)*
### Explore + Discovery
- Map-based home browsing (Zillow-style)
- Nearby homes view
- Filter by style, materials, budget
- Privacy-controlled public/private home profiles
- Save/favorite homes and materials
- Inspiration gallery
- "Recreate This Look" functionality
- AI style + material + product recommendations

### Pro Studio
- Client home management dashboard
- Project tracking (materials, budgets, timelines)
- PDF spec sheet exports
- Shareable client summaries
- Portfolio showcase with before/after
- Public-facing designer profiles
- Shared/editable material lists with clients
- Notes + project updates

### Additional Features (from audit)
- Guided onboarding wizard (critical — first session priority)
- Email + push notifications (estimate updates, price drops, digests)
- Social sharing (public home profiles, share to Pinterest/Instagram)
- Full-text search engine (Algolia or Postgres full-text)
- SEO-indexable home pages (homagio.com/homes/[address])
- Home timeline / history log (renovation history at resale)
- Maintenance reminders (HVAC, gutters, roof, etc.)
- Insurance documentation export (full catalog as PDF)
- Material price tracking + drop alerts

### Monetization
- Subscriptions: Free / Premium $19/mo / Pro Studio $49/mo
- Affiliate revenue (product purchase links)
- Ads (free tier only)
- Future: contractor marketplace, featured listings, promoted products

---

## ⚙️ Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | Next.js 14 (App Router), Tailwind CSS   |
| UI Components  | shadcn/ui                               |
| Backend        | Node.js + Express (REST API)            |
| Database       | PostgreSQL via Supabase                 |
| ORM            | Prisma                                  |
| Auth           | Supabase Auth (email + Google OAuth)    |
| Image Storage  | Cloudinary                              |
| AI Detection   | OpenAI Vision API (~$0.02/photo)        |
| Maps           | Mapbox GL                               |
| Payments       | Stripe (subscriptions + webhooks)       |
| Email          | Resend (transactional + marketing)      |
| Search         | Algolia or Postgres full-text           |
| Deploy (web)   | Vercel                                  |
| Deploy (API)   | Railway                                 |
| CI/CD          | GitHub Actions                          |
| Mobile (later) | React Native (shares backend with web)  |

---

## 🗄️ Database Tables (To Be Built)

- users (id, email, name, role, subscription_tier, created_at)
- homes (id, user_id, address, lat, lng, value_estimate, is_public)
- rooms (id, home_id, name, type, notes)
- materials (id, room_id, name, brand, color, finish, cost, purchase_url, affiliate_url)
- photos (id, home_id, room_id, url, ai_tags, ai_confidence)
- budgets (id, home_id, room_id, project_name, estimated, actual)
- shopping_lists (id, user_id, home_id, items_json, exported_at)
- saved_homes (id, user_id, home_id)
- pro_clients (id, pro_user_id, client_user_id, home_id)
- projects (id, pro_user_id, client_id, status, timeline_json)
- notifications (id, user_id, type, message, read, created_at)
- home_timeline (id, home_id, event_type, description, date, cost)

---

## 🏗️ Build Phases

### ✅ Phase 0 — Complete
- [x] Product vision defined
- [x] Full feature spec documented
- [x] Design language established (Zillow-style)
- [x] Tech stack decided
- [x] CLAUDE.md created

### ✅ Phase 1a — Foundation Complete
- [x] GitHub repo created (github.com/FutureXRP/HomagioApp)
- [x] Next.js 14 project scaffolded
- [x] Tailwind CSS configured (tailwind.config.ts)
- [x] Next.js config created (next.config.js)
- [x] Global styles created (src/app/globals.css)
- [x] Root layout created (src/app/layout.tsx)
- [x] Landing page built (src/app/page.tsx) — Zillow-style design
- [x] Vercel connected to GitHub (auto-deploys on every push)
- [x] Site is LIVE on the internet ✅

### 🔨 Phase 1b — Auth & Database (Build Next)
- [x] Supabase project created and configured
- [x] Environment variables set up (.env.local)
- [x] Supabase client created (src/lib/supabase.ts)
- [x] Database schema designed and migrated
- [x] User sign up page (src/app/(auth)/signup/page.tsx)
- [x] User sign in page (src/app/(auth)/login/page.tsx)
- [x] Google OAuth configured
- [ ] Protected dashboard route
- [ ] Onboarding wizard (3-step: address → photos → first material)
- [ ] Add Home flow
- [ ] Basic material catalog UI (room-by-room)
- [ ] Stripe Free/Premium subscription integration

### 📋 Phase 2 — Core Product
- [ ] Photo upload component (Cloudinary)
- [ ] AI material detection (OpenAI Vision API)
- [ ] Budget tracker + ROI calculator
- [ ] Shopping list generator + PDF export
- [ ] Affiliate link system
- [ ] Homagio Estimate™ (home value display)
- [ ] Full home dashboard (stats view)

### 📋 Phase 3 — Explore + Discovery
- [ ] Mapbox map integration
- [ ] Public home profiles (SEO-indexed)
- [ ] Browse + filter nearby homes
- [ ] Save/favorite functionality
- [ ] Full-text search

### 📋 Phase 4 — Pro Studio
- [ ] Pro user role + dashboard
- [ ] Client management
- [ ] Project tracker
- [ ] PDF spec sheet exports
- [ ] Portfolio showcase

### 📋 Phase 5 — Retention + Growth
- [ ] Email notifications (Resend)
- [ ] Push notifications
- [ ] Home timeline / history log
- [ ] Maintenance reminders
- [ ] Insurance documentation export
- [ ] React Native mobile app

---

## 📁 Current File Structure

```
HomagioApp/
├── src/
│   └── app/
│       ├── layout.tsx        ✅ built
│       ├── page.tsx          ✅ built (landing page)
│       └── globals.css       ✅ built
├── next.config.js            ✅ built
├── tailwind.config.ts        ✅ built
├── package.json              ✅ built
├── CLAUDE.md                 ✅ this file
└── README.md                 ✅ auto-generated by GitHub
```

---

## 🔑 Key Decisions Made

- Supabase over Firebase (better PostgreSQL support, generous free tier)
- Next.js App Router over Pages Router (modern, better performance)
- Zillow design language (white, clean, trustworthy)
- Pro Studio free for first 6 months to seed catalog content
- Build web first, mobile app in Phase 5
- SEO-indexed home pages are a Phase 3 priority
- Onboarding wizard is the #1 next priority
- shadcn/ui for components (saves weeks of UI work)
- Deploying directly to GitHub web editor → Vercel auto-deploys
- No local terminal workflow — all files created in github.dev

---

## ⚠️ Important Notes for Claude

- Owner is on Mac
- No local terminal workflow — using GitHub web editor (github.dev)
- All files are committed directly to main branch
- Vercel auto-deploys every commit to main
- Always use Tailwind CSS utility classes
- All monetary values stored in cents (integer) in database
- User roles: 'homeowner' | 'pro' | 'admin'
- Subscription tiers: 'free' | 'premium' | 'pro_studio'
- Home visibility: 'private' | 'public' | 'friends'
- Always add loading states and error handling to every component
- Always make components mobile-responsive

---

## 🚀 How to Start Each Session With Claude

1. Open a new chat at claude.ai
2. Paste this entire CLAUDE.md file
3. Say: "I want to build [next item from the phase checklist]"

**Next session start message:**
"Here is my project context: [paste CLAUDE.md]
Today I want to build: Supabase auth — sign up, sign in, and Google OAuth for Homagio."

---

## 📞 Session Start Template

```
Here is my project context:
[paste CLAUDE.md]

Today I want to build:
[specific feature from the phase checklist]
```

---

*Last updated: Session 1 — Foundation complete, landing page live on Vercel*
*Next session: Supabase auth setup (sign up, sign in, Google OAuth)*
