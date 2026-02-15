import { ProductRepository } from '../ProductRepository';
import { Product } from '../../models/Product';

jest.mock('../../models/Product');

describe('ProductRepository', () => {
  let repository: ProductRepository;

  beforeEach(() => {
    repository = new ProductRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', price: 100 },
        { _id: '2', name: 'Product 2', price: 200 }
      ];

      (Product.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts)
      });

      (Product.countDocuments as jest.Mock).mockResolvedValue(2);

      const result = await repository.findAll({ page: 1, limit: 10 });

      expect(result.products).toEqual(mockProducts);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return product by id', async () => {
      const mockProduct = { _id: '1', name: 'Product 1' };
      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

      const result = await repository.findById('1');

      expect(result).toEqual(mockProduct);
      expect(Product.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const productData = {
        sku: 'SKU001',
        name: 'Test Product',
        description: 'Test description',
        category: 'Electronics',
        subcategory: 'Phones',
        price: 299.99,
        brand: 'TestBrand',
        image_url: 'http://example.com/image.jpg',
        features: ['Feature 1'],
        specifications: { color: 'black' },
        stock: 10
      };

      const mockProduct = { _id: '1', ...productData };
      (Product.prototype.save as jest.Mock) = jest.fn().mockResolvedValue(mockProduct);

      const result = await repository.create(productData);

      expect(result).toEqual(mockProduct);
    });
  });
});
