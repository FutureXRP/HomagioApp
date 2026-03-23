# HOMAGIO — PROJECT CONTEXT FOR CLAUDE

> Paste this file at the start of every new Claude session.
> At the end of each session, ask Claude: "Update my CLAUDE.md to reflect what we built today."

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

## ⚙️ Tech Stack (Decided)

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

### ✅ Phase 0 — Complete (This Conversation)
- Product vision defined
- Full feature spec documented
- Design language established (Zillow-style)
- Landing page built (HTML — Zillow-style, fully designed)
- Tech stack decided
- CLAUDE.md created

### 🔨 Phase 1 — MVP (Start Here Next Session)
- [ ] GitHub repo created + Next.js project scaffolded
- [ ] Supabase project created + auth configured
- [ ] Database schema + Prisma migrations
- [ ] Onboarding wizard (3-step: address → photos → first material)
- [ ] Add Home flow
- [ ] Basic material catalog UI (room-by-room)
- [ ] Stripe Free/Premium subscription integration
- [ ] Deploy to Vercel (live URL)

### 📋 Phase 2 — Core Product
- [ ] Photo upload + AI material detection (OpenAI Vision)
- [ ] Budget tracker + ROI calculator
- [ ] Shopping list generator + PDF export
- [ ] Affiliate link system
- [ ] Homagio Estimate™ (home value display)
- [ ] Home dashboard (full stats view)

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

## 🔑 Key Decisions Made

- Supabase over Firebase (better PostgreSQL support, generous free tier)
- Next.js App Router over Pages Router (modern, better performance)
- Zillow design language (white, clean, trustworthy — not a dark luxury theme)
- Pro Studio free for first 6 months to seed catalog content (network effect strategy)
- Build web first, mobile app in Phase 5
- SEO-indexed home pages are a Phase 3 priority (organic growth engine)
- Onboarding wizard is the #1 MVP priority (retention from day one)
- shadcn/ui for components (saves weeks of UI work)

---

## ⚠️ Important Notes for Claude

- Always use Tailwind CSS utility classes, never inline styles
- Always use Supabase client from /lib/supabase.ts
- Always use Prisma client from /lib/prisma.ts
- API routes live in /app/api/ (Next.js App Router convention)
- Environment variables go in .env.local (never commit this file)
- All monetary values stored in cents (integer) in database
- User roles: 'homeowner' | 'pro' | 'admin'
- Subscription tiers: 'free' | 'premium' | 'pro_studio'
- Home visibility: 'private' | 'public' | 'friends'
- Always add loading states and error handling to every component
- Always make components mobile-responsive

---

## 📁 Project File Structure (Target)

```
homagio/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── homes/
│   │   │   ├── [id]/
│   │   │   └── add/
│   │   ├── catalog/
│   │   ├── budget/
│   │   ├── shopping/
│   │   └── explore/
│   ├── (pro)/
│   │   └── studio/
│   ├── (marketing)/
│   │   ├── page.tsx        ← Landing page
│   │   └── pricing/
│   └── api/
│       ├── homes/
│       ├── materials/
│       ├── budget/
│       ├── ai/detect/
│       └── stripe/
├── components/
│   ├── ui/                 ← shadcn components
│   ├── homes/
│   ├── catalog/
│   ├── budget/
│   └── shared/
├── lib/
│   ├── supabase.ts
│   ├── prisma.ts
│   ├── stripe.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local              ← NEVER COMMIT
├── CLAUDE.md               ← THIS FILE
└── package.json
```

---

## 🚀 How to Start Each Session With Claude

**Option A — Claude.ai (browser):**
1. Open a new chat at claude.ai
2. Paste this entire CLAUDE.md file
3. Paste any relevant code files you're working on
4. Say: "I want to build [next item from Phase X checklist]"

**Option B — Claude Code (terminal, recommended):**
1. cd into your homagio project folder
2. Type: claude
3. Claude Code reads this file automatically
4. Say what you want to build

**End of every session:**
Ask Claude: "Update my CLAUDE.md to reflect what we built today."
Save the updated file to your repo and push to GitHub.

---

## 📞 Session Start Template (Copy This)

```
Here is my project context:
[paste CLAUDE.md]

Here is the file I'm currently working on:
[paste relevant code file]

Today I want to build:
[specific feature from the phase checklist]
```

---

*Last updated: Session 1 — Project kickoff, design complete, ready to build Phase 1*
*Next session: Set up GitHub repo + Next.js scaffold + Supabase auth*
