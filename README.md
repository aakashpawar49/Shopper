# 🛍️ Shopper — E-commerce platform

Shopper is a fully functional e-commerce platform built using React.js, Node.js, Express, and MongoDB. It handles user registration, authentication, product management, filtering, and cart functionality with support for both guest and logged-in users.


## 🚀 Features
🔐 User Authentication with JWT

👕 Product listing with filters (color, size, price, category)

🛒 Cart system for both guests & logged-in users

🧾 Order placement and checkout logic (extendable)

📦 MongoDB database with Mongoose models

🧑 Admin route protection (role-based access control)

⚙️ Sorting options (price, popularity)

🌐 RESTful API structure


## 📸 Screenshots

Landing Page
![image](https://github.com/user-attachments/assets/d22c8504-4182-4a62-81a5-581613242b0f)

Collections
![image](https://github.com/user-attachments/assets/9dae9241-5bbd-4e2b-a376-4cd5f9b806c8)

![image](https://github.com/user-attachments/assets/30fd9a5f-8cea-4f9d-8770-d8455ba9b8ba)

Admin 
![image](https://github.com/user-attachments/assets/cf8c5db8-bc24-4a12-8ba8-20538fc8f8c7)


## 🗂️ Project Structure

```
Shopper/
├── backend/                 Express + MongoDB REST API
│   ├── config/db.js         MongoDB connection
│   ├── data/products.js     Sample products used by the seeder
│   ├── middleware/          JWT auth and admin guards
│   ├── models/              Mongoose models
│   ├── routes/              API route handlers
│   ├── seeder.js            Seeds sample data (npm run seed)
│   ├── server.js            API entry point
│   └── .env.example         Backend environment template
└── frontend/                React + Vite + Redux Toolkit + Tailwind
    ├── src/
    │   ├── components/      UI components (Admin, Cart, Common, Layout, Products)
    │   ├── pages/           Route-level pages
    │   └── redux/           Store and slices
    ├── certs/               (optional, git-ignored) local HTTPS certificate
    └── .env.example         Frontend environment template
```


## 🚀 Getting Started

### Prerequisites
- Node.js 20 or newer (22 LTS recommended)
- A MongoDB database: a local MongoDB server or a free MongoDB Atlas cluster
- Optional: a Cloudinary account (admin image uploads) and a Stripe test account (card checkout)

### 1. Clone and install

```bash
git clone <repository-url>
cd Shopper

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

Each app has its own template. Copy it and fill in the values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

On Windows PowerShell use `Copy-Item backend/.env.example backend/.env` (same for the frontend).

**Backend (`backend/.env`)**

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | API port. Defaults to `3000`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Long random string used to sign login tokens. |
| `FRONTEND_URL` | For payments | URL of the frontend, used for the Stripe success/cancel redirects. |
| `CLOUDINARY_CLOUD_NAME` | For image upload | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | For image upload | Cloudinary API key. |
| `CLOUDINARY_SECRET_KEY` | For image upload | Cloudinary API secret. |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key (`sk_test_...`). |

**Frontend (`frontend/.env`)**

| Variable | Required | Description |
|---|---|---|
| `VITE_BACKEND_URL` | Yes | Base URL of the API, for example `http://localhost:3000` (no trailing slash). |
| `VITE_PAYPAL_CLIENT_ID` | No | PayPal client ID. Only used by the PayPal button component, which is not part of checkout yet. |

The API refuses to start and names the missing variables if `MONGO_URI` or `JWT_SECRET` is not set.

### 3. Seed sample data (optional)

```bash
cd backend
npm run seed
```

> ⚠️ The seeder **deletes all existing products, users and carts** before inserting the sample products. It also creates an admin account: `admin@example.com` / `123456`. Change this password before deploying anywhere public.

### 4. Run the apps

Use two terminals:

```bash
# Terminal 1: API on http://localhost:3000
cd backend
npm run dev

# Terminal 2: frontend on http://localhost:5173
cd frontend
npm run dev
```

Open http://localhost:5173. Log in as the seeded admin to reach the dashboard at `/admin`.

### Optional: HTTPS for the dev server

The Vite dev server runs on plain HTTP by default. To serve it over HTTPS, put a certificate and key at `frontend/certs/cert.crt` and `frontend/certs/cert.key` (the folder is git-ignored). [mkcert](https://github.com/FiloSottile/mkcert) is an easy way to create a locally trusted certificate:

```bash
mkcert -install
mkcert -key-file frontend/certs/cert.key -cert-file frontend/certs/cert.crt localhost 127.0.0.1
```

When HTTPS is on, set `FRONTEND_URL=https://localhost:5173` in `backend/.env`.


## 💳 Payments: current state

Clicking "Pay with Card" creates a Stripe Checkout session and redirects to Stripe's hosted payment page. After payment, Stripe sends the user back to `/order-confirmation`. Confirming the payment on the server and turning the checkout into an order is not implemented yet, so paid checkouts do not show up under My Orders or in the admin order list.



## 🛡️ Security Features

Password hashing with bcrypt

JWT-based secure authentication

Role-based route access (admin vs user)

Environment variables for sensitive config



## 📌 To-Do / Improvements

Add payment gateway integration

Product review system

Order history & shipping tracking


🧑‍💻 Author
Aakash Pawar
