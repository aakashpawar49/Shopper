**🛍️ Shopper — MERN Stack E-commerce API**
Shopper is a fully functional backend API for an e-commerce platform built using Node.js, Express, and MongoDB. It handles user registration, authentication, product management, filtering, and cart functionality with support for both guest and logged-in users.


#🚀 Features#
🔐 User Authentication with JWT
👕 Product listing with filters (color, size, price, category)
🛒 Cart system for both guests & logged-in users
🧾 Order placement and checkout logic (extendable)
📦 MongoDB database with Mongoose models
🧑 Admin route protection (role-based access control)
⚙️ Sorting options (price, popularity)
🌐 RESTful API structure


**🧱 Tech Stack**
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Auth: JWT (JSON Web Tokens)
Environment: dotenv
Dev Tools: Nodemon, Postman


**🚀 Getting Started**
1. Clone the repository
2. Install dependencies
3. Create a .env file
4. Run the server


**📮 API Endpoints Overview **
Method	Route	Description
POST	/api/users/register	Register a new user
POST	/api/users/login	Login user and return token
GET	/api/products	Get all products
GET	/api/products/:id	Get single product
POST	/api/cart	Add item to cart
PUT	/api/cart/:id	Update item in cart
DELETE	/api/cart/:id	Remove item from cart


**🛡️ Security Features**
Password hashing with bcrypt
JWT-based secure authentication
Role-based route access (admin vs user)
Environment variables for sensitive config


**📌 To-Do / Improvements
Add payment gateway integration
Product review system
Order history & shipping tracking

**📂 Project Structure**
shopper-ecommerce/
│
├── frontend/                     # React + Tailwind frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/               # Static assets (images, icons)
│   │   ├── components/           # Reusable components (Header, ProductCard, etc.)
│   │   ├── pages/                # Page components (Home, ProductDetails, Cart, etc.)
│   │   ├── routes/               # React Router configuration
│   │   ├── services/             # API calls (auth, products, etc.)
│   │   ├── utils/                # Helper functions (e.g., price formatter)
│   │   ├── App.jsx               # Main React component
│   │   ├── main.jsx              # App entry point
│   │   └── index.css             # Tailwind base styles
│   ├── .env                      # Frontend environment variables
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── vite.config.js            # Vite config
│
├── backend/                      # Node.js + Express + MongoDB backend
│   ├── config/                   # DB connection & config
│   │   └── db.js
│   ├── controllers/              # Request handlers (auth, product, cart)
│   │   └── userController.js
│   ├── middleware/               # Auth middlewares, error handling
│   │   └── authMiddleware.js
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/                   # Route definitions
│   │   ├── userRoutes.js
│   │   └── productRoutes.js
│   ├── .env                      # Backend environment variables
│   ├── server.js                 # Entry point for Express server
│   └── package.json
├── .gitignore
├── README.md
└── LICENSE


🧑‍💻 Author
Aakash Pawar
