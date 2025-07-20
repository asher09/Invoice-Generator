import mongoose, { Document, Schema } from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true 
  }, 
  qty: { 
    type: Number, 
    required: true 
  },
  rate: { 
    type: Number, 
    required: true 
  },
  total: { 
    type: Number, 
    required: true 
  },
  gst: { 
    type: Number, 
    required: true 
  },
});

const InvoiceSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  products: {
    type: [ProductSchema],
    required: true,
    validate: {
      validator: function(products: any[]) {
        return products && products.length > 0;
      }
    }
  },
  date: {
    type: Date,
    default: Date.now
  } 
},{
  timestamps: true
});


export const Invoice = mongoose.model('Invoice' , InvoiceSchema);


