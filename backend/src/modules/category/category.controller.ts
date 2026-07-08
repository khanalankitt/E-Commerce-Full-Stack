import type { Request, Response, NextFunction } from "express";
import categoryService from "./category.service.js";

class CategoryController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await categoryService.create(req.body);
      return res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryService.getAll();
      return res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await categoryService.getOne(String(req.params.id));
      return res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await categoryService.update(
        String(req.params.id),
        req.body,
      );
      return res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await categoryService.delete(String(req.params.id));
      return res
        .status(200)
        .json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  getProductsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { category, products, pagination } =
        await categoryService.getProductsByCategory(
          String(req.params.id),
          req.query as any,
        );
      return res
        .status(200)
        .json({ success: true, category, data: products, pagination });
    } catch (error) {
      next(error);
    }
  };

  getProductsByCategorySlug = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { products, category } =
        await categoryService.getProductByCategorySlug(String(req.params.slug));
      return res.status(200).json({ success: true, products, category });
    } catch (error) {
      next(error);
    }
  };
}

export default new CategoryController();
