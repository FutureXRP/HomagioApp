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
- **Homagio Green:** `#3db85a` (CTAs, accents, active states, prices)
- **Deep Navy:** `#0D1B2A` (dark cards, hero backgrounds, feature cards)
- **Navy Mid:** `#112236` (hover state on navy elements)
- **White/Light:** `#f7f9fc` page bg, `#fff` card bg, `#e9edf2` borders

### Typography
- **Font:** DM Sans (Google Fonts) — loaded via @import in every file
- **Weights used:** 400, 500, 600, 700
- Never use system-ui alone — always DM Sans first

### Design Principles
- No emoji anywhere in UI — use SVG icons only
- Dark navy cards for feature sections (dashboard, landing page features)
- Green accent (`#3db85a`) on active states, CTAs, prices, hover borders
- Thin green shimmer line on top of dark navy cards: `linear-gradient(90deg, transparent, rgba(61,184,90,0.4), transparent)`
- Stat cards: white bg + dark navy icon box (44x44, border-radius 12px) + SVG icon in green
- Empty states: dark navy card with green shimmer line on top
- Green-to-blue gradient accent bar (4px) under hero photos: `linear-gradient(90deg, #3db85a 0%, #006aff 100%)`
- Room cards use dark color variants per room type (kitchen=dark amber, bathroom=dark green, etc.)

### Logo
- **Selected logo:** Image 6 (blue house, green roof, camera lens door, lowercase "homagio")
- **Cloudinary URL:** `https://res.cloudinary.com/dlb0guicc/image/upload/v1774805332/6_wln7y2.png`
- **Known issue:** Logo has too much white space — needs to be re-cropped in Cloudinary for proper sizing
- **Usage:** `<img src={LOGO_URL} alt="homagio" style={{ height: '52px', width: 'auto' }} />`
- **LOGO_URL constant** is defined at the top of every client file — single line to update when re-cropped
- Used in: DashboardClient, HomesDashboardClient, HomeDetailClient, RoomDetailClient, MaterialDetailClient, page.tsx (landing)

### Brand name: homagio (lowercase logo)
### Flagship product term: "Homagio Estimate™"
### NOTE: Full design polish pass completed Session 8 — all interior pages and landing page unified

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
- Token hardcoded in ExploreClient.tsx and src/app/api/geocode/route.ts (public token — safe)
- Token: pk.eyJ1IjoidGhlNWJsYWlycyIsImEiOiJjbW5hdmpheXAwbmZsMnFxMWo2bjBpcjdmIn0.Px8zSq6gn-Z3geHSYRB9LA
- Token has URL restriction (homagio-app.vercel.app) — blocks unrestricted server calls
- Default map center: Tulsa, OK [-95.9928, 36.1540], zoom 11
- Use default Mapbox marker with color option — NOT custom HTML elements
- The Blair House: lat=36.0868, lng=-96.0639
- TODO: Create second unrestricted Mapbox token for geocoding API (MAPBOX_GEOCODE_TOKEN)

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
- NOTE: materials.category column was added via SQL: `ALTER TABLE materials ADD COLUMN IF NOT EXISTS category text;`

---

## 📁 Current File Structure

```
HomagioApp/
├── src/
│   ├── app/
│   │   ├── page.tsx                                      ✅ landing page — polished, logo, dark navy feature cards, no emoji
│   │   ├── globals.css                                   ✅
│   │   ├── layout.tsx                                    ✅
│   │   ├── about/page.tsx                                ✅
│   │   ├── faq/page.tsx                                  ✅
│   │   ├── contact/page.tsx                              ✅ wired to /api/send-contact
│   │   ├── explore/
│   │   │   ├── page.tsx                                  ✅
│   │   │   ├── ExploreClient.tsx                         ✅ Mapbox map + blue dot user location
│   │   │   └── [homeId]/
│   │   │       ├── page.tsx                              ✅
│   │   │       └── PublicHomeClient.tsx                  ✅
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx                            ✅
│   │   │   └── signup/page.tsx                           ✅
│   │   ├── dashboard/
│   │   │   ├── page.tsx                                  ✅ fetches homes, stats, recent materials
│   │   │   ├── DashboardClient.tsx                       ✅ POLISHED — dark cards, stats bar, homes snapshot, recent materials
│   │   │   └── homes/
│   │   │       ├── page.tsx                              ✅
│   │   │       └── HomesDashboardClient.tsx              ✅ POLISHED — real photos, SVG icons, green accents
│   │   ├── homes/
│   │   │   ├── add/page.tsx                              ✅ geocoding + address autocomplete UI
│   │   │   └── [id]/
│   │   │       ├── page.tsx                              ✅
│   │   │       ├── HomeDetailClient.tsx                  ✅ POLISHED — dark room cards, SVG icons, green accents
│   │   │       └── rooms/
│   │   │           ├── add/page.tsx                      ✅
│   │   │           └── [roomId]/
│   │   │               ├── page.tsx                      ✅
│   │   │               ├── RoomDetailClient.tsx          ✅ POLISHED — room color cards, SVG icons, green accents
│   │   │               └── materials/
│   │   │                   ├── add/page.tsx              ✅
│   │   │                   └── [materialId]/
│   │   │                       ├── page.tsx              ✅
│   │   │                       ├── MaterialDetailClient.tsx  ✅ POLISHED — green cost, dark AI card, SVG edit icon
│   │   │                       └── edit/
│   │   │                           ├── page.tsx          ✅
│   │   │                           └── EditMaterialClient.tsx ✅
│   │   ├── loading/page.tsx                              ✅
│   │   ├── api/
│   │   │   ├── send-welcome/route.ts                     ✅
│   │   │   ├── send-contact/route.ts                     ✅
│   │   │   └── geocode/route.ts                          ✅ token hardcoded (public)
│   │   └── auth/callback/route.ts                        ✅
│   ├── middleware.ts                                      ✅
│   └── lib/supabase/
│       ├── client.ts                                     ✅
│       └── server.ts                                     ✅
└── package.json                                          ✅
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
All foundation, auth, core flows, photo upload, public/private toggle, Explore map, landing page, public pages, geocoding, contact form

### ✅ Phase 3e (partial) — Complete
- [x] Geocoding API route + address autocomplete UI (token restriction blocks full autocomplete)
- [x] Blue dot user location on Explore map
- [x] Contact form wired to Resend (blocked until custom domain)

### ✅ Phase UI Polish — Complete (Session 8)
- [x] Unified design system: DM Sans, #3db85a green, #0D1B2A navy, SVG icons, no emoji
- [x] Logo selected (Image 6) and integrated across all pages
- [x] DashboardClient — dark feature cards, stats bar, homes snapshot, recent materials
- [x] HomesDashboardClient — real home photos, SVG stats, green hovers
- [x] HomeDetailClient — dark room cards with room-type colors and SVG icons
- [x] RoomDetailClient — room color on photo placeholder, SVG icons, dark empty states
- [x] MaterialDetailClient — green cost display, dark AI card, SVG edit icon
- [x] Landing page — logo, dark navy feature grid, quick links as dark cards, no emoji
- [ ] Logo re-crop needed — too much white space around current image

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

### 📋 Phase 7 — Pro Studio
- [ ] Pro user dashboard
- [ ] Client management + portfolio

### 📋 Phase 8 — Retention + Growth
- [ ] Custom domain for Resend (unlocks contact form + welcome emails to any address)
- [ ] Home timeline, maintenance reminders

### 📋 Phase 9 — Polish + Mobile
- [ ] Logo re-crop — remove white space, upload to Cloudinary, update LOGO_URL in all 6 files
- [ ] Fix address autocomplete — create unrestricted Mapbox token
- [ ] Mobile responsive pass
- [ ] React Native app
- [ ] Fix login logo-click logout bug (defer to Bolt.new)

---

## ⚠️ Important Notes for Claude

- Owner is on Mac, no local terminal experience
- Use GitHub web UI — Add File → Create New File for new files
- All files committed directly to main branch
- Vercel Pro auto-deploys every commit to main
- **Always deliver code as downloadable files** — not pasted in chat
- **Always provide full file paths** (e.g. `src/app/dashboard/DashboardClient.tsx`)
- **page.tsx is a server component** — never add onMouseEnter/onMouseLeave or any React event handlers to it
- **NEXT_PUBLIC_ env vars don't load reliably server-side** — hardcode public tokens in server files
- **Set spread on TypeScript** — use `Array.from(new Set(...))` not `[...new Set(...)]`
- All monetary values stored in cents in database
- User roles: 'homeowner' | 'pro' | 'admin'
- Subscription tiers: 'free' | 'premium' | 'pro_studio'
- TypeScript: use `interface PageProps { params: { id: string } }` for dynamic route server components

## 📧 Email Architecture
- Provider: Resend (free tier)
- From: onboarding@resend.dev (until custom domain)
- Welcome email: /api/send-welcome
- Contact form: /api/send-contact (2 emails: owner + sender confirmation)
- Blocked until custom domain added to Resend

---

## 🚀 How to Start Each New Session

1. Open new chat at claude.ai
2. Paste this entire CLAUDE.md
3. Say what you want to build

---

*Last updated: Session 8 — Full design polish pass completed. Unified design system across all pages: DM Sans font, #3db85a Homagio Green, #0D1B2A Deep Navy, SVG icons (no emoji anywhere), logo image in all navs. Logo selected (Image 6, blue house + green roof). DashboardClient expanded with stats bar, homes snapshot, and recent materials section. All 5 interior pages polished. Landing page updated with dark navy feature cards, logo, green accents. Known issue: logo needs re-crop to remove white space padding.*

*Next session options: Re-crop logo, build budget tracker (Phase 4), fix address autocomplete with unrestricted Mapbox token, set up custom domain for Resend emails, or start Pro Dashboard.*
