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
- Brand name: homagio (lowercase logo, blue accent on "hom")
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

## ☁️ Cloudinary
- Cloud Name: dlb0guicc
- Upload Preset: HomagioApp (unsigned)
- Folders: homagio/homes, homagio/rooms, homagio/materials
- Upload goes directly from browser to Cloudinary (no server needed)

---

## 🗄️ Database Tables (all in Supabase)

- profiles (id, email, full_name, avatar_url, role, subscription_tier, created_at)
- homes (id, user_id, name, address, city, state, zip, lat, lng, year_built, square_feet, bedrooms, bathrooms, value_estimate, photo_url, is_public, created_at)
- rooms (id, home_id, name, type, floor, notes, photo_url, created_at)
- materials (id, room_id, home_id, name, brand, color, finish, notes, cost, purchase_url, affiliate_url, photo_url, ai_detected, ai_confidence, created_at)
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
│   │   │   ├── page.tsx                                  ✅ server component
│   │   │   ├── DashboardClient.tsx                       ✅ client UI
│   │   │   └── homes/
│   │   │       ├── page.tsx                              ✅ server component
│   │   │       └── HomesDashboardClient.tsx              ✅ client UI
│   │   ├── homes/
│   │   │   ├── add/page.tsx                              ✅ working + exterior auto-create
│   │   │   └── [id]/
│   │   │       ├── page.tsx                              ✅ server component
│   │   │       ├── HomeDetailClient.tsx                  ✅ with home photo upload
│   │   │       └── rooms/
│   │   │           ├── add/page.tsx                      ✅ working
│   │   │           └── [roomId]/
│   │   │               ├── page.tsx                      ✅ server component
│   │   │               ├── RoomDetailClient.tsx          ✅ with room photo upload
│   │   │               └── materials/
│   │   │                   ├── add/page.tsx              ✅ working + photo upload
│   │   │                   └── [materialId]/
│   │   │                       ├── page.tsx              ✅ server component
│   │   │                       ├── MaterialDetailClient.tsx ✅ with edit button
│   │   │                       └── edit/
│   │   │                           ├── page.tsx          ✅ server component
│   │   │                           └── EditMaterialClient.tsx ✅ with delete
│   │   ├── loading/
│   │   │   └── page.tsx                                  ✅ redirects to /dashboard
│   │   ├── api/
│   │   │   └── send-welcome/route.ts                     ✅ welcome email via Resend
│   │   └── auth/
│   │       └── callback/route.ts                         ✅ OAuth code exchange
│   ├── middleware.ts                                      ✅ protects /dashboard + /homes routes
│   └── lib/
│       └── supabase/
│           ├── client.ts                                 ✅ browser client
│           └── server.ts                                 ✅ server client
├── vercel.json                                           ✅
├── next.config.js                                        ✅
├── tailwind.config.ts                                    ✅
├── tsconfig.json                                         ✅
├── postcss.config.js                                     ✅
└── package.json                                          ✅
```

---

## 🔧 Auth Architecture (CRITICAL — hard-won fix)

The auth was completely rebuilt in Session 5 to fix race conditions.

**Key principles:**
- All protected pages are **server components** that call `supabase.auth.getUser()` server-side
- Middleware at `src/middleware.ts` protects `/dashboard` and `/homes` routes — redirects to `/login` if no session
- Client components handle UI only — no auth checks in client components
- `proxy.ts` was deleted — middleware handles everything directly
- Login redirects straight to `/dashboard` after `data.session` is confirmed
- No `/loading` intermediate page needed (it just redirects to `/dashboard` now)
- Never use `getSession()` for auth checks — always use `getUser()`

**Page pattern:**
```
page.tsx (server) → checks auth with getUser() → fetches data → passes to XxxClient.tsx (client UI)
```

---

## 🏗️ Build Phases

### ✅ Phase 0 — Complete
- [x] Product vision, feature spec, design language, tech stack

### ✅ Phase 1a — Foundation Complete
- [x] GitHub repo, Next.js 14, Vercel Pro, live site

### ✅ Phase 1b — Auth Complete
- [x] Supabase + @supabase/ssr (server component architecture)
- [x] Email/password login working (single login, no race conditions)
- [x] Google OAuth working
- [x] Middleware protecting /dashboard and /homes routes
- [x] Welcome email via Resend on signup

### ✅ Phase 1c — Core Flows Complete
- [x] Add Home flow (with Exterior room auto-created)
- [x] Individual home page with photo upload
- [x] Add Room flow
- [x] Room detail page with photo upload
- [x] Add Material flow with photo upload
- [x] Material detail page
- [x] Edit Material flow (edit + delete)
- [x] Dashboard welcome screen
- [x] My Homes page

### ✅ Phase 2a — Photo Upload Complete
- [x] Cloudinary integration (unsigned upload preset)
- [x] Home exterior photo upload
- [x] Room hero photo upload (saves to rooms.photo_url)
- [x] Material photo upload (saves to materials.photo_url)
- [x] Photos display as thumbnails in material lists
- [x] Room cards show photo thumbnails when available
- [x] Photo count tracked in stats

### 📋 Phase 2b — Next
- [ ] AI material detection (OpenAI Vision API)
- [ ] Budget tracker + ROI calculator
- [ ] Shopping list generator + PDF export
- [ ] Homagio Estimate™

### 📋 Phase 3 — Stripe Subscriptions
- [ ] Free/Premium/Pro tiers
- [ ] Stripe Connect for affiliate payouts

### 📋 Phase 4 — Explore + Discovery
- [ ] Mapbox map integration
- [ ] Public home profiles
- [ ] Browse + filter nearby homes
- [ ] Homagio Affiliate Revenue System

### 📋 Phase 5 — Pro Studio
- [ ] Pro user dashboard
- [ ] Client management
- [ ] PDF spec sheet exports

### 📋 Phase 6 — Retention + Growth
- [ ] Email notifications (Resend)
- [ ] Home timeline
- [ ] Maintenance reminders
- [ ] Mobile polish pass (all pages)
- [ ] React Native mobile app

---

## 💰 Affiliate Revenue Model (build in Phase 4)

Homagio operates a single master affiliate account across all retailers.
Every "Shop This Material" link routes through Homagio's affiliate links.

**Commission split options:**
- Option A: 80% homeowner / 20% Homagio
- Option B: 60% homeowner / 40% Homagio
- Option C: Tiered by subscription — Free: 70/30, Premium: 80/20, Pro: 85/15

---

## ⚠️ Important Notes for Claude

- Owner is on Mac, no local terminal experience
- Use GitHub web UI to create/edit files — always use Add File → Create New File
- All files committed directly to main branch
- Vercel Pro auto-deploys every commit to main
- Always use window.location.href for redirects in client components — never useRouter
- All monetary values stored in cents in database
- User roles: 'homeowner' | 'pro' | 'admin'
- Subscription tiers: 'free' | 'premium' | 'pro_studio'
- proxy.ts has been DELETED — do not recreate it
- All page-level auth is handled by middleware + server components

## 📧 Email Architecture
- Provider: Resend (free tier)
- From address: onboarding@resend.dev (until custom domain set up)
- Welcome email fires on signup via /api/send-welcome route

---

## 🚀 How to Start Each New Session

1. Open new chat at claude.ai
2. Paste this entire CLAUDE.md
3. Say what you want to build

---

*Last updated: Session 5 — Auth completely rebuilt with server components + middleware. Photo upload working for homes, rooms, and materials via Cloudinary. Material detail page, edit material flow, and delete material all working.*
*Next session: AI material detection OR Stripe subscriptions*
