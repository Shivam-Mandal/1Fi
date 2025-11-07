import mongoose from 'mongoose';
import slugify from 'slugify';


const VariantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
});


const EMIPlanSchema = new mongoose.Schema({
    tenureMonths: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    monthlyPayment: { type: Number, required: true },
    cashback: { type: Number, default: 0 },
    fundBacked: { type: String },
});


const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    brand: { type: String },
    description: { type: String },
    variants: [VariantSchema],
    emiPlans: [EMIPlanSchema],
    createdAt: { type: Date, default: Date.now }
});


ProductSchema.pre('validate', function (next) {
    if (!this.slug && this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});


export default mongoose.model('Product', ProductSchema);