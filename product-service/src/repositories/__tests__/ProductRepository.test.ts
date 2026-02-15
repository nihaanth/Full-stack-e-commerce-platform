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

    it('should filter by price range', async () => {
      (Product.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      });
      (Product.countDocuments as jest.Mock).mockResolvedValue(0);

      await repository.findAll({ page: 1, limit: 10, minPrice: 100, maxPrice: 500 });

      expect(Product.find).toHaveBeenCalledWith({ price: { $gte: 100, $lte: 500 } });
    });

    it('should filter by category', async () => {
      (Product.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      });
      (Product.countDocuments as jest.Mock).mockResolvedValue(0);

      await repository.findAll({ page: 1, limit: 10, category: 'Electronics' });

      expect(Product.find).toHaveBeenCalledWith({ category: 'Electronics' });
    });

    it('should filter by brand', async () => {
      (Product.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      });
      (Product.countDocuments as jest.Mock).mockResolvedValue(0);

      await repository.findAll({ page: 1, limit: 10, brand: 'Apple' });

      expect(Product.find).toHaveBeenCalledWith({ brand: 'Apple' });
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

  describe('findBySku', () => {
    it('should return product by SKU', async () => {
      const mockProduct = { _id: '1', sku: 'TEST-SKU', name: 'Test Product' };
      (Product.findOne as jest.Mock).mockResolvedValue(mockProduct);

      const result = await repository.findBySku('TEST-SKU');

      expect(result).toEqual(mockProduct);
      expect(Product.findOne).toHaveBeenCalledWith({ sku: 'TEST-SKU' });
    });
  });

  describe('update', () => {
    it('should update product and return updated document', async () => {
      const updateData = { name: 'Updated Product', price: 399.99 };
      const mockUpdated = { _id: '1', ...updateData };
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await repository.update('1', updateData);

      expect(result).toEqual(mockUpdated);
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, { new: true });
    });

    it('should prevent SKU updates', async () => {
      const updateData = { sku: 'NEW-SKU', name: 'Updated' };
      const expectedData = { name: 'Updated' };
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await repository.update('1', updateData);

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('1', expectedData, { new: true });
    });
  });

  describe('delete', () => {
    it('should delete product and return true', async () => {
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '1' });

      const result = await repository.delete('1');

      expect(result).toBe(true);
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should return false if product not found', async () => {
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await repository.delete('999');

      expect(result).toBe(false);
    });
  });

  describe('search', () => {
    it('should search products by text query', async () => {
      const mockProducts = [{ _id: '1', name: 'Laptop' }];
      (Product.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts)
      });
      (Product.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await repository.search('laptop', { page: 1, limit: 10 });

      expect(result.products).toEqual(mockProducts);
      expect(result.total).toBe(1);
      expect(Product.find).toHaveBeenCalledWith({ $text: { $search: 'laptop' } });
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
