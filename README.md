# Personal Blog Website

A modern, full-featured personal blog built with Next.js 15, Supabase, NextAuth.js, and shadcn/ui.

## Getting Started
You can log in with the password "123" for a trial. The limit for the number of articles is 10.  
![图片描述](https://github.com/zxytt/next-blog/blob/main/public/sign.jpg)  
After logging in, you can click the icon function to enter the back-end management.
![图片描述](https://github.com/zxytt/next-blog/blob/main/public/manage.jpg)

## Performance
![图片描述](https://github.com/zxytt/next-blog/blob/main/public/performance.jpg)

## Features

### 🔐 Authentication System
- **NextAuth.js** integration with multiple providers
- Google OAuth login
- GitHub OAuth login
- Email/password authentication
- User profile management
- Role-based access control (admin/user)

### 📝 Article Management
- Create, edit, and delete articles (admin only)
- Markdown editor with live preview
- Article list with pagination
- Article detail pages with SEO optimization
- Featured images support
- Draft and published states

### 🏷️ Tag System
- Create and manage tags
- Color-coded tag system
- Filter articles by tags
- Tag overview page

### 💬 Comment System
- User comments on articles
- Guest viewing, authenticated commenting
- User avatars and names in comments
- Real-time comment posting

### ⚡ Performance & SEO
- **ISR (Incremental Static Regeneration)** for articles
- Optimized metadata and Open Graph tags
- Responsive design for all devices
- Fast loading with Next.js 14 App Router

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui + Tailwind CSS
- **Styling**: Tailwind CSS v3
- **Deployment**: Vercel-ready

## Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd personal-blog
npm install
\`\`\`

### 2. Environment Setup

Copy \`.env.example\` to \`.env.local\` and fill in your configuration:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL scripts in the \`scripts/\` folder:
   - \`01-create-tables.sql\` - Creates all necessary tables
   - \`02-seed-data.sql\` - Adds sample data

### 4. OAuth Setup

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: \`http://localhost:3000/api/auth/callback/google\`

#### GitHub OAuth:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: \`http://localhost:3000/api/auth/callback/github\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:3000\` to see your blog!

## Usage

### Admin Features

After setting up, you'll need to manually set a user as admin in your Supabase database:

\`\`\`sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
\`\`\`

Admin users can:
- Create, edit, and delete articles
- Manage tags
- Access admin dashboard
- Moderate comments

### Content Management

1. **Writing Articles**: Use the built-in Markdown editor with live preview
2. **Managing Tags**: Create color-coded tags for better organization
3. **SEO Optimization**: Automatic meta tags and Open Graph support

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Update these URLs for production:
- \`NEXTAUTH_URL\` - Your production domain
- \`NEXT_PUBLIC_APP_URL\` - Your production domain
- OAuth redirect URIs - Update to production URLs

## Project Structure

\`\`\`
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── articles/          # Article pages
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   └── ...
├── components/            # Reusable UI components
├── lib/                   # Utility functions
├── scripts/               # Database scripts
├── types/                 # TypeScript definitions
└── ...
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your personal blog!
\`\`\`

This personal blog system provides everything you need for a modern, professional blog with authentication, content management, and social features. The codebase is well-structured, fully responsive, and ready for production deployment.
