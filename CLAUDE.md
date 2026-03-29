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
- Token stored in NEXT_PUBLIC_MAPBOX_TOKEN in Vercel
- Also hardcoded in ExploreClient.tsx (public pk. token — safe to commit)
- Token name in Mapbox dashboard: "Homagio App"
- Allowed URL: https://homagio-app.vercel.app
- Default map center: Tulsa, OK [-95.9928, 36.1540], zoom 11
- Use default Mapbox marker with color option — NOT custom HTML elements (causes pin jumping bug)
- Homes need lat + lng columns populated in Supabase to show as pins
- The Blair House: lat=36.0868, lng=-96.0639

---

## 🗄️ Database Tables (all in Supabase)

- **profiles** (id, email, full_name, avatar_url, role, subscription_tier, created_at)
- **homes** (id, user_id, name, address, city, state, zip, lat, lng, year_built, square_feet, bedrooms, bathrooms, value_estimate, photo_url, is_public, created_at)
- **rooms** (id, home_id, name, type, floor, notes, photo_url, created_at)
- **materials** (id, room_id, home_id, name, brand, color, finish, notes, cost, purchase_url, affiliate_url, photo_url, ai_detected, ai_confidence, created_at)
- **photos** (id, home_id, room_id, url, ai_tags, ai_confidence, created_at)
- **budgets** (id, home_id, room_id, project_name, estimated, actual, status, created_at)
- **saved_homes** (id, user_id, home_id, created_at)
- **home_timeline** (id, home_id, event_type, description, cost, event_date, created_at)
- Row Level Security enabled on all tables
- Auto profile creation trigger on new user signup

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
│   │   │   └── page.tsx                                  ✅ Contact form UI (shows success, no email yet)
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
│   │   │   ├── add/page.tsx                              ✅ 2-step form, auto-creates Exterior room
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
│   │   │   └── send-welcome/route.ts                     ✅ welcome email via Resend on signup
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
- [x] Home exterior photo upload — click-to-upload on home detail page, saves to homes.photo_url
- [x] Room hero photo upload — click-to-upload on room detail page, saves to rooms.photo_url
- [x] Material photo upload — upload area on add + edit material forms, saves to materials.photo_url
- [x] Room cards on home detail page show photo thumbnail if available
- [x] Material rows show 52x52 photo thumbnail if available
- [x] Photo count tracked in stats on home and room pages
- [x] All photos stored in Cloudinary under homagio/homes, homagio/rooms, homagio/materials folders

### ✅ Phase 2b — Public/Private Toggle Complete
- [x] is_public column on homes table
- [x] Toggle UI on home detail page (🔒 Private / 🌍 Public)
- [x] Toggling updates homes.is_public in Supabase in real time
- [x] Public homes appear on landing page featured section
- [x] Public homes appear in Explore map and list
- [x] The Blair House (7106 W 51st, Tulsa OK) set to public as first featured home

### ✅ Phase 3a — Explore + Map Complete
- [x] Mapbox GL JS v3.3.0 loaded dynamically in ExploreClient
- [x] Mapbox token: stored in Vercel env + hardcoded in ExploreClient (public token)
- [x] /explore page — full screen map with left panel home list
- [x] Left panel shows all public homes with photo thumbnail, name, city, bed/bath/sqft
- [x] Map pins use default Mapbox marker (blue) — NOT custom HTML (caused pin jumping)
- [x] Click pin → sidebar panel slides in with photo, details, "View Full Home Profile" button
- [x] Click home in left panel → selects it, flies map to location if coords available
- [x] /explore/[homeId] — public home profile page
- [x] Hero photo full width, home name overlaid on gradient
- [x] Stats row: rooms, materials, value, photos
- [x] Rooms section — click room to expand, shows full room photo uncropped
- [x] Materials inside each room — click to expand inline, shows full photo + all details + buy links
- [x] "Catalog My Home Free" CTA throughout public pages
- [x] Homes need lat + lng in Supabase to pin on map (Blair House: 36.0868, -96.0639)

### ✅ Phase 3b — Landing Page + Nav Complete
- [x] Nav links: Catalogue, Explore, FAQs, About Us, Contact
- [x] Desktop: full nav bar with Sign In + Join Free buttons
- [x] Mobile: hamburger menu using HTML details/summary (no JS needed)
- [x] Featured homes section pulls real public homes from Supabase via direct REST fetch
- [x] Featured home cards link to /explore/[homeId]
- [x] "View all →" links to /explore
- [x] Stats section shows real counts (homes, rooms, materials) from Supabase
- [x] Footer links updated: Catalogue, Explore, FAQs, About Us, Contact, Privacy, Terms
- [x] Landing page uses direct fetch() not createClient() to avoid session interference

### ✅ Phase 3c — Public Pages Complete
- [x] /faq — accordion FAQ page, 10 questions covering product, pricing, privacy, what's coming
- [x] /about — About Us page with Blair House origin story, mission, what's coming section
- [x] /contact — Contact form with name, email, subject dropdown, message, success state
- [x] Contact form does NOT send email yet — shows success UI only (wire up Resend next)
- [x] All three pages added as public routes in middleware
- [x] All three pages have consistent nav with logo + explore/faq/about/contact links

### 📋 Phase 3d — Next Up
- [ ] Wire contact form to actually send email via Resend API
- [ ] Public room pages: /explore/[homeId]/rooms/[roomId]
- [ ] Public material pages: /explore/[homeId]/rooms/[roomId]/materials/[materialId]
- [ ] Geocoding — auto-convert home address to lat/lng when home is added (Mapbox geocoding API)
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

**Tech needed:**
- Skimlinks or VigLink for automatic link conversion
- Stripe Connect for homeowner payouts
- Earnings dashboard for homeowners
- Clear ToS disclosing affiliate relationship

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
- **Contact form is UI only** — does not send email yet
- TypeScript: always use `interface PageProps { params: { id: string } }` for dynamic route server components

## 📧 Email Architecture
- Provider: Resend (free tier)
- From address: onboarding@resend.dev (until custom domain set up)
- Welcome email fires on signup via /api/send-welcome route
- Contact form email NOT yet wired — TODO next session

---

## 🚀 How to Start Each New Session

1. Open new chat at claude.ai
2. Paste this entire CLAUDE.md
3. Say what you want to build

---

*Last updated: Session 6 — Explore page with Mapbox map fully working. Public home profiles with expandable rooms and full-size uncropped photos. Landing page nav rebuilt (Catalogue, Explore, FAQs, About Us, Contact) with mobile hamburger menu. FAQ, About, Contact pages built. Featured homes on landing page link to public profiles. All explore links wired throughout app. The Blair House live as first featured home.*

*Next session options: Wire contact form email via Resend, build public room/material pages, add geocoding for map pins, or start budget tracker.*
