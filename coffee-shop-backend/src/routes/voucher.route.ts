import { Router } from "express";
import {
  createVoucher,
  getVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
} from "../controllers/voucher.controller.js";
import { authenticateToken, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

// Validate voucher is public (for staff/pos/customer)
router.post("/validate", authenticateToken, authorize(["ADMIN", "STAFF"]), validateVoucher);

// CRUD operations
router.get("/", authenticateToken, authorize(["ADMIN", "STAFF"]), getVouchers);
router.get("/:id", authenticateToken, authorize(["ADMIN", "STAFF"]), getVoucherById);
router.post("/", authenticateToken, authorize(["ADMIN"]), createVoucher);
router.put("/:id", authenticateToken, authorize(["ADMIN"]), updateVoucher);
router.delete("/:id", authenticateToken, authorize(["ADMIN"]), deleteVoucher);

export default router;
