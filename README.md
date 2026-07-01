# Food Delivery MERN App

A full-stack food delivery project built with React, Express, MongoDB, and Socket.IO. The repository contains a customer-facing app, an admin dashboard, and a backend API.

## Project Structure

```text
client/   Customer frontend built with React and Vite
admin/    Admin dashboard built with React and Vite
server/   Express API, MongoDB models, auth, orders, food items, and Socket.IO
```

## Features

- Customer registration, login, logout, and cookie-based authentication
- Admin authentication and admin dashboard
- Food menu loaded from MongoDB
- Cart and order creation
- Order status management
- CSRF protection for cookie-authenticated requests
- Security headers, rate limiting, and environment-based CORS

## Tech Stack

- React
- Vite
- Express
- MongoDB / Mongoose
- Socket.IO
- Axios
- Material UI
- Bootstrap

## Local Setup

Install dependencies for each app:

```bash
cd server
npm install

cd ../client
npm install

cd ../admin
npm install
```

Create environment files from the examples:

```bash
server/.env
client/.env
admin/.env
```

Use the included `.env.example` files as a guide.

## Environment Variables

Server:

```env
MONGODB_URI=your_mongodb_connection_string
FIRST_SECRET_KEY=your_long_random_secret
NODE_ENV=development
CLIENT_ORIGINS=http://localhost:5173,http://localhost:5174
COOKIE_SAME_SITE=lax
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

Client:

```env
VITE_API_URL=http://localhost:8000
```

Admin:

```env
VITE_API_URL=http://localhost:8000
```

## Run Locally

Start the backend:

```bash
cd server
npm start
```

Start the customer frontend:

```bash
cd client
npm run dev
```

Start the admin frontend:

```bash
cd admin
npm run dev
```

## Seed Food Items

To insert the food items into MongoDB:

```bash
cd server
npm run seed:food
```

## Build

Build the customer frontend:

```bash
cd client
npm run build
```

Build the admin frontend:

```bash
cd admin
npm run build
```

## Deployment

Recommended free deployment:

- Client frontend: Vercel or Netlify
- Admin frontend: Vercel or Netlify
- Backend API: Render
- Database: MongoDB Atlas free cluster

Production server environment example:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
FIRST_SECRET_KEY=your_long_random_secret
CLIENT_ORIGINS=https://your-client-domain.com,https://your-admin-domain.com
COOKIE_SAME_SITE=none
```

Production frontend environment example:

```env
VITE_API_URL=https://your-backend-domain.com
```

## CI

This project includes a GitHub Actions CI workflow that installs dependencies, runs dependency audits, and builds the frontend apps on push or pull request.
