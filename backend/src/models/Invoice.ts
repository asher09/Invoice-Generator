import mongoose, { Document, Schema } from 'mongoose';

interface IProduct {
  name: string;
  qty: number;
  rate: number;
  total: number;
  gst: number;
}

interface IInvoice extends Document {
  user: mongoose.Types.ObjectId;
  products: IProduct[];
  date: Date;
}

const productSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  qty: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  rate: {
    type: Number,
    required: [true, 'Rate is required'],
    min: 0
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: 0
  },
  gst: {
    type: Number,
    required: [true, 'GST is required'],
    min: 0
  }
}, { _id: false }); 



const invoiceSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  products: {
    type: [productSchema],
    required: [true, 'Products array is required'],
    validate: {
      validator: function(products: IProduct[]) {
        return products && products.length > 0;
      },
      message: 'At least one product is required'
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);

export default Invoice;

