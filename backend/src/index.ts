import express from 'express';
import { userRouter } from "./routes/user";        
import { invoiceRouter } from "./routes/invoice";     
import "./db";
const cors = require('cors')

import dotenv from "dotenv";
dotenv.config();
process.env.DEBUG = '';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
    ?['https://levitation-invgen.vercel.app']
    : ['http://localhost:5173'],
    credentials: true
}))


const PORT = 3000
 
app.use('/api/user',  userRouter);
app.use('/api/invoice', invoiceRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})

export default app;