import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Invoice from '../models/invoice';
import User from '../models/user';
import { z } from 'zod';
import puppeteer from 'puppeteer';

const generateInvoiceInput = z.object({
  products: z.array(z.object({
    name: z.string(),
    qty: z.number().min(1),
    rate: z.number().min(0)
  })).min(1, "At least one product is required")
});

export const generateInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;
    const { success } = generateInvoiceInput.safeParse(body);
    
    if (!success) {
      return res.status(411).json({ message: "Invalid product data" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productsWithTotals = body.products.map((product: any) => {
      const subtotal = product.qty * product.rate;
      const gst = subtotal * 0.18; 
      const total = subtotal + gst;
      
      return {
        name: product.name,
        qty: product.qty,
        rate: product.rate,
        gst: Number(gst.toFixed(2)),
        total: Number(total.toFixed(2))
      };
    });

    const invoice = await Invoice.create({
      user: req.userId,
      products: productsWithTotals,
      date: new Date()
    });

    const subtotal = productsWithTotals.reduce((sum: number, product: { qty: number; rate: number; }) => sum + (product.qty * product.rate), 0);
    const totalGst = productsWithTotals.reduce((sum: number, product: { gst: any; }) => sum + product.gst, 0);
    const grandTotal = subtotal + totalGst;

    const pdfBuffer = await generateInvoicePDF({
      invoiceId: invoice._id.toString(),
      user: {
        name: user.name,
        email: user.email
      },
      products: productsWithTotals,
      date: invoice.date,
      subtotal: Number(subtotal.toFixed(2)),
      totalGst: Number(totalGst.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2))
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice._id}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
    return;

  } catch (error: any) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate invoice" 
    });
  }
};

export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const invoices = await Invoice.find({ user: req.userId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 }); 

    const invoicesWithTotals = invoices.map(invoice => {
      const subtotal = invoice.products.reduce((sum, product) => sum + (product.qty * product.rate), 0);
      const totalGst = invoice.products.reduce((sum, product) => sum + product.gst, 0);
      const grandTotal = subtotal + totalGst;

      return {
        _id: invoice._id,
        products: invoice.products,
        date: invoice.date,
        createdAt: invoice.createdAt,
        subtotal: Number(subtotal.toFixed(2)),
        totalGst: Number(totalGst.toFixed(2)),
        grandTotal: Number(grandTotal.toFixed(2))
      };
    });

    res.json({
      success: true,
      invoices: invoicesWithTotals
    });

  } catch (error: any) {
    console.error('Get invoices error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to get invoices" 
    });
  }
};

async function generateInvoicePDF(invoiceData: any): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoiceData.invoiceId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 2px solid #3498db; padding-bottom: 20px; }
          .company-info h1 { color: #3498db; font-size: 28px; margin-bottom: 10px; }
          .company-info p { color: #666; }
          .invoice-info { text-align: right; }
          .invoice-title { font-size: 24px; font-weight: bold; color: #e74c3c; margin-bottom: 10px; }
          .invoice-details p { margin: 5px 0; }
          .customer-section { margin-bottom: 30px; }
          .customer-section h3 { color: #3498db; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .table th { background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 15px 12px; text-align: left; font-weight: bold; }
          .table td { padding: 12px; border-bottom: 1px solid #ddd; }
          .table tr:nth-child(even) { background-color: #f8f9fa; }
          .table tr:hover { background-color: #e8f4f8; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .totals { margin-top: 30px; }
          .totals-table { width: 300px; margin-left: auto; }
          .totals-table td { padding: 8px 12px; border: none; }
          .totals-table .total-label { font-weight: bold; }
          .subtotal-row { border-top: 1px solid #ddd; }
          .grand-total-row { background: linear-gradient(135deg, #27ae60, #229954); color: white; font-weight: bold; font-size: 16px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
          .amount { font-weight: bold; color: #27ae60; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-info">
              <h1>Your Company Name</h1>
              <p>123 Business Street<br>City, State 12345<br>Phone: (555) 123-4567<br>Email: info@company.com</p>
            </div>
            <div class="invoice-info">
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-details">
                <p><strong>Invoice #:</strong> ${invoiceData.invoiceId.slice(-6).toUpperCase()}</p>
                <p><strong>Date:</strong> ${new Date(invoiceData.date).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div class="customer-section">
            <h3>Bill To:</h3>
            <p><strong>${invoiceData.user.name}</strong></p>
            <p>${invoiceData.user.email}</p>
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Rate</th>
                <th class="text-right">GST (18%)</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.products.map((product: any) => `
                <tr>
                  <td><strong>${product.name}</strong></td>
                  <td class="text-center">${product.qty}</td>
                  <td class="text-right amount">$${product.rate.toFixed(2)}</td>
                  <td class="text-right amount">$${product.gst.toFixed(2)}</td>
                  <td class="text-right amount">$${product.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <table class="totals-table">
              <tr class="subtotal-row">
                <td class="total-label">Subtotal:</td>
                <td class="text-right amount">$${invoiceData.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="total-label">Total GST (18%):</td>
                <td class="text-right amount">$${invoiceData.totalGst.toFixed(2)}</td>
              </tr>
              <tr class="grand-total-row">
                <td class="total-label">GRAND TOTAL:</td>
                <td class="text-right">$${invoiceData.grandTotal.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p><strong>Thank you for your business!</strong></p>
            <p>Payment is due within 30 days. Please include invoice number on your payment.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    const pdfBuffer = Buffer.from(pdfUint8Array);

    return pdfBuffer;

  } finally {
    await browser.close();
  }
}