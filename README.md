# Levitation (Invoice Generator)

Levitation is a full-stack web application that allows users to add products, calculate subtotals and GST, and generate downloadable PDF invoices. The app features a responsive React frontend, a Node.js/Express backend, and uses Puppeteer for high-quality PDF generation.

## Features

- Add multiple products with name, price, and quantity
- Automatic calculation of subtotal and GST (18%)
- Real-time invoice table updates
- Download invoices as professionally formatted PDFs
- Secure user authentication with JWT
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **PDF Generation:** Puppeteer
- **Authentication:** JWT

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/asher09/Invoice-Generator
   ```

2. **Install dependencies for frontend and backend:**
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the `backend` directory with your configuration (JWT_SECRET="secret", DATABASE_URL="string", PORT=3000).

4. **Run the backend:**
   ```bash
   npm run dev
   ```

5. **Run the frontend:**
   ```bash
   cd ../frontend
   npm run dev
   ```

6. **Open the app:**
   - Visit `http://localhost:3000` in your browser.




---

**Levitation** — Modern, automated invoice generation made