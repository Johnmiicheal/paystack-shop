import { initializeDatabase, createTables, pool } from '../config/database';
import logger from '../utils/logger';

const setupDatabase = async () => {
  try {
    logger.info('🔧 Setting up database...');
    
    // Initialize database connection
    await initializeDatabase();
    
    // Create tables
    await createTables();
    
    // Add sample categories
    const connection = await pool.getConnection();
    
    try {
      // Insert sample categories
      await connection.execute(`
        INSERT IGNORE INTO categories (id, name, description) VALUES 
        (1, 'Electronics', 'Electronic devices and accessories'),
        (2, 'Clothing', 'Apparel and fashion items'),
        (3, 'Books', 'Books and publications'),
        (4, 'Home & Garden', 'Home improvement and garden supplies')
      `);
      
      // Insert sample products
      await connection.execute(`
        INSERT IGNORE INTO products (sku, name, description, price, stock_level, category_id) VALUES 
        ('LAPTOP-001', 'MacBook Pro 13"', 'Apple MacBook Pro with M2 chip, 8GB RAM, 256GB SSD', 1299.99, 50, 1),
        ('PHONE-001', 'iPhone 15 Pro', 'Apple iPhone 15 Pro with A17 Pro chip, 128GB storage', 999.99, 100, 1),
        ('TSHIRT-001', 'Cotton T-Shirt', 'Comfortable 100% cotton t-shirt, available in multiple colors', 19.99, 200, 2),
        ('BOOK-001', 'The Great Gatsby', 'Classic novel by F. Scott Fitzgerald', 12.99, 75, 3),
        ('TOOL-001', 'Cordless Drill', '20V MAX cordless drill with battery and charger', 89.99, 30, 4)
      `);
      
      logger.info('✅ Sample data inserted successfully');
    } finally {
      connection.release();
    }
    
    logger.info('✅ Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase(); 