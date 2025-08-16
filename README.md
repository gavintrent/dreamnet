# DreamNet

DreamNet is a full-stack social journaling platform for recording, sharing, and discovering dreams. Users can create public or private dream entries, follow others, tag users with `@mentions`, and engage through likes and comments. The platform features email verification, avatar uploads, and a modern, responsive design.

## ✨ Features

* **Dream Creation:** Write dreams with rich formatting and tag other users using `@mentions`
* **Feed:** Browse public dreams or switch to a personalized "Following" view with user suggestions
* **User Profiles:** Public and private profile pages with editable bio, avatar, and dream history
* **Likes & Comments:** Interactive dream entries support likes and nested commenting with speech bubble styling
* **Follow System:** Users can follow or unfollow each other to personalize their feed
* **Real-Time Search:** Search bar with debounced username suggestions and click-outside handling
* **Notification System:** Users receive notifications when they are tagged in dreams
* **Authentication & Authorization:** Secure session-based access using JWT tokens
* **Email Verification:** Required email verification for new accounts with secure token system
* **Avatar Management:** Upload and manage profile pictures with Supabase storage
* **Responsive Design:** Modern UI with smooth transitions and mobile-friendly layout

## 🚀 Production Deployment

DreamNet is deployed using modern cloud services for scalability and reliability:

### Frontend (Vercel)
- **Platform:** Vercel
- **Domain:** [dreamnet-journal.vercel.app](https://dreamnet-journal.vercel.app)
- **Features:** Automatic deployments, CDN, SSL, preview deployments

### Backend (Render)
- **Platform:** Render
- **Service:** Node.js API service
- **Features:** Auto-scaling, SSL, environment variable management

### Database (PostgreSQL)
- **Platform:** Render PostgreSQL
- **Features:** Managed database, automatic backups, SSL connections

### File Storage (Supabase)
- **Platform:** Supabase Storage
- **Features:** Avatar uploads, CDN distribution, RLS policies

## 🛠️ Tech Stack

### Frontend
* **React 18** - Modern React with hooks and functional components
* **Tailwind CSS** - Utility-first CSS framework with custom CSS variables
* **React Router** - Client-side routing and navigation
* **Axios** - HTTP client for API communication
* **React Mentions** - User tagging system with @mentions

### Backend
* **Node.js** - JavaScript runtime
* **Express** - Web application framework
* **PostgreSQL** - Relational database with advanced features
* **JWT** - JSON Web Tokens for authentication
* **Multer** - File upload middleware
* **Nodemailer** - Email sending for verification
* **Bcrypt** - Password hashing
* **CORS** - Cross-origin resource sharing

### Production Services
* **Vercel** - Frontend hosting and deployment
* **Render** - Backend hosting and database
* **Supabase** - File storage and management
* **Gmail** - Email service for verification

## 📁 Project Structure

```
/client                    # Frontend (React)
  ├── components/         # Shared UI components
  │   ├── Navbar.jsx     # Navigation with avatar dropdown
  │   ├── Logo.jsx       # Animated logo with ZZZ effect
  │   ├── DreamGrid.jsx  # Grid layout for dreams
  │   ├── CommentsSection.jsx # Interactive comments with speech bubbles
  │   └── ...
  ├── pages/             # Main views (Home, Dashboard, etc.)
  │   ├── Login.jsx      # Authentication with error handling
  │   ├── Register.jsx   # User registration with avatar upload
  │   ├── VerifyEmail.jsx # Email verification page
  │   └── ...
  ├── utils/             # Utility functions
  │   ├── api.js         # Axios instance for API calls
  │   └── avatarUtils.js # Avatar URL management
  └── index.css          # Styling and font imports

/server                    # Backend (Node.js/Express)
  ├── routes/            # Route handlers
  │   ├── auth.js        # Authentication routes
  │   ├── dreams.js      # Dream CRUD operations
  │   ├── users.js       # User management
  │   └── ...
  ├── controllers/       # Business logic
  │   └── authController.js # User registration and verification
  ├── middleware/        # Auth middleware, validation
  ├── db/                # PostgreSQL connection and queries
  ├── utils/             # Helper functions
  │   ├── emailService.js # Email sending with Nodemailer
  │   └── supabaseStorage.js # File upload to Supabase
  └── index.js           # Server entry point
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (required for Supabase compatibility)
- PostgreSQL database
- Gmail account (for email verification)
- Supabase account (for file storage)

### 2. Setup

Install dependencies for both frontend and backend:

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server/` directory:

```bash
# Database
DATABASE_URL=postgres://username:password@localhost:5432/dreamnet

# JWT
JWT_SECRET=your_jwt_secret

# Email Service (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Supabase Storage
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### 4. Database Setup

Run the database schema:

```bash
cd server
psql -d dreamnet -f db/schema.sql
```

### 5. Supabase Configuration

1. Create a Supabase project
2. Create an `avatars` storage bucket
3. Set up RLS policies for public access
4. Add your Supabase credentials to `.env`

### 6. Run the App

In two separate terminal tabs:

```bash
# Terminal 1 (backend)
cd server
npm run dev

# Terminal 2 (frontend)
cd client
npm start
```

Frontend will run on `http://localhost:3000` and API requests will go to `http://localhost:4000`.

## 🔧 Development Commands

```bash
# Backend
npm run dev          # Start development server with nodemon
npm run migrate-avatars # Migrate existing avatars to Supabase

# Frontend
npm start           # Start development server
npm run build      # Build for production
```

## 📡 API Overview

DreamNet exposes RESTful endpoints for:

* **Authentication:** `/auth/register`, `/auth/login`, `/auth/verify/:token`, `/auth/me`
* **Users & Profiles:** `/users/:username/profile`, `/users/suggestions`, `/users/search`
* **Dreams:** `/dreams`, `/dreams/discover`, `/dreams/:id`, `/feed`
* **Follows:** `/follows/:username`, `/follows/is-following/:username`
* **Comments:** `/comments/:dreamId`
* **Likes:** `/likes/:dreamId`
* **Notifications:** `/notifications`

## 🌟 Key Features

### Email Verification System
- Secure token generation with crypto
- 24-hour expiration
- Professional email templates
- Automatic redirect after verification

### Avatar Management
- Supabase storage integration
- Automatic migration from local storage
- Public CDN distribution
- File type and size validation

### Modern UI/UX
- Responsive design with Tailwind CSS
- Smooth transitions and animations
- Speech bubble comment styling
- Interactive hover effects
- Mobile-optimized layout

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration for production
- Input validation and sanitization
- Rate limiting protection

## 🔒 Production Security

- **CORS:** Configured for specific origins
- **SSL:** Enforced in production
- **Environment Variables:** Secure credential management
- **Input Validation:** Server-side validation for all inputs
- **File Upload:** Secure avatar upload with type/size restrictions

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the existing issues
- Create a new issue with detailed information
- Include browser console logs and error messages

---