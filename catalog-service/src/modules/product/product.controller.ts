import { uploadBufferToCloudinary } from "../../lib/uploadCloudinary.js";
import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Product } from "../../models/product.model.js";

class ProductController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, stock, category } = req.body;

      if (!req.file) {
        const error: any = new Error("Product image is required");
        error.statusCode = 400;
        throw error;
      }

      if (!Types.ObjectId.isValid(category)) {
        const error: any = new Error("Invalid category id");
        error.statusCode = 400;
        throw error;
      }

      const result = await uploadBufferToCloudinary(
        req.file.buffer,
        "products",
      );

      const product = await Product.create({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        image: result.secure_url,
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
      const { name, description, price, stock, category } = req.body;

      if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
        const error: any = new Error("Invalid product id");
        error.statusCode = 400;
        throw error;
      }

      if (
        category &&
        (typeof category !== "string" || !Types.ObjectId.isValid(category))
      ) {
        const error: any = new Error("Invalid category id");
        error.statusCode = 400;
        throw error;
      }

      const updates: Record<string, any> = {};
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (price !== undefined) updates.price = Number(price);
      if (stock !== undefined) updates.stock = Number(stock);
      if (category !== undefined) updates.category = category;

      if (req.file) {
        const result = await uploadBufferToCloudinary(
          req.file.buffer,
          "products",
        );
        updates.image = result.secure_url;
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
