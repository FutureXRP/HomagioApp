# HOMAGIO — PROJECT CONTEXT FOR CLAUDE

> Paste this file at the start of every new Claude session.
> At the end of each session, ask Claude: "Update my CLAUDE.md to reflect what we built today."

---

## 🌐 Live URLs
- **GitHub:** https://github.com/FutureXRP/HomagioApp
- **Vercel (Live Site):** [paste your Vercel URL here]

---

## 🏠 What Is Homagio

Homagio is a **Home Intelligence Platform** — the "Home Operating System."
Positioning: Zillow + Pinterest + Houzz + Excel + AI, combined into one platform.

It is NOT just a listing app or a design app. It gives homeowners and professionals
a fully interactive, data-rich digital twin of any home.

**Two user types:**
1. Homeowners — track, improve, plan, and shop their home
2. Pro Users (Designers, Builders, Realtors) — manage clients, showcase portfolios

---

## 🎨 Design Language

- Style: Zillow-inspired (clean, white, minimal, trustworthy)
- Primary color: #006aff (Zillow blue)
- Typography: System sans-serif, clean hierarchy
- UI patterns: Zillow-style tabs, property cards with data pills,
  white backgrounds, light gray borders (#e5e5e5)
- Brand name: homagio (lowercase logo, blue accent on "agio")
- Flagship product term: "Homagio Estimate™" (like Zillow's Zestimate)

---

## 💡 Core Features (Full Spec)

### Homeowner Features
- Multi-home management (Free: 2 homes, Premium: unlimited)
- Address search (Zillow-style) + manual entry
- Ownership claim system + dispute submission + admin review
- Digital Twin / Home Catalog:
  - Interior rooms + exterior areas
  - Materials (flooring, countertops, paint, fixtures)
  - Colors, brands, finishes, notes per item
  - Organized by room and category
  - Image-based tracking per space
- Photo upload + AI material/style/furniture detection
  - Confidence scores + manual override
  - Image gallery per room/home
- Smart shopping list generator (PDF/CSV export)
- Affiliate link system (admin-controlled)
- "Buy This Look" functionality
- Budget tracker (per room, per project, full home)
- Estimated vs actual spend tracking
- Renovation ROI calculator
- Homagio Estimate™ (home value estimate)
- Material usage + spend analytics
- Project completion tracking

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
- [ ] Supabase project created and configured
- [ ] Environment variables set up (.env.local)
- [ ] Supabase client created (src/lib/supabase.ts)
- [ ] Database schema designed and migrated
- [ ] User sign up page (src/app/(auth)/signup/page.tsx)
- [ ] User sign in page (src/app/(auth)/login/page.tsx)
- [ ] Google OAuth configured
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
