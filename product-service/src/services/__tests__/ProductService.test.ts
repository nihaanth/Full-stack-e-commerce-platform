import { ProductService } from '../ProductService';
import { ProductRepository } from '../../repositories/ProductRepository';

jest.mock('../../repositories/ProductRepository');

describe('ProductService', () => {
  let service: ProductService;
  let mockRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
    service = new ProductService(mockRepository);
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const mockResult = {
        products: [{ name: 'Product 1' }],
        total: 1,
        page: 1,
        totalPages: 1
      };

      mockRepository.findAll.mockResolvedValue(mockResult as any);

      const result = await service.getProducts({ page: 1, limit: 10 });

      expect(result).toEqual(mockResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe('getProductById', () => {
    it('should return product by id', async () => {
      const mockProduct = { _id: '1', name: 'Product 1' };
      mockRepository.findById.mockResolvedValue(mockProduct as any);

      const result = await service.getProductById('1');

      expect(result).toEqual(mockProduct);
    });

    it('should throw error if product not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getProductById('999')).rejects.toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    it('should create product', async () => {
      const productData = { sku: 'SKU001', name: 'Test' };
      const mockProduct = { _id: '1', ...productData };

      mockRepository.findBySku.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockProduct as any);

      const result = await service.createProduct(productData as any);

      expect(result).toEqual(mockProduct);
    });

    it('should throw error if SKU already exists', async () => {
      const productData = { sku: 'SKU001', name: 'Test' };
      mockRepository.findBySku.mockResolvedValue({ sku: 'SKU001' } as any);

      await expect(service.createProduct(productData as any)).rejects.toThrow('SKU already exists');
    });
  });

  describe('searchProducts', () => {
    it('should search products and return results', async () => {
      const mockResult = {
        products: [{ name: 'Product 1' }, { name: 'Product 2' }],
        total: 2,
        page: 1,
        totalPages: 1
      };

      mockRepository.search.mockResolvedValue(mockResult as any);

      const result = await service.searchProducts('test query', { page: 1, limit: 10 });

      expect(result).toEqual(mockResult);
      expect(mockRepository.search).toHaveBeenCalledWith('test query', { page: 1, limit: 10 });
    });

    it('should throw error if query is empty', async () => {
      await expect(service.searchProducts('', { page: 1, limit: 10 })).rejects.toThrow('Search query is required');
      await expect(service.searchProducts('   ', { page: 1, limit: 10 })).rejects.toThrow('Search query is required');
    });
  });

  describe('updateProduct', () => {
    it('should update product and return updated data', async () => {
      const updateData = { name: 'Updated Product', price: 99.99 };
      const mockUpdatedProduct = { _id: '1', ...updateData };

      mockRepository.update.mockResolvedValue(mockUpdatedProduct as any);

      const result = await service.updateProduct('1', updateData as any);

      expect(result).toEqual(mockUpdatedProduct);
      expect(mockRepository.update).toHaveBeenCalledWith('1', updateData);
    });

    it('should throw error if product not found', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(service.updateProduct('999', { name: 'Updated' } as any)).rejects.toThrow('Product not found');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await service.deleteProduct('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error if product not found', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.deleteProduct('999')).rejects.toThrow('Product not found');
    });
  });
});
