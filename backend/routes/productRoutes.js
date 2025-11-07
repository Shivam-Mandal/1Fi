import express from 'express';
import multer from 'multer';
import {
  getProducts,
  getProductBySlug,
  createProduct,
} from '../controllers/productController.js';
const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});    

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', upload.array('images',10), createProduct);
export default router;