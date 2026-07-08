import { Product } from "../../models/product.model.js";
import type {
  CreateProductInput,
  UpdateProductInput,
  GetAllProductsQuery,
} from "./product.validation.js";

import {
  createProductSchema,
  updateProductSchema,
  getAllProductsSchema,
  objectIdParamSchema,
} from "./product.validation.js";

class ProductService {
  async create(input: CreateProductInput) {
    const data = createProductSchema.parse(input);
    return Product.create(data);
  }

  async getAll(query: GetAllProductsQuery) {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      minRating,
      isFeatured,
      sort,
      page,
      limit,
    } = getAllProductsSchema.parse(query);

    const filter: Record<string, any> = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (minRating !== undefined) filter.rating = { $gte: minRating };
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "best-selling": { rating: -1 },
    };
    const sortQuery = sortMap[sort ?? "newest"];

    const pageNum = page ?? 1;
    const limitNum = limit ?? 20;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async getOne(id: string) {
    const validId = objectIdParamSchema.parse(id);

    const product = await Product.findById(validId).populate(
      "category",
      "name",
    );

    if (!product) {
      const error: any = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    return product;
  }

  async update(id: string, input: UpdateProductInput) {
    const validId = objectIdParamSchema.parse(id);
    const data = updateProductSchema.parse(input);

    const product = await Product.findByIdAndUpdate(validId, data, {
      new: true,
      runValidators: true,
    }).populate("category", "name");

    if (!product) {
      const error: any = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    return product;
  }

  async delete(id: string) {
    const validId = objectIdParamSchema.parse(id);

    const product = await Product.findByIdAndDelete(validId);

    if (!product) {
      const error: any = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    return product;
  }
}

export default new ProductService();
