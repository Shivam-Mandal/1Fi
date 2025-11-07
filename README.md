# E-commerce Product Page with EMI Plans & Cloudinary

> A simple full-stack demo that displays products (smartphones) with multiple EMI plans backed.
> Built with the MERN stack (MongoDB, Express, React, Node) and Cloudinary for image hosting.
> The app loads dynamic product & EMI plan data from a backend API and shows responsive product pages with unique URLs.

---

## Table of Contents

* [Demo / Objective](#demo--objective)
* [Features](#features)
* [Folder Structure](#folder-structure)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Environment Variables](#environment-variables)
* [Install & Run (Development)](#install--run-development)

  * [Backend (server)](#backend-server)
  * [Frontend (client)](#frontend-client)
* [Database & Seeding](#database--seeding)
* [API Endpoints](#api-endpoints)
* [Frontend Routes & Pages](#frontend-routes--pages)
* [EMI Plan Calculation & Data Model](#emi-plan-calculation--data-model)
* [Deploy & Production Notes](#deploy--production-notes)
* [Gitignore suggestions](#gitignore-suggestions)


---

## Demo / Objective

Build a dynamic product page similar to the reference (example Snapmint product page). Each product has multiple variants (storage/color) and multiple EMI plans — each plan shows monthly payment, tenure, interest rate and cashback (if any). Users can select a plan and proceed.

---

## Features

* Dynamic product data served from Express API (no hardcoded product data in frontend)
* Product detail pages with unique URLs (`/products/:slug`)
* Multiple product variants per product (e.g., storage / color)
* Multiple EMI plans per product/variant showing:

  * Monthly payment
  * Tenure (months)
  * Interest rate
  * Cashback (if applicable)
* Cloudinary image hosting + `uploadCloudinary.js` helper
* Seed script (`seed/seed.js`) to populate DB with at least 3 products, each with 2+ variants
* Responsive React UI (Tailwind CSS recommended)
* Simple “Proceed with plan” action (stub / can be extended to payment flow)

---

## Folder Structure

```
backend/
  cloudinary/
    uploadCloudinary.js
  config/
    cloudinary.js
    db.js
  controllers/
    productController.js
    uploadController.js
  models/
    Product.js
  routes/
    productRoutes.js
    uploadRoutes.js
  seed/
    seed.js
  .gitignore
  package.json
  package-lock.json
  server.js

frontend/
  public/
  src/
    api/
      api.js
      product.js
    assets/
      react.svg
    components/
      EMIBox.jsx
      ImageGallery.jsx
      VariantSelect.jsx
    pages/
      Home.jsx
      ProductPage.jsx
    App.css
    App.jsx
    index.css
    main.jsx
  .gitignore
  README.md
  index.html
  package.json
  package-lock.json
  vite.config.js
```

---

## Tech Stack

* **Frontend:** React (Vite) + Tailwind CSS (or CSS modules)
* **Backend:** Node.js + Express
* **Database:** MongoDB (Mongoose)
* **Image Hosting:** Cloudinary
* **Other:** Axios, dotenv, nodemon, multer

> The project is a MERN stack app with Cloudinary for images.

---

## Prerequisites

* Node.js (v16+ recommended)
* npm or yarn
* MongoDB instance (local or Atlas)
* Cloudinary account

---

## Environment Variables

Create a `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/snapemi
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Install & Run (Development)

### Backend (server)

```bash
cd backend
npm install
node seed/seed.js   # to seed DB
node server.js        # or nodemon
```

Server runs on `http://localhost:5000`

### Frontend (client)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Database & Seeding

Example product schema (`models/Product.js`):

```js
{
  name: String,
  slug: String,
  variants: [
    {
      name: String,
      mrp: Number,
      price: Number,
      images: [String]
    }
  ],
  emiPlans: [
    {
      tenureMonths: Number,
      interestRateAnnualPercent: Number,
      cashback: Number
    }
  ]
}
```

Run seeder:

```bash
node seed/seed.js
```

---

## API Endpoints

| Method | Endpoint              | Description                |
| ------ | --------------------- | -------------------------- |
| GET    | `/api/products`       | Get all products           |
| GET    | `/api/products/:slug` | Get single product by slug |
| POST   | `/api/upload`         | Upload image to Cloudinary |

Example response:

```json
{
  "name": "iPhone 17 Pro",
  "slug": "iphone-17-pro",
  "variants": [
    { "name": "256GB / Silver", "price": 119900 },
    { "name": "512GB / Black", "price": 129900 }
  ],
  "emiPlans": [
    { "tenureMonths": 6, "interestRateAnnualPercent": 0 },
    { "tenureMonths": 12, "interestRateAnnualPercent": 10.5 }
  ]
}
```

---

## Frontend Routes & Pages

* `/` → Home page (product list)
* `/products/:slug` → Product detail page

  * `ImageGallery.jsx` for product images
  * `VariantSelect.jsx` for variant switching
  * `EMIBox.jsx` for EMI display & selection

---

## EMI Plan Calculation

```js
EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
```

Where:

* **P** = price
* **r** = monthly interest rate = (annualRate / 100) / 12
* **n** = tenure in months

For 0% interest: `EMI = P / n`

---

## Uploads & Cloudinary

* Config in `config/cloudinary.js`
* Upload helper in `cloudinary/uploadCloudinary.js`
* Upload route at `/api/upload`

Do not commit `.env` with credentials.

---

## Deploy & Production Notes

* Use MongoDB Atlas + Render/Netlify/Vercel
* Configure CORS
* Build frontend: `npm run build`
* Serve `/frontend/dist` from Express in production

---

## .gitignore Suggestions

```
node_modules/
dist/
.env
.vscode/
.DS_Store
*.log
```

---

**Author:** Shivam Mandal

---
