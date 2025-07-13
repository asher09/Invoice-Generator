# Invoice Generator Backend - Encore.js

This is an Encore.js backend service for the Invoice Generator application.

## Features

- User registration and authentication
- Invoice creation and management
- MongoDB integration with Mongoose
- Password hashing with bcryptjs
- Type-safe API endpoints

## API Endpoints

### User Routes
- `POST /user/register` - Register a new user
- `POST /user/login` - User login

### Invoice Routes
- `POST /invoice/create` - Create a new invoice
- `GET /invoice/user/:userId` - Get all invoices for a user
- `GET /invoice/:invoiceId` - Get a specific invoice

### Health Check
- `GET /health` - Service health check

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your MongoDB connection:
   - Update the `MONGODB_URI` in `src/services/database.ts`
   - Or set the `MONGODB_URI` environment variable

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string (default: mongodb://localhost:27017/invoice-generator)

## Project Structure

```
src/
├── models/
│   ├── user.ts           # User MongoDB schema
│   └── Invoice.ts        # Invoice MongoDB schema
├── routes/
│   ├── user.ts          # User API endpoints
│   └── invoice.ts       # Invoice API endpoints
├── services/
│   └── database.ts      # MongoDB connection service
└── index.ts             # Service entry point
```

## Encore.js

This project uses [Encore.js](https://encore.dev/) for building type-safe backend services. Encore automatically handles:
- API routing and validation
- Error handling
- Type safety
- API documentation
- And much more!
