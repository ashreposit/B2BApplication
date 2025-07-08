# User Management API

A backend RESTful API for user authentication, registration, profile management and JWT-based session management built using:

- **Node.js**
- **Express**
- **Prisma (PostgreSQL)**
- **JWT Authentication**
- **bcrypt Password Hashing**
- **Swagger API Documentation**
- **Jest Unit Testing**

---

## Tech Stack

| Technology | Description                          |
|------------|--------------------------------------|
| Node.js    | JavaScript runtime environment       |
| Express    | Web framework for building APIs      |
| Prisma     | ORM for PostgreSQL database          |
| JWT        | JSON Web Tokens for authentication   |
| bcrypt     | Password hashing                     |
| Jest       | Unit testing framework               |
| Swagger    | Interactive API documentation        |

---

## Project Setup Instructions

### Clone the repository

git clone https://github.com/ashreposit/B2BApplication

# Install dependencies
npm install

# Configure environment variables
Create a .env file in the root by copying from .env.example

DATABASE_URL=postgresql://username:password@localhost:5432/yourdbname
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRATION=1d
JWT_COOKIE_EXPIRATION=86400000


# Run database migrations
npx prisma migrate dev --name init

# Start the development server
npm run dev

# API Documentation
http://localhost:3000/api-docs

## API Endpoints

| Method | Endpoint           | Description                      | Access         |
| ------ | ------------------ | -------------------------------- | -------------- |
| POST   | `/user/create`     | Register a new user (with image) | Public         |
| POST   | `/user/login`      | Login user, sets JWT cookie      | Public         |
| GET    | `/user/getMe`      | Get logged-in user profile       | Admin,Customer |
| PUT    | `/user/update/:id` | Update user profile              | Admin,Customer |
| POST   | `/user/logout`     | Logout, clear session cookie     | Admin,Customer |


## Sample API Requests

# Register User
POST /user/create

# Request Body:
{
  "email": "example@gmail.com",
  "password": "example@123",
  "role": "ADMIN",
  "awsImageUrl": "https://image-url"
}

# Login
POST /user/login

# Request Body:

{
  "email": "example@gmail.com",
  "password": "example@123"
}

# Get Logged-In User
GET /user/getMe

Requires authorizationToken cookie.

# Update User
PUT /user/update/:userId

# Request Body:

{
  "email": "updated@example.com",
  "awsImageUrl": "https://new-image-url"
}

# Logout
POST /user/logout

Requires authorizationToken cookie.

## Product API Endpoints

| Method | Endpoint              | Description                       | Access |
| ------ | --------------------- | --------------------------------- | ------ |
| POST   | `/product/create`     | Create a new product (with image) | Admin  |
| GET    | `/product/`           | Get all products                  | Admin  |
| GET    | `/product/getOne/:id` | Get a product by ID               | Admin  |
| PUT    | `/product/update/:id` | Update a product (with new image) | Admin  |
| DELETE | `/product/delete/:id` | Delete a product by ID            | Admin  |

# Create Product
POST /product/create

# Request Body:

{"productName" : Macbook Air
"description" : Lightweight laptop
"price" : 95000
"productImage" : (product image file)
}

# Get All Products
GET /product/

Requires authorizationToken cookie (Admin)

# Get Product By ID
GET /product/getOne/:id

# Update Product
PUT /product/update/:id

# Request body:
{
    "productName"    : Macbook Air M2
    "description"    : Updated lightweight laptop
    "price"          : 115000 
    "productImage"   : (new product image file)
}

# Delete Product
DELETE /product/delete/:id


## Run Tests

# Run unit tests:

npm run test

# Check coverage report:

npm run test -- --coverage

# The HTML report is available at:

/coverage/lcov-report/index.html
