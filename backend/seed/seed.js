import connectDB from '../config/db.js';
import { initCloudinary } from '../config/cloudinary.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

const computeMonthlyEMI = (price, annualRatePercent, months) => {
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return Math.round(price / months);
  const emi = (price * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}; 

const generateEmiPlans = (price) => {
  const tenures = [3, 6, 9, 12, 24];
  return tenures.map((t) => {
    const rate =
      t === 3 ? 0 :
        t === 6 ? 10.5 :
          t === 9 ? 11.3 :
            t === 12 ? 11.5 :
              t === 24 ? 12.6 : 10.5;

    return {
      tenureMonths: t,
      interestRate: rate,
      monthlyPayment: computeMonthlyEMI(price, rate, t),
      cashback: t === 24 ? 2000 : 0,
      fundBacked: 'Long Term Value Fund'
    };
  });
};

const seed = async () => {
  try {
    await connectDB();
    initCloudinary();

    await Product.deleteMany({});

    const products = [
      {
        name: 'Google Pixel 9 Pro',
        brand: 'Google',
        description: 'Premium Android phone with AI-powered camera and Tensor G4 chip',
        variants: [
          {
            name: '256 GB / Porcelain', mrp: 112999, price: 107999, stock: 15, images: [
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453385/products/hchdf1nry0lpnq9f4bbn.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453715/products/efdyaapyvtbcwncgnzdz.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453784/products/zjzzoa4h1rhkgq1s9dgh.jpg",
            ]
          },
          {
            name: '512 GB / Obsidian Black', mrp: 122999, price: 117999, stock: 8, images: [
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453385/products/hchdf1nry0lpnq9f4bbn.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453715/products/efdyaapyvtbcwncgnzdz.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453784/products/zjzzoa4h1rhkgq1s9dgh.jpg",
            ]
          }
        ],
        emiPlans: generateEmiPlans(107999)
      },
      {
        name: 'Nothing Phone 3 Pro',
        brand: 'Nothing',
        description: 'Minimalist design with transparent body and Glyph LED interface',
        variants: [
          {
            name: '256 GB / Clear White', mrp: 65999, price: 62999, stock: 20, images: [
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453827/products/ymfsexmzolyz0zueepu5.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453850/products/pj8fmb9ps1anlghtov3j.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453875/products/xwkxtobw0hsuadwswjzj.jpg",
            ]
          },
          {
            name: '512 GB / Smoke Black', mrp: 71999, price: 68999, stock: 10, images: [
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453827/products/ymfsexmzolyz0zueepu5.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453850/products/pj8fmb9ps1anlghtov3j.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453875/products/xwkxtobw0hsuadwswjzj.jpg",
            ]
          }
        ],
        emiPlans: generateEmiPlans(62999)
      },
      {
        name: 'ASUS ROG Phone 8 Ultimate',
        brand: 'ASUS',
        description: 'Gaming powerhouse with AMOLED display and advanced cooling system',
        variants: [
          {
            name: '512 GB / Phantom Blue', mrp: 109999, price: 104999, stock: 12, images: [
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453902/products/ezgpscpgzyar9encdq74.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453994/products/qdhd3jxfzrx5mhvek66s.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762454059/products/qe9frctm4862jqdl7oer.jpg",
            ]
          },
          {
            name: '1 TB / Matte Black', mrp: 119999, price: 114999, stock: 6, images: [
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453902/products/ezgpscpgzyar9encdq74.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762453994/products/qdhd3jxfzrx5mhvek66s.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762454059/products/qe9frctm4862jqdl7oer.jpg",
            ]
          }
        ],
        emiPlans: generateEmiPlans(104999)
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        description: 'Flagship smartphone with Snapdragon 8 Gen 3, 200MP camera, and S Pen support',
        variants: [
          {
            name: '256 GB / Titanium Gray', mrp: 139999, price: 134999, stock: 12, images: [
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762454080/products/vgh0mcow85b8uqitdjke.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762454103/products/x6ilkwttrecd1hk1etfp.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762454133/products/b13jbfg5m3rejwscugim.jpg"
            ]
          },
          {
            name: '512 GB / Titanium Black', mrp: 149999, price: 144999, stock: 9, images: [
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762454080/products/vgh0mcow85b8uqitdjke.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762454103/products/x6ilkwttrecd1hk1etfp.jpg",
              "https://res.cloudinary.com/dl6fl5lpc/image/upload/v1762454133/products/b13jbfg5m3rejwscugim.jpg"
            ]
          }
        ],
        emiPlans: generateEmiPlans(134999)
      }
    ];

    await Product.insertMany(products);
    console.log('Seeding successful: All products with EMI 3–24 months!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
