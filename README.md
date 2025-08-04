# 🛒 Shopping Cart API

A robust RESTful API for managing products and shopping cart functionality built with Node.js, TypeScript, and MySQL. (For Paystack Backend Assessment)

## 🚀 Features

### Products Management
- ✅ Create, read, update, and delete products
- ✅ Product categorization
- ✅ Stock level tracking
- ✅ SKU-based product identification
- ✅ Pagination support

### Shopping Cart
- ✅ Add items to cart with quantity
- ✅ Update item quantities
- ✅ Remove items from cart
- ✅ View cart with product details and subtotals
- ✅ Stock validation
- ✅ Cart clearing functionality

### Technical Features
- ✅ TypeScript for type safety
- ✅ MySQL database with connection pooling
- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Request logging and monitoring
- ✅ Rate limiting and security headers
- ✅ Unit tests with Jest
- ✅ Graceful shutdown handling
- ✅ Input validation with Joi schemas
- ✅ Datadog integration for tracing and logging

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MySQL with mysql2
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston with Datadog integration
- **Validation**: Joi schemas
- **Monitoring**: Datadog APM and tracing
- **Testing**: Jest
- **Development**: ts-node-dev for hot reload

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Git

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/johnmiicheal/paystack-shop
   cd paystack-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=shopping_cart_db

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Logging
   LOG_LEVEL=info

   # Datadog Configuration (Optional)
   DD_ENV=development
   DD_SERVICE=shopping-cart-api
   DD_VERSION=1.0.0
   DD_AGENT_HOST=localhost
   DD_TRACE_AGENT_PORT=8126
   ```

4. **Set up the database**
   ```bash
   # Create the database
   mysql -u root -p -e "CREATE DATABASE shopping_cart_db;"
   
   # Run the database setup script
   npm run db:setup
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run build
   npm start
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Health Check
```http
GET /api/health
```

### Products

#### Get All Products
```http
GET /api/products
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "sku": "LAPTOP-001",
  "name": "MacBook Pro 13\"",
  "description": "Apple MacBook Pro with M2 chip",
  "price": 1299.99,
  "stockLevel": 50,
  "categoryId": 1
}
```

#### Update Product
```http
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 1199.99
}
```

#### Delete Product
```http
DELETE /api/products/:id
```

### Cart

#### Get Cart
```http
GET /api/cart
```

#### Add Item to Cart
```http
POST /api/cart/items
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/items/:itemId
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Item from Cart
```http
DELETE /api/cart/items/:itemId
```

#### Clear Cart
```http
DELETE /api/cart
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📝 Example API Usage

### Using cURL

1. **Create a product**
   ```bash
   curl -X POST http://localhost:3000/api/products \
     -H "Content-Type: application/json" \
     -d '{
       "sku": "PHONE-002",
       "name": "Samsung Galaxy S24",
       "description": "Latest Samsung flagship phone",
       "price": 899.99,
       "stockLevel": 25,
       "categoryId": 1
     }'
   ```

2. **Get all products**
   ```bash
   curl http://localhost:3000/api/products
   ```

3. **Add item to cart**
   ```bash
   curl -X POST http://localhost:3000/api/cart/items \
     -H "Content-Type: application/json" \
     -d '{
       "productId": 1,
       "quantity": 2
     }'
   ```

4. **View cart**
   ```bash
   curl http://localhost:3000/api/cart
   ```

## 🏗️ Architecture & Design Decisions

### Database Design
- **Normalized schema** with proper foreign key relationships
- **Categories table** for product categorization
- **Products table** with SKU uniqueness constraint
- **Cart_items table** for single-user cart management
- **Timestamps** for audit trails

### API Design
- **RESTful principles** with proper HTTP methods
- **Consistent response format** with success/error indicators
- **Pagination** for large datasets
- **Input validation** with meaningful error messages
- **Rate limiting** to prevent abuse

### Code Structure
- **Service layer** for business logic
- **Controller layer** for request/response handling
- **Repository pattern** for data access
- **Middleware** for cross-cutting concerns
- **TypeScript interfaces** for type safety

### Security Considerations
- **Input validation** and sanitization with Joi schemas
- **SQL injection prevention** with parameterized queries
- **Rate limiting** to prevent abuse
- **Security headers** with Helmet
- **CORS configuration** for cross-origin requests
- **Request validation** for all endpoints

### Error Handling
- **Centralized error handling** with custom error classes
- **Meaningful error messages** for debugging
- **Proper HTTP status codes**
- **Error logging** for monitoring

### Performance Optimizations
- **Database connection pooling** for efficient connections
- **Indexed queries** for faster data retrieval
- **Pagination** to handle large datasets
- **Async/await** for non-blocking operations
- **Datadog APM** for performance monitoring
- **Request tracing** for debugging and optimization

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run db:setup` - Set up database tables and sample data

## 📊 Sample Data

The database setup script includes sample data:

**Categories:**
- Electronics
- Clothing
- Books
- Home & Garden

**Products:**
- MacBook Pro 13" ($1,299.99)
- iPhone 15 Pro ($999.99)
- Cotton T-Shirt ($19.99)
- The Great Gatsby ($12.99)
- Cordless Drill ($89.99)

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common error scenarios:
- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate SKU or constraint violation
- **500 Internal Server Error**: Server-side errors

## 📈 Monitoring & Logging

- **Request logging** with timestamps and user agents
- **Error logging** with stack traces
- **Database connection monitoring**
- **Graceful shutdown handling**
- **Datadog APM integration** for distributed tracing
- **Custom metrics and events** for business insights
- **Performance monitoring** with automatic instrumentation


## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ by [Johnmicheal](https://johnmicheal.xyz) for Paystack Future Stacks** 