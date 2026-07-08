import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Product } from "../../models/product.model.js";

class ProductController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        price,
        stock,
        category,
        image,
        isFeatured,
        rating,
      } = req.body;

      if (!name || !description || price === undefined || !category || !image) {
        const error: any = new Error(
          "name, description, price, category, and image are required",
        );
        error.statusCode = 400;
        throw error;
      }

      if (typeof category !== "string" || !Types.ObjectId.isValid(category)) {
        const error: any = new Error("Invalid category id");
        error.statusCode = 400;
        throw error;
      }

      const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
        image,
        isFeatured,
        rating,
      });

      return res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        category,
        search,
        minPrice,
        maxPrice,
        minRating,
        isFeatured,
        sort = "newest",
        page = "1",
        limit = "20",
      } = req.query;

      const filter: Record<string, any> = {};

      if (
        category &&
        typeof category === "string" &&
        Types.ObjectId.isValid(category)
      ) {
        filter.category = category;
      }

      if (search) {
        filter.name = { $regex: search as string, $options: "i" };
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      if (minRating) {
        filter.rating = { $gte: Number(minRating) };
      }

      if (isFeatured !== undefined) {
        filter.isFeatured = isFeatured === "true";
      }

      const sortMap: Record<string, Record<string, 1 | -1>> = {
        newest: { createdAt: -1 },
        "price-asc": { price: 1 },
        "price-desc": { price: -1 },
        "best-selling": { rating: -1 },
      };
      const sortQuery = sortMap[sort as string] ?? sortMap.newest;

      const pageNum = Math.max(Number(page), 1);
      const limitNum = Math.max(Number(limit), 1);
      const skip = (pageNum - 1) * limitNum;

      const [products, total] = await Promise.all([
        Product.find(filter)
          .populate("category", "name")
          .sort(sortQuery)
          .skip(skip)
          .limit(limitNum),
        Product.countDocuments(filter),
      ]);

      return res.status(200).json({
        success: true,
        data: products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
        const error: any = new Error("Invalid product id");
        error.statusCode = 400;
        throw error;
      }

      const product = await Product.findById(id).populate("category", "name");

      if (!product) {
        const error: any = new Error("Product not found");
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
        const error: any = new Error("Invalid product id");
        error.statusCode = 400;
        throw error;
      }

      if (
        req.body.category &&
        (typeof req.body.category !== "string" ||
          !Types.ObjectId.isValid(req.body.category))
      ) {
        const error: any = new Error("Invalid category id");
        error.statusCode = 400;
        throw error;
      }

      const allowedFields = [
        "name",
        "description",
        "price",
        "stock",
        "category",
        "image",
        "isFeatured",
        "rating",
      ];

      const updates: Record<string, any> = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      }

      const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).populate("category", "name");

      if (!product) {
        const error: any = new Error("Product not found");
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
        const error: any = new Error("Invalid product id");
        error.statusCode = 400;
        throw error;
      }

      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        const error: any = new Error("Product not found");
        error.statusCode = 404;
        throw error;
      }

      return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();
