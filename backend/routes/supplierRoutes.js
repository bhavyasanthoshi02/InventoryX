import express from 'express';
import {
  getSuppliers,
  addSupplier,
  deleteSupplier,
} from '../controllers/supplierController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getSuppliers)
  .post(protect, admin, addSupplier);

router.route('/:id')
  .delete(protect, admin, deleteSupplier);

export default router;
