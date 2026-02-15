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
});
