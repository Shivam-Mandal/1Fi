import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dotenv from 'dotenv';  
dotenv.config();
import { initCloudinary } from './config/cloudinary.js';
import connectDB from './config/db.js';

const app = express();
connectDB();
initCloudinary();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => res.send('Products Backend is running'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});