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
- NEXT_PUBLIC_MAPBOX_TOKEN

## ☁️ Cloudinary
- Cloud Name: dlb0guicc
- Upload Preset: HomagioApp (unsigned)
- Folders: homagio/homes, homagio/rooms, homagio/materials
- Upload goes directly from browser to Cloudinary (no server needed)

## 🗺️ Mapbox
- Token: stored in NEXT_PUBLIC_MAPBOX_TOKEN in Vercel
- Also hardcoded in ExploreClient.tsx (public pk. token — safe to commit)
- Token name in Mapbox dashboard: "Homagio App"
- Allowed URL: https://homagio-app.vercel.app
- Default map center: Tulsa, OK [-95.9928, 36.1540]
- Use default Mapbox marker (NOT custom HTML elements) to avoid pin jumping bug
- Homes need lat/lng in Supabase to show as pins
- The Blair House: lat=36.0868, lng=-96.0639

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
│   │   ├── page.tsx                                      ✅ landing page (server, fault-tolerant fetch)
│   │   ├── globals.css                                   ✅
│   │   ├── layout.tsx                                    ✅
│   │   ├── about/page.tsx                                ✅ About Us page
│   │   ├── faq/page.tsx                                  ✅ FAQ page (accordion)
│   │   ├── contact/page.tsx                              ✅ Contact page (form UI, no email yet)
│   │   ├── explore/
│   │   │   ├── page.tsx                                  ✅ server component
│   │   │   ├── ExploreClient.tsx                         ✅ Mapbox map + sidebar panel
│   │   │   └── [homeId]/
│   │   │       ├── page.tsx                              ✅ server component
│   │   │       └── PublicHomeClient.tsx                  ✅ expandable rooms + materials
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx                            ✅ working
│   │   │   └── signup/page.tsx                           ✅ working
│   │   ├── dashboard/
│   │   │   ├── page.tsx                                  ✅ server component
│   │   │   ├── DashboardClient.tsx                       ✅ Explore link active
│   │   │   └── homes/
│   │   │       ├── page.tsx                              ✅ server component
│   │   │       └── HomesDashboardClient.tsx              ✅ client UI
│   │   ├── homes/
│   │   │   ├── add/page.tsx                              ✅ with Exterior auto-create
│   │   │   └── [id]/
│   │   │       ├── page.tsx                              ✅ server component
│   │   │       ├── HomeDetailClient.tsx                  ✅ photo upload + public toggle
│   │   │       └── rooms/
│   │   │           ├── add/page.tsx                      ✅ working
│   │   │           └── [roomId]/
│   │   │               ├── page.tsx                      ✅ server component
│   │   │               ├── RoomDetailClient.tsx          ✅ room photo upload
│   │   │               └── materials/
│   │   │                   ├── add/page.tsx              ✅ with photo upload
│   │   │                   └── [materialId]/
│   │   │                       ├── page.tsx              ✅ server component
│   │   │                       ├── MaterialDetailClient.tsx ✅ with edit button
│   │   │                       └── edit/
│   │   │                           ├── page.tsx          ✅ server component
│   │   │                           └── EditMaterialClient.tsx ✅ edit + delete
│   │   ├── loading/page.tsx                              ✅ redirects to /dashboard
│   │   ├── api/send-welcome/route.ts                     ✅ welcome email via Resend
│   │   └── auth/callback/route.ts                        ✅ OAuth code exchange
│   ├── middleware.ts                                      ✅ protects /dashboard + /homes
│   └── lib/
│       └── supabase/
│           ├── client.ts                                 ✅ browser client
│           └── server.ts                                 ✅ server client
├── vercel.json                                           ✅
├── next.config.js                                        ✅
├── tailwind.config.ts                                    ✅
└── package.json                                          ✅
```

---

## 🔧 Auth Architecture (CRITICAL — hard-won fix)

**Key principles:**
- All protected pages are **server components** that call `supabase.auth.getUser()` server-side
- Middleware protects `/dashboard` and `/homes` routes
- Public routes bypass ALL Supabase processing in middleware (no getUser, no cookie touching)
- Client components handle UI only — no auth checks
- Login redirects straight to `/dashboard` after `data.session` confirmed
- proxy.ts has been DELETED — do not recreate it

**Public routes (middleware bypasses entirely):**
`/`, `/explore`, `/about`, `/faq`, `/contact`, `/auth`, `/api`, `/loading`

**Protected routes (redirect to /login if no session):**
`/dashboard`, `/homes`

**Page pattern:**
```
page.tsx (server) → getUser() → fetch data → pass to XxxClient.tsx (client UI)
```

**Known issue:** Clicking the homagio logo from dashboard to `/` sometimes logs the user out. Deferred to Bolt.new for debugging with live environment access.

---

## 🏗️ Build Phases

### ✅ Complete
- Phase 0 — Product vision
- Phase 1a — Foundation (GitHub, Next.js, Vercel)
- Phase 1b — Auth (Supabase SSR, email + Google OAuth)
- Phase 1c — Core flows (homes, rooms, materials)
- Phase 2a — Photo upload (Cloudinary for homes, rooms, materials)
- Phase 2b — Material detail, edit, delete
- Phase 3a — Explore (Mapbox map, public home profiles, expandable rooms/materials)
- Phase 3b — Landing page nav (Catalogue, Explore, FAQs, About Us, Contact)
- Phase 3c — Public pages (FAQ accordion, About story, Contact form UI)

### 📋 Next Up
- [ ] Wire contact form to actually send email via Resend
- [ ] Public room pages `/explore/[homeId]/rooms/[roomId]`
- [ ] Public material pages `/explore/[homeId]/rooms/[roomId]/materials/[materialId]`
- [ ] Geocoding — auto-convert home addresses to lat/lng for map pins
- [ ] Budget tracker + ROI calculator
- [ ] Homagio Estimate™
- [ ] AI material detection (OpenAI Vision)
- [ ] Stripe subscriptions (Free/Premium/Pro)
- [ ] Pro Studio
- [ ] Mobile polish pass
- [ ] React Native app

### 📋 Known Issues to Fix with Bolt.new
- Clicking homagio logo from dashboard sometimes logs user out
- Navigation from landing page while logged in behaves inconsistently

---

## 💰 Affiliate Revenue Model (build later)

Homagio operates a single master affiliate account.
Every "Shop This Material" link routes through Homagio's affiliate links.

**Commission split options:**
- Option A: 80% homeowner / 20% Homagio
- Option B: 60% homeowner / 40% Homagio
- Option C: Tiered — Free: 70/30, Premium: 80/20, Pro: 85/15

---

## ⚠️ Important Notes for Claude

- Owner is on Mac, no local terminal
- Use GitHub web UI — Add File → Create New File (never pencil edit for new files)
- All files committed directly to main branch
- Vercel Pro auto-deploys every commit to main
- Always use `window.location.href` for redirects in client components
- All monetary values stored in cents in database
- User roles: 'homeowner' | 'pro' | 'admin'
- Subscription tiers: 'free' | 'premium' | 'pro_studio'
- **Never use custom HTML elements for Mapbox markers** — use default marker with `color:` option
- **Landing page uses direct REST fetch, NOT createClient()** — prevents session interference
- **Contact form is UI only** — doesn't send email yet, shows success state

---

## 🚀 How to Start Each New Session

1. Open new chat at claude.ai
2. Paste this entire CLAUDE.md
3. Say what you want to build

---

*Last updated: Session 6 — Explore page with Mapbox map built and working. Public home profiles with expandable rooms and materials. Landing page nav overhauled (Catalogue, Explore, FAQs, About Us, Contact). FAQ, About, and Contact pages built. Featured homes on landing page link to public profiles. All explore links wired throughout app.*

*Next session: Wire contact form email, public room/material pages, geocoding for map pins, or budget tracker.*
