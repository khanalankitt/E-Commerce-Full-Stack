import { Router } from "express";
import AddressController from "./address.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", AddressController.create);
router.get("/", AddressController.getAll);
router.get("/:addressId", AddressController.getOne);
router.patch("/:addressId", AddressController.update);
router.delete("/:addressId", AddressController.delete);
router.patch("/:addressId/default", AddressController.setDefault);

export default router;
