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
  products: [ProductSchema]
})


const Invoice = mongoose.model('Invoice' , InvoiceSchema);
export default Invoice;