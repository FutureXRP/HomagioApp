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

### Brand Colors
- **Homagio Blue:** `#006aff` (primary actions, links)
- **Homagio Green:** `#3db85a` (CTAs, accents, active states, prices, hover borders)
- **Deep Navy:** `#0D1B2A` (dark cards, hero backgrounds, feature cards, empty states)
- **Navy Mid:** `#112236` (hover state on navy elements)
- **White/Light:** `#f7f9fc` page bg, `#fff` card bg, `#e9edf2` borders

### Typography
- **Font:** DM Sans (Google Fonts) — loaded via @import in every file
- **Weights used:** 400, 500, 600, 700
- Never use system-ui alone — always DM Sans first

### Design Principles
- No emoji anywhere in UI — SVG icons only
- Dark navy cards for feature sections
- Green accent (`#3db85a`) on active states, CTAs, prices, hover borders
- Thin green shimmer line on top of dark navy cards: `linear-gradient(90deg, transparent, rgba(61,184,90,0.4), transparent)`
- Stat cards: white bg + dark navy icon box (44x44, border-radius 12px) + SVG icon in green
- Empty states: dark navy card with green shimmer line
- Green-to-blue gradient accent bar (4px) under hero photos: `linear-gradient(90deg, #3db85a 0%, #006aff 100%)`
- Room cards use dark color variants per room type (kitchen=dark amber, bathroom=dark green, etc.)
- Breadcrumb trail on all public pages (Explore → Home → Room → Material)

### Logo
- **Selected logo:** Image 6 (blue house, green roof, camera lens door, lowercase "homagio")
- **Cloudinary URL:** `https://res.cloudinary.com/dlb0guicc/image/upload/v1774805332/6_wln7y2.png`
- **Known issue:** Logo has too much white space — needs re-crop in Cloudinary
- **Usage:** `<img src={LOGO_URL} alt="homagio" style={{ height: '52px', width: 'auto' }} />`
- **LOGO_URL constant** defined at top of every client file — single line to update when re-cropped
- Used in: DashboardClient, HomesDashboardClient, HomeDetailClient, RoomDetailClient, MaterialDetailClient, PublicHomeClient, PublicRoomClient, PublicMaterialClient, page.tsx

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
- MAPBOX_TOKEN (server-side — env var unreliable, token hardcoded in route.ts)

## ☁️ Cloudinary
- Cloud Name: dlb0guicc
- Upload Preset: HomagioApp (unsigned)
- Folders: homagio/homes, homagio/rooms, homagio/materials
- Upload goes directly from browser to Cloudinary (no server needed)

## 🗺️ Mapbox
- Token hardcoded in ExploreClient.tsx and src/app/api/geocode/route.ts (public token)
- Token: pk.eyJ1IjoidGhlNWJsYWlycyIsImEiOiJjbW5hdmpheXAwbmZsMnFxMWo2bjBpcjdmIn0.Px8zSq6gn-Z3geHSYRB9LA
- Token has URL restriction (homagio-app.vercel.app) — blocks unrestricted server calls
- Default map center: Tulsa, OK [-95.9928, 36.1540], zoom 11
- Use default Mapbox marker with color option — NOT custom HTML elements
- The Blair House: lat=36.0868, lng=-96.0639
- TODO: Create second unrestricted Mapbox token (MAPBOX_GEOCODE_TOKEN)

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
- NOTE: materials.category column added via SQL: `ALTER TABLE materials ADD COLUMN IF NOT EXISTS category text;`

---

## 📁 Current File Structure

```
HomagioApp/
├── src/
│   ├── app/
│   │   ├── page.tsx                                      ✅ landing page — polished, logo, dark navy cards
│   │   ├── globals.css                                   ✅
│   │   ├── layout.tsx                                    ✅
│   │   ├── about/page.tsx                                ✅
│   │   ├── faq/page.tsx                                  ✅
│   │   ├── contact/page.tsx                              ✅ wired to /api/send-contact
│   │   ├── explore/
│   │   │   ├── page.tsx                                  ✅
│   │   │   ├── ExploreClient.tsx                         ✅ Mapbox + blue dot user location
│   │   │   └── [homeId]/
│   │   │       ├── page.tsx                              ✅
│   │   │       ├── PublicHomeClient.tsx                  ✅ POLISHED — links to room/material pages
│   │   │       └── rooms/
│   │   │           └── [roomId]/
│   │   │               ├── page.tsx                      ✅ NEW — public room server component
│   │   │               ├── PublicRoomClient.tsx          ✅ NEW — public room page, full design system
│   │   │               └── materials/
│   │   │                   └── [materialId]/
│   │   │                       ├── page.tsx              ✅ NEW — public material server component
│   │   │                       └── PublicMaterialClient.tsx ✅ NEW — public material page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx                            ✅
│   │   │   └── signup/page.tsx                           ✅
│   │   ├── dashboard/
│   │   │   ├── page.tsx                                  ✅ fetches homes, stats, recent materials
│   │   │   ├── DashboardClient.tsx                       ✅ POLISHED
│   │   │   └── homes/
│   │   │       ├── page.tsx                              ✅
│   │   │       └── HomesDashboardClient.tsx              ✅ POLISHED
│   │   ├── homes/
│   │   │   ├── add/page.tsx                              ✅ geocoding + autocomplete UI
│   │   │   └── [id]/
│   │   │       ├── page.tsx                              ✅
│   │   │       ├── HomeDetailClient.tsx                  ✅ POLISHED
│   │   │       └── rooms/
│   │   │           ├── add/page.tsx                      ✅
│   │   │           └── [roomId]/
│   │   │               ├── page.tsx                      ✅
│   │   │               ├── RoomDetailClient.tsx          ✅ POLISHED
│   │   │               └── materials/
│   │   │                   ├── add/page.tsx              ✅
│   │   │                   └── [materialId]/
│   │   │                       ├── page.tsx              ✅
│   │   │                       ├── MaterialDetailClient.tsx  ✅ POLISHED
│   │   │                       └── edit/
│   │   │                           ├── page.tsx          ✅
│   │   │                           └── EditMaterialClient.tsx ✅
│   │   ├── loading/page.tsx                              ✅
│   │   ├── api/
│   │   │   ├── send-welcome/route.ts                     ✅
│   │   │   ├── send-contact/route.ts                     ✅
│   │   │   └── geocode/route.ts                          ✅
│   │   └── auth/callback/route.ts                        ✅
│   ├── middleware.ts                                      ✅
│   └── lib/supabase/
│       ├── client.ts                                     ✅
│       └── server.ts                                     ✅
```

---

## 🔧 Auth Architecture (CRITICAL — do not change)

- All protected pages are server components calling `supabase.auth.getUser()` server-side
- Middleware protects `/dashboard` and `/homes` — redirects to `/login` if no session
- Public routes bypass ALL Supabase processing in middleware
- Never use `getSession()` — always use `getUser()`
- Landing page uses direct REST fetch (not createClient) to avoid session interference
- `proxy.ts` is DELETED — do not recreate
- Always use `window.location.href` for redirects in client components — never useRouter

**Public routes:** `/`, `/explore/*`, `/about`, `/faq`, `/contact`, `/auth/*`, `/api/*`, `/loading`
**Protected routes:** `/dashboard/*`, `/homes/*`

---

## 🏗️ Build Phases

### ✅ Phases 0–3d — Complete
All foundation, auth, core flows, photo upload, public/private, Explore map, landing page, public pages, geocoding, contact form

### ✅ Phase UI Polish — Complete (Session 8)
Full design system across all pages. See design language section above.

### ✅ Phase 3e — Public Room & Material Pages Complete (Session 9)
- [x] `/explore/[homeId]/rooms/[roomId]` — public room page with breadcrumb, stats, material list
- [x] `/explore/[homeId]/rooms/[roomId]/materials/[materialId]` — public material page
- [x] PublicHomeClient updated — "View page →" button on room cards, material rows are links
- [x] All public pages match full design system (DM Sans, green accents, dark navy, no emoji)
- [x] Each public page has dark navy CTA driving signups

### 📋 Next Up — Pro Studio (Phase 7)
Key decision needed before building: **Do pros sign up differently, or upgrade from existing accounts?**
- Option A: Separate signup flow → `/pro/signup` → creates pro profile
- Option B: Existing users upgrade via settings → role changes to 'pro'
Recommendation: Option B is simpler to build and avoids duplicate auth flows.

Pro Studio features to build:
- [ ] Pro dashboard at `/pro/dashboard`
- [ ] Client management — add clients, link their homes
- [ ] Portfolio view — showcase completed projects publicly
- [ ] Pro badge on public home profiles
- [ ] PDF spec sheet exports
- [ ] Middleware update to protect `/pro/*` routes

### 📋 Phase 4 — Core Product Features
- [ ] Budget tracker
- [ ] ROI calculator
- [ ] Shopping list generator
- [ ] PDF export
- [ ] Homagio Estimate™

### 📋 Phase 5 — AI Features
- [ ] AI material detection — OpenAI Vision API

### 📋 Phase 6 — Stripe + Monetization
- [ ] Stripe subscriptions
- [ ] Stripe Connect + affiliate payouts

### 📋 Phase 8 — Retention + Growth
- [ ] Custom domain for Resend
- [ ] Home timeline, maintenance reminders

### 📋 Phase 9 — Polish + Mobile
- [ ] Logo re-crop — remove white space, upload new version, update LOGO_URL in all files
- [ ] Fix address autocomplete — create unrestricted Mapbox token
- [ ] Mobile responsive pass
- [ ] React Native app

---

## ⚠️ Important Notes for Claude

- Owner is on Mac, no local terminal experience
- Use GitHub web UI — type full path in filename box, GitHub auto-creates folders
- When creating deeply nested files, type path like: `src/app/explore/[homeId]/rooms/[roomId]/page.tsx`
- All files committed directly to main branch
- Vercel Pro auto-deploys every commit to main
- **Always deliver code as downloadable files** — not pasted in chat
- **Always provide full file paths**
- **page.tsx is a server component** — never add onMouseEnter/onMouseLeave or React event handlers
- **NEXT_PUBLIC_ env vars don't load reliably server-side** — hardcode public tokens
- **Set spread TypeScript fix** — use `Array.from(new Set(...))` not `[...new Set(...)]`
- All monetary values stored in cents in database
- User roles: 'homeowner' | 'pro' | 'admin'
- Subscription tiers: 'free' | 'premium' | 'pro_studio'

## 📧 Email Architecture
- Provider: Resend (free tier)
- From: onboarding@resend.dev (until custom domain)
- Blocked until custom domain added to Resend

---

## 🚀 How to Start Each New Session

1. Open new chat at claude.ai
2. Paste this entire CLAUDE.md
3. Say what you want to build

---

*Last updated: Session 9 — Built public room pages (/explore/[homeId]/rooms/[roomId]) and public material pages (/explore/[homeId]/rooms/[roomId]/materials/[materialId]). Updated PublicHomeClient with "View page →" links on room cards and clickable material rows. All public pages match full design system. Breadcrumb navigation on all public pages. Dark navy CTA on every public page driving signups. Next session: Pro Studio (decide on upgrade vs separate signup flow first) or Budget Tracker.*
