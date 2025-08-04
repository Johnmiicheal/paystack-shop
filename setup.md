# Shopping Cart API Setup Instructions

## Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paystack-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
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

5. **Build and run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run build
   npm start
   ```

## API Testing

The API will be available at `http://localhost:3000`. You can test it using:

- **Postman**: Import the provided Postman collection
- **cURL**: Use the examples in the README.md
- **Browser**: Visit `http://localhost:3000/api/health` for health check

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run db:setup` - Set up database tables 