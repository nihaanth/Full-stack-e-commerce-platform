import { Product, IProduct } from '../models/Product';

interface PaginationOptions {
  page: number;
  limit: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}

interface PaginatedResult {
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export class ProductRepository {
  async findAll(options: PaginationOptions): Promise<PaginatedResult> {
    const { page, limit, category, minPrice, maxPrice, brand } = options;
    const filter: Record<string, any> = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).exec(),
      Product.countDocuments(filter)
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: string): Promise<IProduct | null> {
    return Product.findById(id);
  }

  async findBySku(sku: string): Promise<IProduct | null> {
    return Product.findOne({ sku });
  }

  async create(data: Partial<IProduct>): Promise<IProduct> {
    const product = new Product(data);
    return product.save();
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return result !== null;
  }

  async search(query: string, options: { page: number; limit: number }): Promise<PaginatedResult> {
    const skip = (options.page - 1) * options.limit;

    const [products, total] = await Promise.all([
      Product.find({ $text: { $search: query } })
        .skip(skip)
        .limit(options.limit)
        .exec(),
      Product.countDocuments({ $text: { $search: query } })
    ]);

    return {
      products,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit)
    };
  }
}
