import express from 'express';
import { userRouter } from "./routes/user";        
// import { invoiceRouter } from "./routes/invoice";     
import "./db";

import dotenv from "dotenv";
dotenv.config();
process.env.DEBUG = '';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT
 
app.use('/api/user',  userRouter);
// app.use('/api/invoice', invoiceRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})

export default app;