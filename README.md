This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- Google OAuth authentication with NextAuth.js 5.0
- User management with Neon PostgreSQL database
- Story creation and management
- Session-based authentication

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database account
- Google OAuth credentials

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a Neon PostgreSQL database at [neon.tech](https://neon.tech)
2. Run the SQL schema from `schema.sql` in your Neon console to create the required tables:
   - `users` table for storing user information
   - `stories` table for storing user stories

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. For "Authorized redirect URIs", add:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### 4. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the environment variables:
   ```env
   # Generate with: openssl rand -base64 32
   AUTH_SECRET=your-generated-secret-here
   
   # For development
   AUTH_URL=http://localhost:3000
   
   # From Google Cloud Console
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # From Neon dashboard
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```

### 5. Generate AUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Usage

### Authentication

- Click "Sign In" in the header to authenticate with Google
- Once signed in, your profile picture and name will appear in the header
- Click "Sign Out" to log out

### Creating Stories

1. Navigate to "New Story" from the header
2. Fill in the story details:
   - Title (required)
   - Description (optional)
   - Start date/time
   - End date/time
3. Click "등록하기" to create the story
4. You must be logged in to create stories

### User Management

The system automatically:
- Creates a new user record on first login
- Updates user information (name, profile picture) on each login
- Associates all stories with the logged-in user
- Maintains user sessions across page refreshes

## Project Structure

```
src/
├── app/
│   ├── actions/
│   │   ├── createNewStory.ts    # Story creation with auth
│   │   ├── signIn.ts            # Google sign-in action
│   │   ├── signOut.ts           # Sign-out action
│   │   └── userActions.ts       # User database operations
│   ├── layout.tsx               # Root layout with header
│   └── new/
│       └── page.tsx             # Story creation form
├── auth.ts                      # NextAuth configuration
├── components/
│   └── custom/
│       └── HeaderAuth.tsx       # Auth status component
└── types/
    └── next-auth.d.ts          # NextAuth type extensions
```

## Database Schema

### Users Table
```sql
- id (TEXT, PRIMARY KEY) - OAuth provider user ID
- email (TEXT, UNIQUE, NOT NULL)
- name (TEXT)
- image (TEXT) - Profile picture URL
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Stories Table
```sql
- id (UUID, PRIMARY KEY)
- title (TEXT, NOT NULL)
- description (TEXT)
- start_at (TIMESTAMP, NOT NULL)
- end_at (TIMESTAMP, NOT NULL)
- user_id (TEXT, FOREIGN KEY → users.id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Troubleshooting

### redirect_uri_mismatch Error

This error occurs when the redirect URI in your Google OAuth settings doesn't match the one being used by NextAuth. Make sure:

1. The `AUTH_URL` in `.env.local` matches your development/production URL
2. The authorized redirect URI in Google Cloud Console is: `{AUTH_URL}/api/auth/callback/google`
3. For local development, use `http://localhost:3000` (not `http://127.0.0.1:3000`)

### Database Connection Issues

If you see database errors:
1. Verify your `DATABASE_URL` is correct
2. Make sure the database tables are created (run `schema.sql`)
3. Check that your Neon database is active

### Authentication Not Persisting

If you're logged out after refresh:
1. Make sure `AUTH_SECRET` is set in `.env.local`
2. Clear your browser cookies and try again
3. Verify the secret is at least 32 characters

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
