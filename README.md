# Restaurant Finder
This is a full-stack Project which I did as a part of CMPE-202 Sysytems Software Engineering Msters Project - Deployed On AWS.

A full-stack web application for discovering, booking, and managing restaurants. Built with Next.js, Prisma, and a modern UI.

## Features

- User authentication and role-based access (admin, business owner, user)
- Restaurant search and filtering
- Booking system with calendar integration
- Admin dashboard for user and restaurant management
- Business owner dashboard for managing listings
- Review and rating system

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL (or your DB)
- **Authentication:** NextAuth.js
- **Other:** Vercel (deployment), Jest (testing), AWS 

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd restaurant-finder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your DB/auth keys.

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Folder Structure

```
src/
  app/                # Next.js app directory (pages, API routes)
  components/         # React components (UI, admin, booking, etc.)
  hooks/              # Custom React hooks
  lib/                # Utility libraries (auth, prisma, etc.)
  utils/              # Helper functions
prisma/               # Prisma schema and migrations
public/               # Static assets
```

