# DreamNet

DreamNet is a ongoing project: a full-stack social journaling platform for recording, sharing, and discovering dreams. Users can create public or private dream entries, follow others, tag users with `@mentions`, and engage through likes and comments.

## Features

* **Dream Creation:** Write dreams with rich formatting and tag other users using `@mentions`.
* **Feed:** Browse public dreams or switch to a personalized "Following" view.
* **User Profiles:** Public and private profile pages with editable bio, avatar, and dream history.
* **Likes & Comments:** Interactive dream entries support likes and nested commenting.
* **Follow System:** Users can follow or unfollow each other to personalize their feed.
* **Real-Time Search:** Search bar with debounced username suggestions.
* **Authentication & Authorization:** Secure session-based access using JWT tokens.

## In Development: Future Features
- Deployment to web via cloud services
- Overhaul to site look and feel
1. Revamp dream entries to resemble pages in a real journal
2. Allow users to sort dream entries into volumes/journals
- Integrate useful / fun information like interesting facts about dreams / sleep health

## Tech Stack

### Frontend

* React
* Tailwind CSS + DaisyUI
* react-router-dom
* react-mentions

### Backend

* Node.js
* Express
* PostgreSQL
* JWT for authentication
* Multer for avatar uploads

## Project Structure

```
/client            # Frontend (React)
  ├── components/  # Shared UI components
  ├── pages/       # Main views (Home, Dashboard, etc.)
  ├── api.js       # Axios instance for API calls
  └── index.css    # Styling and font imports

/server            # Backend (Node.js/Express)
  ├── routes/      # Route handlers (auth, dreams, users, follows, comments)
  ├── middleware/  # Auth middleware, error handling
  ├── db/          # PostgreSQL queries and connection
  ├── utils/       # Formatters and helpers
  └── index.js     # Server entry point
```

## Getting Started

### 1. Setup

Install dependencies for both frontend and backend:

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Environment

Create a `.env` file in the `server/` directory with the following:

```
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/dreamnet
JWT_SECRET=your_jwt_secret
```

### 3. Run the App

In two separate terminal tabs:

```bash
# Terminal 1 (backend)
cd server
npm start

# Terminal 2 (frontend)
cd client
npm start
```

Frontend will run on `http://localhost:3000` and proxy API requests to `http://localhost:5000`.

## API Overview

DreamNet exposes RESTful endpoints for:

* **Authentication:** `/auth/register`, `/auth/login`, `/auth/me`
* **Users & Profiles:** `/users/:username/profile`, `/users/usernames`
* **Dreams:** `/dreams`, `/dreams/discover`, `/dreams/:id`
* **Follows:** `/follows/:username`, `/follows/is-following/:username`
* **Comments:** `/comments/:dreamId`
* **Search:** `/users/search?q=...`