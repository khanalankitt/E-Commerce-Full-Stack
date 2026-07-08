import categoryRepository from "./category.repository.js";
import {
  createCategorySchema,
  updateCategorySchema,
  getProductsByCategorySchema,
  objectIdParamSchema,
} from "./category.validation.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  GetProductsByCategoryQuery,
} from "./category.validation.js";

class CategoryService {
  async create(input: CreateCategoryInput) {
    const data = createCategorySchema.parse(input);

    const existing = await categoryRepository.findBySlug(data.slug);
    if (existing) {
      const error: any = new Error("A category with this slug already exists");
      error.statusCode = 409;
      throw error;
    }

    return categoryRepository.create(data);
  }

  async getAll() {
    return categoryRepository.findAll();
  }

  async getOne(id: string) {
    const validId = objectIdParamSchema.parse(id);

    const category = await categoryRepository.findById(validId);

    if (!category) {
      const error: any = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    return category;
  }

  async update(id: string, input: UpdateCategoryInput) {
    const validId = objectIdParamSchema.parse(id);
    const data = updateCategorySchema.parse(input);

    if (data.slug) {
      const existing = await categoryRepository.findBySlug(data.slug);
      if (existing && existing._id.toString() !== validId) {
        const error: any = new Error(
          "A category with this slug already exists",
        );
        error.statusCode = 409;
        throw error;
      }
    }

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
    const category = await categoryRepository.updateById(validId, updateData);

    if (!category) {
      const error: any = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    return category;
  }

  async delete(id: string) {
    const validId = objectIdParamSchema.parse(id);

    const category = await categoryRepository.deleteById(validId);

    if (!category) {
      const error: any = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    return category;
  }

  async getProductsByCategory(id: string, query: GetProductsByCategoryQuery) {
    const validId = objectIdParamSchema.parse(id);
    const { sort, page, limit } = getProductsByCategorySchema.parse(query);

    const category = await categoryRepository.findById(validId);
    if (!category) {
      const error: any = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "best-selling": { rating: -1 },
    };
    const sortQuery = sortMap[sort ?? "newest"] ?? { createdAt: -1 };

    const pageNum = page ?? 1;
    const limitNum = limit ?? 20;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      categoryRepository.findProductsByCategory({
        categoryId: validId,
        sort: sortQuery,
        skip,
        limit: limitNum,
      }),
      categoryRepository.countProductsByCategory(validId),
    ]);

    return {
      category,
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async getProductByCategorySlug(slug: string) {
    const result = await categoryRepository.findProductsByCategorySlug(slug);
    if (Array.isArray(result)) {
      const error: any = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    return {
      products: result.products,
      category: result.category,
    };
  }
}

export default new CategoryService();
