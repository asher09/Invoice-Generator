
import "./db"; 
import { userRouter } from "./routes/user";        
import { invoiceRouter } from "./routes/invoice";     

const app = require('express');
 
app.route('/api/user',  userRouter);
app.route('/api/invoice', invoiceRouter);

export default app;