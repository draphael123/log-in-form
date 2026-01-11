# FormFlow

A clean, production-ready form management application built with Next.js 14, featuring user authentication, CRUD operations, and a rule-based suggestions engine.

## Features

- ✅ **User Authentication** - Register and login with email/password (bcrypt hashed)
- ✅ **Protected Routes** - Dashboard pages require authentication
- ✅ **Form CRUD** - Create, read, update, and delete form entries
- ✅ **Smart Suggestions** - Rule-based suggestions based on entry content
- ✅ **Responsive Design** - Clean, minimal UI with Tailwind CSS
- ✅ **Server Actions** - Modern Next.js mutations with Zod validation
- ✅ **Vercel Ready** - Optimized for deployment on Vercel

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon/Supabase compatible)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5 (Auth.js) with Credentials provider
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local, Neon, or Supabase)

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your values:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# NextAuth secret - generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret"

# Base URL of your app
NEXTAUTH_URL="http://localhost:3000"
```

#### Database Options

**Option A: Neon (Recommended for production)**
1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard

**Option B: Supabase**
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string (use the "Transaction pooler" for serverless)

**Option C: Local PostgreSQL**
```bash
# Using Docker
docker run --name formflow-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=formflow -p 5432:5432 -d postgres:15
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── api/auth/           # NextAuth API routes
│   ├── dashboard/
│   │   ├── [id]/           # Entry detail/edit page
│   │   ├── new/            # New entry page
│   │   └── page.tsx        # Dashboard (entry list)
│   ├── globals.css         # Global styles & CSS variables
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── actions/
│   ├── auth.actions.ts     # Auth server actions
│   └── form.actions.ts     # Form CRUD server actions
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── delete-entry-button.tsx
│   ├── form-entry-card.tsx
│   ├── form-entry-form.tsx
│   ├── logout-button.tsx
│   └── suggestions-panel.tsx
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client singleton
│   └── suggestions.ts      # Rule-based suggestions engine
├── prisma/
│   └── schema.prisma       # Database schema
└── middleware.ts           # Route protection
```

## Suggestions Engine

The suggestions engine (`lib/suggestions.ts`) provides 3-5 contextual suggestions based on:

- **Category matching**: Different suggestions for Productivity, Health, Admin, Customer Support, Engineering
- **Keyword detection**: Specific suggestions for keywords like "refund", "shipping", "bug", "deadline", etc.

The engine is deterministic and easily extensible - just add new entries to the configuration maps.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add environment variables:
   - `DATABASE_URL` - Your production database URL
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

3. Deploy!

### 3. Run Production Migration

After first deployment, run the migration:

```bash
npx prisma migrate deploy
```

Or add to your build command in `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

## API Reference

### Server Actions

| Action | Description |
|--------|-------------|
| `register(formData)` | Create new user account |
| `login(formData)` | Authenticate user |
| `logout()` | Sign out current user |
| `createFormEntry(formData)` | Create new form entry |
| `updateFormEntry(id, formData)` | Update existing entry |
| `deleteFormEntry(id)` | Delete entry |
| `getFormEntry(id)` | Get single entry by ID |
| `getUserFormEntries()` | Get all entries for current user |

### Suggestions API

```typescript
import { getSuggestions } from '@/lib/suggestions';

const suggestions = getSuggestions({
  title: "Fix shipping delay bug",
  description: "Customer reported delayed shipments",
  category: "Engineering"
});
// Returns: ["Reproduce the issue...", "Check for any shipping restrictions...", ...]
```

## License

MIT

