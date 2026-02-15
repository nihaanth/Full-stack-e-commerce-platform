import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { ProductRepository } from './repositories/ProductRepository';
import { ProductService } from './services/ProductService';
import { ProductController } from './controllers/ProductController';
import { createProductRoutes } from './routes/productRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/products';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Dependency injection
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Routes
app.use('/api/products', createProductRoutes(productController));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'product-service' });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDatabase(MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
  });
};

startServer();

export default app;
