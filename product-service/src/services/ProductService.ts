import { ProductRepository } from '../repositories/ProductRepository';
import { IProduct } from '../models/Product';

export class ProductService {
  constructor(private repository: ProductRepository) {}

  async getProducts(options: {
    page: number;
    limit: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
  }) {
    return this.repository.findAll(options);
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async searchProducts(query: string, options: { page: number; limit: number }) {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }
    return this.repository.search(query, options);
  }

  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    const existing = await this.repository.findBySku(data.sku!);
    if (existing) {
      throw new Error('SKU already exists');
    }
    return this.repository.create(data);
  }

  async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct> {
    const product = await this.repository.update(id, data);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new Error('Product not found');
    }
  }
}
