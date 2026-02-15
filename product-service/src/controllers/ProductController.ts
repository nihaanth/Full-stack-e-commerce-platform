import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/ProductService';
import { AppError } from '../middleware/errorHandler';

export class ProductController {
  constructor(private service: ProductService) {}

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string;
      const brand = req.query.brand as string;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

      const result = await this.service.getProducts({
        page,
        limit,
        category,
        brand,
        minPrice,
        maxPrice
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.getProductById(req.params.id);
      res.json(product);
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        next(new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND'));
      } else {
        next(error);
      }
    }
  };

  searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.service.searchProducts(query, { page, limit });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof Error && error.message === 'SKU already exists') {
        next(new AppError(409, 'SKU already exists', 'DUPLICATE_SKU'));
      } else {
        next(error);
      }
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        next(new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND'));
      } else {
        next(error);
      }
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        next(new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND'));
      } else {
        next(error);
      }
    }
  };
}
