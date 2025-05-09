# 🛍️ Shopper — E-commerce Platform

![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

Shopper is a fully functional e-commerce platform built using React.js, Node.js, Express, and MongoDB. It handles user registration, authentication, product management, filtering, and cart functionality with support for both guest and logged-in users.

## � Features

### 🔐 Authentication & Security
- User Authentication with JWT
- Password hashing with bcrypt
- Role-based route access (admin vs user)
- Environment variables for sensitive config

### 🛒 Shopping Experience
- Product listing with filters (color, size, price, category)
- Cart system for both guests & logged-in users
- Order placement and checkout logic (extendable)
- Sorting options (price, popularity)

### 🖥️ Admin Features
- Admin route protection
- MongoDB database with Mongoose models
- RESTful API structure

## 📸 Screenshots

| Page | Preview |
|------|---------|
| **Landing Page** | ![image](https://github.com/user-attachments/assets/d22c8504-4182-4a62-81a5-581613242b0f) |
| **Collections** | ![image](https://github.com/user-attachments/assets/9dae9241-5bbd-4e2b-a376-4cd5f9b806c8) |
| **Product View** | ![image](https://github.com/user-attachments/assets/30fd9a5f-8cea-4f9d-8770-d8455ba9b8ba) |
| **Admin Panel** | ![image](https://github.com/user-attachments/assets/cf8c5db8-bc24-4a12-8ba8-20538fc8f8c7) |

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/shopper.git

# Install dependencies
cd shopper
npm install
cd client
npm install