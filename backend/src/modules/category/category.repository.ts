import { Category } from "../../models/category.model.js";
import { Product } from "../../models/product.model.js";
import type { ICategory } from "../../models/category.model.js";
import type { SortOrder } from "mongoose";

interface FindProductsOptions {
  categoryId: string;
  sort: Record<string, SortOrder>;
  skip: number;
  limit: number;
}

class CategoryRepository {
  async create(data: Partial<ICategory>) {
    return Category.create(data);
  }

  async findAll() {
    return Category.find().sort({ name: 1 });
  }

  async findById(id: string) {
    return Category.findById(id);
  }

  async findBySlug(slug: string) {
    return Category.findOne({ slug });
  }

  async updateById(id: string, data: Partial<ICategory>) {
    return Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string) {
    return Category.findByIdAndDelete(id);
  }

  async findProductsByCategory({
    categoryId,
    sort,
    skip,
    limit,
  }: FindProductsOptions) {
    return Product.find({ category: categoryId })
      .populate("category", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async countProductsByCategory(categoryId: string) {
    return Product.countDocuments({ category: categoryId });
  }

  async findProductsByCategorySlug(slug: string) {
    const category = await Category.findOne({ slug });

    if (!category) {
      return [];
    }

    const products = await Product.find({
      category: category._id,
    });

    return { products, category };
  }
}

export default new CategoryRepository();
