import { Router } from 'express';
import { body } from 'express-validator';
import { ProductController } from '../controllers/ProductController';
import { validate } from '../middleware/validation';

export const createProductRoutes = (controller: ProductController): Router => {
  const router = Router();

  router.get('/', controller.getProducts);
  router.get('/search', controller.searchProducts);
  router.get('/:id', controller.getProductById);

  router.post(
    '/',
    [
      body('sku').isString().notEmpty(),
      body('name').isString().notEmpty(),
      body('description').isString().notEmpty(),
      body('category').isString().notEmpty(),
      body('subcategory').isString().notEmpty(),
      body('price').isFloat({ min: 0 }),
      body('brand').isString().notEmpty(),
      body('image_url').isURL(),
      body('features').isArray(),
      body('stock').isInt({ min: 0 }),
      validate
    ],
    controller.createProduct
  );

  router.put('/:id', controller.updateProduct);
  router.delete('/:id', controller.deleteProduct);

  return router;
};
