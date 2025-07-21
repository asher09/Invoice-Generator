import express from 'express';
import { userRouter } from "./routes/user";        
import { invoiceRouter } from "./routes/invoice";     
import './db'
import dotenv from "dotenv";

dotenv.config();
import cors from 'cors';
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()) ;
// const PORT = process.env.PORT || 3000;

app.use('/api/user',  userRouter);
app.use('/api/invoice', invoiceRouter);

app.get('/', (req, res) => {
    res.json({ message: "Invoice Generator API is running!" });
});

// app.listen(PORT, () => {
//     console.log(`Server is running on port http://localhost:${PORT}`)
// })



export default app;