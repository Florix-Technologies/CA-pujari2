# Shobha Pujari - Trading Education Platform

A modern, full-stack trading education website for Shobha Pujari, a Chartered Accountant and trading educator. This platform provides courses, webinars, community features, and comprehensive trading education to beginners and intermediate traders.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Protected Pages & Features](#protected-pages--features)
- [Admin Panel](#admin-panel)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

**Project**: Florix Technologies x Shobha Pujari Trading Education Platform
**Status**: Active Development
**Launch Date**: 2026
**Target Users**: Trading beginners and intermediate traders in India

This is a **Next.js 16** application built with **TypeScript**, offering:
- 📚 Structured courses (6 levels from basic to professional)
- 🎬 Live webinars and recorded sessions
- 👥 Community engagement platform
- 🔐 Secure authentication with Supabase
- 💳 Payment integration (UPI, Razorpay, Paytm, Cards)
- 🎨 Premium UI with Framer Motion animations
- 📊 Admin dashboard for content management

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | ^16.2.1 | React framework with App Router |
| **React** | 19.2.0 | UI library |
| **TypeScript** | ^5 | Type-safe development |
| **Tailwind CSS** | ^4.1.9 | Utility-first CSS framework |
| **Framer Motion** | ^12.23.27 | Advanced animations |
| **Radix UI** | Latest | Headless UI components |
| **Lucide React** | ^0.454.0 | Icon library |
| **GSAP** | ^3.14.2 | Timeline animations |
| **Three.js** | ^0.183.2 | 3D graphics (hero section) |

### Backend & Database
| Technology | Purpose |
|-----------|---------|
| **Supabase** | PostgreSQL database + authentication |
| **Firebase** | Additional auth option (configured) |

### Form & Validation
| Technology | Purpose |
|-----------|---------|
| **React Hook Form** | ^7.60.0 | Efficient form handling |
| **Zod** | 3.25.76 | Schema validation |
| **@hookform/resolvers** | ^3.10.0 | Form resolver integration |

### Components & UI
| Technology | Purpose |
|-----------|---------|
| **Embla Carousel** | 8.5.1 | Carousel component |
| **React Day Picker** | 9.8.0 | Date picker |
| **Recharts** | 2.15.4 | Data visualization |
| **Sonner** | ^1.7.4 | Toast notifications |
| **Input OTP** | 1.4.1 | OTP input component |
| **Vaul** | ^1.1.2 | Drawer component |

### Analytics & Monitoring
| Technology | Purpose |
|-----------|---------|
| **Vercel Analytics** | 1.3.1 | Page performance tracking |
| **Resend** | ^6.10.0 | Email service |

### Dev Tools
| Technology | Purpose |
|-----------|---------|
| **TypeScript** | Type safety |
| **ESLint** | Code quality |
| **PostCSS** | CSS processing |
| **Autoprefixer** | Browser compatibility |

---

               Project Structure
CA-pujari2/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── about/
│   │   └── page.tsx             # About page
│   ├── admin/
│   │   └── page.tsx             # Admin dashboard (CRUD for courses/webinars)
│   ├── api/                     # API routes
│   │   ├── admin-create-user/   # User creation endpoint
│   │   ├── auth/                # Auth endpoints (role checking)
│   │   ├── courses/             # Course CRUD endpoints
│   │   ├── webinars/            # Webinar CRUD endpoints
│   │   ├── community/           # Community posts endpoints
│   │   ├── create-profile/      # User profile creation
│   │   ├── my-dashboard/        # User dashboard data
│   │   └── nse/                 # NSE program endpoints
│   ├── community/
│   │   └── page.tsx             # Community discussion forum
│   ├── contact/
│   │   └── page.tsx             # Contact form page
│   ├── courses/
│   │   └── page.tsx             # Courses listing
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── nse/
│   │   └── page.tsx             # NSE investment programs
│   ├── signup/
│   │   ├── page.tsx             # Signup page
│   │   └── SignupClient.tsx     # Signup form component
│   └── webinars/
│       └── page.tsx             # Webinars page
├── components/                   # React components
│   ├── navigation.tsx           # Header/navbar
│   ├── footer.tsx               # Footer
│   ├── page-transition.tsx      # Page animation wrapper
│   ├── theme-provider.tsx       # Dark/light theme provider
│   ├── theme-toggle.tsx         # Theme switcher
│   ├── community-content.tsx    # Community content component
│   ├── webinar-book-button.tsx  # Booking button
│   ├── community/               # Community-specific components
│   │   ├── FeatureCards.tsx
│   │   ├── HeroScene.tsx
│   │   ├── Navbar.tsx
│   │   ├── PostsSection.tsx
│   │   ├── StatsSection.tsx
│   │   └── UIOverlay.tsx
│   ├── blocks/                  # Page section blocks
│   │   ├── bento-gallery.tsx
│   │   ├── hero-gallery-demo.tsx
│   │   └── hero-gallery-scroll-animation.tsx
│   └── ui/                      # Reusable UI components
│       ├── premium-card.tsx     # Service/course card
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── slider.tsx
│       ├── tabs.tsx
│       ├── service-modals.tsx   # Booking & inquiry modals
│       └── [40+ more Radix components]
├── context/
│   └── AuthContext.tsx          # Global auth state + user role management
├── hooks/
│   ├── use-mobile.ts            # Mobile detection
│   ├── use-mobile.tsx
│   ├── use-toast.ts             # Toast notifications
│   └── useTheme.tsx             # Theme hook (light/dark)
├── lib/
│   ├── animations.ts            # Framer Motion animation presets
│   ├── firebase.ts              # Firebase config
│   ├── supabaseClient.ts        # Supabase client config
│   └── utils.ts                 # Utility functions
├── public/                       # Static assets
│   ├── videos/                  # Hero section videos
│   ├── gallery/                 # Gallery images
│   ├── home_Light/              # Light mode assets
│   ├── home_Dark/               # Dark mode assets
│   └── [images and SVGs]
├── styles/
│   └── globals.css              # Global styles
├── utils/
│   ├── isFirstTimeUser.ts       # First-time user check
│   └── requireAuth.ts           # Auth guard utility
├── next.config.mjs              # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Dependencies
├── pnpm-lock.yaml               # Lock file
├── SQL_SCHEMA_AND_DUMMY_DATA.sql # Database schema
├── COMMUNITY_POSTS_SCHEMA.sql    # Community table schema
├── ADMIN_PANEL_SETUP.md          # Admin setup guide
├── WEBINAR_FIX_GUIDE.md          # Webinar troubleshooting
└── components.json              # Component metadata


```

---

## ✨ Features

### 1. **User Authentication**
- ✅ Supabase authentication (email/password)
- ✅ Firebase auth support
- ✅ Role-based access control (student, instructor, admin)
- ✅ Protected routes with automatic redirects
- ✅ Session persistence

### 2. **Courses & NSE Programs**
- ✅ 6-tier course structure (Basic to Ultimate)
- ✅ Pricing from ₹5,000 to ₹10,00,000
- ✅ Course filtering and display
- ✅ Detailed course information with features list
- ✅ "Enroll Now" buttons with auth protection

### 3. **Webinars & Booking**
- ✅ Live webinar scheduling
- ✅ Webinar booking modal
- ✅ Past session recordings
- ✅ 40-minute sessions
- ✅ Multiple service tiers

### 4. **Community Platform**
- ✅ User discussion forum
- ✅ Post creation and commenting
- ✅ Community statistics dashboard
- ✅ User profiles
- ✅ Real-time interactions

### 5. **Admin Dashboard**
- ✅ Full CRUD for courses
- ✅ Full CRUD for webinars
- ✅ Tabbed interface
- ✅ Real-time data updates
- ✅ Success/error messaging
- ✅ Date/time pickers

### 6. **UI/UX Features**
- ✅ Dark/Light theme support
- ✅ Framer Motion animations
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Premium card designs
- ✅ Loading screens
- ✅ Page transitions
- ✅ Toast notifications

### 7. **Payment Integration**
- ✅ UPI support
- ✅ Razorpay integration
- ✅ Paytm support
- ✅ Credit card payments

### 8. **Smart Redirects**
- ✅ Login redirect with return URL
- ✅ Protected action buttons
- ✅ Unauth → Login → Back to action flow

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: v18+ recommended
- **Package Manager**: pnpm (preferred), npm, or yarn
- **Git**: For version control
- **Supabase Account**: For backend
- **Environment**: Development machine or deployment platform

### Step 1: Clone Repository
```bash
git clone https://github.com/[your-org]/CA-pujari2.git
cd CA-pujari2
```

### Step 2: Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Environment Setup
Create a `.env.local` file in the root directory:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Firebase (optional, if using Firebase auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

### Step 4: Database Setup
1. Go to your [Supabase Dashboard](https://supabase.com)
2. Navigate to SQL Editor
3. Open `SQL_SCHEMA_AND_DUMMY_DATA.sql`
4. Copy and paste into SQL editor
5. Click **Run** to create tables and seed data

### Step 5: Start Development Server
```bash
pnpm dev
```

The app will be available at **http://localhost:3000**

### Step 6: Access Admin Panel
1. Create an account at `/signup`
2. Login at `/login`
3. Navigate to `/admin` (requires authentication)

---

## 🔑 Environment Variables

### Public Variables (exposed to browser)
```env
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Anonymous key for client-side auth
NEXT_PUBLIC_FIREBASE_API_KEY      # Firebase API key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  # Firebase auth domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID   # Firebase project ID
NEXT_PUBLIC_FIREBASE_APP_ID       # Firebase app ID
NEXT_PUBLIC_VERCEL_ANALYTICS_ID   # Analytics tracking ID
```

### Private Variables (server-only)
```env
SUPABASE_SERVICE_ROLE_KEY        # Unrestricted Supabase access (admin operations)
```

---

## 📊 Database Schema

### Courses Table
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  duration VARCHAR(50),
  level VARCHAR(50),
  modules INTEGER,
  price VARCHAR(50),
  students_count INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Webinars Table
```sql
CREATE TABLE webinars (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  starts_at TIMESTAMP,
  duration_minutes INTEGER,
  platform VARCHAR(50),
  price VARCHAR(50),
  seats INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Community Posts Table
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title VARCHAR(255),
  content TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### User Profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email VARCHAR(255),
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP
);
```

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/role` | Get user role |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Fetch all courses |
| POST | `/api/courses` | Create new course |
| PUT | `/api/courses/[id]` | Update course |
| DELETE | `/api/courses/[id]` | Delete course |

### Webinars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/webinars` | Fetch all webinars |
| POST | `/api/webinars` | Create new webinar |
| PUT | `/api/webinars/[id]` | Update webinar |
| DELETE | `/api/webinars/[id]` | Delete webinar |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin-create-user` | Admin user creation |
| POST | `/api/create-profile` | Create user profile |
| GET | `/api/my-dashboard` | Get user dashboard data |

### Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/community/posts` | Fetch community posts |
| POST | `/api/community/posts` | Create new post |
| DELETE | `/api/community/posts/[id]` | Delete post |

### NSE Programs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/nse/programs` | Fetch NSE programs |

---

## 🔐 Authentication Flow

### Login & Redirect System
```
1. User clicks protected button (not authenticated)
   ↓
2. Redirected to /login?redirect=/webinars#core-services
   ↓
3. User inputs credentials
   ↓
4. Supabase verifies credentials
   ↓
5. Session created
   ↓
6. Automatically redirected back to /webinars#core-services
   ↓
7. Button action proceeds (modal opens, etc.)
```

### Protected Actions
```typescript
const handleProtectedAction = (actionCallback: () => void) => {
  if (!user && !authLoading) {
    router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`)
    return
  }
  actionCallback()
}
```

---

## 🛡️ Protected Pages & Features

### Pages Requiring Authentication
- `/admin` - Admin dashboard
- `/my-dashboard` - User dashboard
- Protected actions on `/webinars` and `/nse`

### Components with Auth Protection
- **Webinars Page**: All booking buttons
- **NSE Page**: All "Enroll Now" buttons, "Contact Us" CTA

### How It Works
1. User clicks button without authentication
2. System saves target action + location
3. Redirects to `/login` with `?redirect=` parameter
4. After successful login, returns to exact previous location
5. Protected action executes automatically

---

## 👨‍💼 Admin Panel

### Access
- **URL**: `http://localhost:3000/admin`
- **Requirements**: Must be logged in

### Features
1. **Course Management**
   - Create courses with title, description, duration, level, modules, price
   - Edit existing courses
   - Delete courses
   - Real-time table updates

2. **Webinar Management**
   - Create webinars with title, description, start time, duration, platform, price, seats
   - Edit existing webinars
   - Delete webinars
   - Real-time table updates

3. **User Feedback**
   - Success messages on creation/update
   - Error messages with reasons
   - Loading states during operations

### Usage
```
1. Navigate to /admin
2. Select tab (Courses or Webinars)
3. Fill form fields
4. Click "Create" or "Update"
5. Refresh button to reload data
6. Delete button to remove items
```

---

## 💻 Development Guide

### Running the Project
```bash
# Development server with hot reload
pnpm dev

# Build for production
pnpm build

# Production server
pnpm start

# Lint code
pnpm lint
```

### Key Technologies to Know

#### Framer Motion Animations
Located in `lib/animations.ts`:
```typescript
export const fadeUp = { ... }        // Fade + slide up
export const stagger = { ... }       // Staggered animation
export const premiumFadeUp = { ... } // Premium fade variant
```

#### Theme System
```typescript
const { isLight } = useTheme()     // Get theme
// Apply theme colors based on isLight boolean
```

#### Auth Context
```typescript
const { user, loading, session } = useAuth()
// Use in components for auth checks
```

### Creating New Pages
1. Create file in `app/[page-name]/page.tsx`
2. Use Navigation and Footer components
3. Wrap with PageTransition for animations
4. Import useTheme for theme support
5. Add auth checks if needed

### Creating New Components
1. Create file in `components/` or `components/ui/`
2. Use "use client" if interactive
3. Import Framer Motion for animations
4. Use Tailwind for styling
5. Export as named export

###  Database Queries
Example fetch from API:
```typescript
const response = await fetch('/api/courses')
const { data } = await response.json()
setCourses(data)
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy via Vercel Dashboard
# 1. Connect GitHub repo
# 2. Add environment variables
# 3. Click Deploy
```

### Environment Variables for Production
1. Go to Vercel Project Settings
2. Add all `.env.local` variables
3. Redeploy after adding

### Build Optimization
```bash
# Check build size
pnpm build

# Analyze bundle
next build --analyze
```

### Performance Checklist
- ✅ Images optimized (Next.js Image)
- ✅ Code splitting configured
- ✅ Analytics enabled
- ✅ Caching headers set
- ✅ Database indexes created

---

## 📝 Scripts

```bash
# Development
pnpm dev              # Start dev server

# Production
pnpm build           # Build for production
pnpm start           # Start production server

# Code Quality
pnpm lint            # Run ESLint
pnpm lint --fix      # Fix linting issues

# Database
# SQL files run manually in Supabase dashboard
```

---

## 📚 Key Files Reference

### Configuration
- `next.config.mjs` - Next.js config (image optimization, redirects)
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS themes and plugins
- `postcss.config.mjs` - PostCSS plugins
- `package.json` - Dependencies and scripts

### Core Files
- `app/layout.tsx` - Root layout with AuthProvider
- `context/AuthContext.tsx` - Authentication state management
- `lib/animations.ts` - Animation presets
- `lib/supabaseClient.ts` - Supabase initialization

### Page Files
- `app/page.tsx` - Home landing page
- `app/courses/page.tsx` - Courses listing
- `app/webinars/page.tsx` - Webinars & booking
- `app/nse/page.tsx` - NSE programs
- `app/community/page.tsx` - Community forum
- `app/admin/page.tsx` - Admin dashboard
- `app/login/page.tsx` - Login/signup

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Supabase Connection Issues
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
3. Ensure tables exist in database
4. Check RLS policies allow operations

### Authentication Not Working
1. Verify Supabase auth configuration
2. Check user exists in `auth.users` table
3. Verify profile exists in `profiles` table
4. Check browser cookies/storage for session

### Styling Issues
1. Rebuild Tailwind: `pnpm build`
2. Clear `.next` folder: `rm -rf .next`
3. Restart dev server: `pnpm dev`

---

## 📞 Support & Contact

- **Email**: info@shobhapujari.com
- **Website**: https://florixtechnologies.com/
- **Platform**: https://www.shobhapujari.com

---

## 📄 License

This project is proprietary to Shobha Pujari and Florix Technologies. All rights reserved.

---

## 🙏 Credits

- **Built by**: Florix Technologies
- **Platform**: Shobha Pujari Trading Education
- **Founded**: 2026
- **Status**: Production Ready

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Apr 2026 | Initial release with full CRUD, auth, community |
| - | - | - |

---

**Last Updated**: April 12, 2026

For detailed technical guides, see:
- [Admin Panel Setup](./ADMIN_PANEL_SETUP.md)
- [Webinar Configuration](./WEBINAR_FIX_GUIDE.md)
- [Database Schema](./SQL_SCHEMA_AND_DUMMY_DATA.sql)
