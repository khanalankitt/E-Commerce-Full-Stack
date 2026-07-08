import { Product } from "../../models/product.model.js";
import type { IProduct } from "../../models/product.model.js";

import type { QueryFilter, SortOrder } from "mongoose";

interface FindAllOptions {
  filter: QueryFilter<IProduct>;
  sort: Record<string, SortOrder>;
  skip: number;
  limit: number;
}

class ProductRepository {
  async create(data: Partial<IProduct>) {
    return Product.create(data);
  }

  async findAll({ filter, sort, skip, limit }: FindAllOptions) {
    return Product.find(filter)
      .populate("category", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async count(filter: QueryFilter<IProduct>) {
    return Product.countDocuments(filter);
  }

  async findById(id: string) {
    return Product.findById(id).populate("category", "name");
  }

  async updateById(id: string, data: Partial<IProduct>) {
    return Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("category", "name");
  }

  async deleteById(id: string) {
    return Product.findByIdAndDelete(id);
  }
}

export default new ProductRepository();
