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
      const total = product.qty * product.rate;
      const gst = total * 0.18;
      
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #0A0A0A;
          background: #FFFFFF;
          width: 100%;
          height: 842px;
          margin: 0 auto;
          padding: 0;
          box-sizing: border-box;
        }
        .container {
          padding: 0px;
          width: 100%;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 32px 0 0 0;
          margin-bottom: 0;
          width: 100%;
        }
        .logo-section {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-left: 34px;
        }
        .logo-box {
          width: 40px;
          height: 40px;
          background: #000000;
          position: relative;
          isolation: isolate;
          border-radius: 12px;
          margin-top: 2px;
        }
        .logo-box div:nth-child(1) {
          position: absolute;
          width: 8px;
          height: 24px;
          left: 26px;
          top: 8px;
          background: #FFFFFF;
          border-radius: 3px;
        }
        .logo-box div:nth-child(2) {
          position: absolute;
          width: 8px;
          height: 24px;
          left: 6px;
          top: 8px;
          background: #FFFFFF;
          border-radius: 3px;
        }
        .company-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: 2px;
        }
        .company-text .name {
          font-weight: 700;
          font-size: 17px;
          line-height: 28px;
          color: #000000;
        }
        .company-text .sub {
          font-weight: 400;
          font-size: 8px;
          color: #000000;
          margin-top: -2px;
        }
        .invoice-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-right: 34px;
          margin-top: 4px;
        }
        .invoice-meta .title {
          font-weight: 700;
          font-size: 18px;
          letter-spacing: 0.5px;
          color: #151515;
        }
        .invoice-meta .tagline {
          font-weight: 500;
          font-size: 12px;
          color: #6D6F7B;
          margin-top: -3px;
        }
        .invoice-meta .date-row {
          margin-top: 16px;
          font-weight: 500;
          font-size: 12px;
          color: #000;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        /* Info Bar */
        .info-bar {
          background: linear-gradient(90deg, #202554 0%, #263406 100%);
          height: 98px;
          margin: 30px 34px 0 34px;
          border-radius: 16px;
          padding: 20px 32px 20px 32px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          box-sizing: border-box;
        }
        .info-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .info-left .label {
          color: #fff;
          font-size: 13px;
          font-weight: 400;
          opacity: 0.9;
        }
        .info-left .name {
          color: #CCF575;
          font-size: 18px;
          font-weight: 600;
          margin-top: 2px;
        }
        .info-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          margin-right: 0;
          margin-top: 2px;
        }
        .info-right .date-label {
          color: #fff;
          font-size: 13px;
          font-weight: 400;
          opacity: 0.9;
        }
        .info-right .date {
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          margin-top: 2px;
        }
        .info-right .email {
          background: #fff;
          padding: 6px 16px;
          border-radius: 24px;
          color: #000;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(170,170,170,0.07);
          margin-top: 2px;
        }
        /* Table */
        .table-section {
          margin: 35px 0 0 0;
          padding: 0 34px;
        }
        .table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(44,44,44,0.03);
          margin-bottom: 0;
        }
        .table thead tr {
          background: linear-gradient(90deg, #232A49 0%, #2B3D13 100%);
          color: #fff;
          height: 38px;
          font-size: 13px;
        }
        .table th {
          font-size: 13px;
          font-weight: 600;
          padding: 8px 0 8px 16px;
          text-align: left;
          border: none;
        }
        .table th:last-child, .table td:last-child { text-align: right; padding-right: 16px;}
        .table th:nth-child(2), .table td:nth-child(2) { text-align: center;}
        .table tbody tr {
          font-size: 13px;
          font-weight: 500;
          height: 42px;
        }
        .table tbody tr:nth-child(even) {
          background: #F8F8F8;
        }
        .table tbody tr:nth-child(odd) {
          background: #FFFFFF;
        }
        .table td {
          font-size: 13px;
          padding: 0 0 0 16px;
          border: none;
          vertical-align: middle;
        }
        /* Amount Box */
        .amount-box {
          margin: 30px 34px 0 0;
          background: #FFFFFF;
          border: 1px solid #E8E8E8;
          border-radius: 12px;
          padding: 24px 30px 16px 30px;
          width: 270px;
          float: right;
          box-shadow: 0 1px 8px rgba(44,44,44,0.04);
          font-size: 13px;
        }
        .amount-box .row {
          display: flex;
          justify-content: space-between;
          color: #6D6F7B;
          margin: 8px 0;
          font-size: 13px;
          font-weight: 500;
        }
        .amount-box .total-label {
          color: #333;
        }
        .amount-box .grand-row {
          font-weight: 700;
          color: #0A0A0A;
          margin-top: 12px;
          font-size: 15px;
          border-top: 1px solid #e7e7e7;
          padding-top: 12px;
        }
        .amount-box .grand-amount {
          color: #175EE2;
          font-size: 16px;
          font-weight: bold;
        }
        .date-bottom {
          clear: both;
          font-size: 12px;
          color: #222;
          margin: 24px 0 0 34px;
        }
        .footer {
          background:#272833;
          color: #fff;
          font-size: 11px;
          text-align: center;
          padding: 16px 28px;
          border-radius: 28px;
          margin: 50px auto 0px auto;
          width: 90%;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!----Header--->
        <div class="header">
          <div class="logo-section">
            <div class="logo-box">
              <div></div>
              <div></div>
            </div>
            <div class="company-text">
              <span class="name">Levitation</span>
              <span class="sub">infoTech</span>
            </div>
          </div>
          <div class="invoice-meta">
            <span class="title">INVOICE GENERATOR</span>
            <span class="tagline">Sample Output should be this</span>
            <!-- For the sample, you may place the date here, but we also show it in info bar -->
          </div>
        </div>

        <!-- Info Bar--->
        <div class="info-bar">
          <div class="info-left">
            <span class="label">Name</span>
            <span class="name">${invoiceData.user.name}</span>
          </div>
          <div class="info-right">
            <span class="date-label">Date: ${new Date(invoiceData.date).toLocaleDateString()}</span>
            <span class="email">${invoiceData.user.email}</span>
          </div>
        </div>

        <!---Table Section -->
        <div class="table-section">
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.products.map((product: any) => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.qty}</td>
                  <td>USD ${product.rate}</td>
                  <td>USD ${product.total}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-----Amount Box---!>
        <div class="amount-box">
          <div class="row">
            <span>Total Charges</span>
            <span>$${invoiceData.subtotal}</span>
          </div>
          <div class="row">
            <span>GST (18%)</span>
            <span>$${invoiceData.totalGst}</span>
          </div>
          <div class="row grand-row">
            <span>Total Amount</span>
            <span class="grand-amount">&#8377; ${invoiceData.grandTotal}</span>
          </div>
        </div>

        <div style="clear: both;"></div>
        <div class="date-bottom">
          Date: ${new Date(invoiceData.date).toLocaleDateString()}
        </div>

        <div class="footer">
          We are pleased to provide any further information you may require and look forward to assisting with your next order. Rest assured, it will receive our prompt and dedicated attention.
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