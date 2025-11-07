import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
};

const computeMonthlyEMI = (price, annualRatePercent, months) => {
  const monthlyRate = (annualRatePercent || 0) / 100 / 12;
  if (monthlyRate === 0) return +(price / months).toFixed(2);
  const r = monthlyRate;
  const emi = (price * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return +emi.toFixed(2);
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (err) {
    console.error('getProducts error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (err) {
    console.error('getProductBySlug error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, brand, description, variants: variantsRaw, emiPlans: emiPlansRaw } = req.body;

    if (!name || !variantsRaw) {
      return res.status(400).json({ message: 'Missing required fields: name and variants' });
    }

    let variants;
    try {
      variants = JSON.parse(variantsRaw);
    } catch (e) {
      return res.status(400).json({ message: 'variants must be a valid JSON array' });
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: 'variants should be a non-empty array' });
    }

    let emiPlans = [];
    if (emiPlansRaw) {
      try {
        const parsed = JSON.parse(emiPlansRaw);
        if (Array.isArray(parsed)) emiPlans = parsed;
        else return res.status(400).json({ message: 'emiPlans must be a JSON array if provided' });
      } catch (e) {
        return res.status(400).json({ message: 'emiPlans must be valid JSON' });
      }
    } else {
      const sampleTenures = [3, 6, 9, 12];
      const basePrice = Number(variants[0].price) || 0;

      emiPlans = sampleTenures.map((t) => {
        const rate =
          t === 3 ? 0 :
          t === 6 ? 10.5 :
          t === 9 ? 11.3 :
          t === 12 ? 11.5 : 10.5;

        const monthlyPayment = computeMonthlyEMI(basePrice, rate, t);

        return {
          tenureMonths: t,
          interestRate: rate,
          monthlyPayment,
          cashback: 0,
          fundBacked: 'ABC Mutual Fund'
        };
      });
    }

    const uploadedUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploadResult = await uploadBufferToCloudinary(file.buffer);
        uploadedUrls.push(uploadResult.secure_url);
      }
    }

    if (uploadedUrls.length) {
      if (!variants[0].images) variants[0].images = [];
      variants[0].images = variants[0].images.concat(uploadedUrls);
    }

    const product = new Product({ name, brand, description, variants, emiPlans });
    await product.save();

    return res.status(201).json(product);
  } catch (err) {
    console.error('createProduct error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
