import express from 'express';
import { userRouter } from "./routes/user";        
import { invoiceRouter } from "./routes/invoice";     
import dotenv from "dotenv";

dotenv.config();
import cors from 'cors';
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()) ;

app.use('/api/user',  userRouter);
app.use('/api/invoice', invoiceRouter);

app.get('/', (req, res) => {
    res.json({ message: "Invoice Generator API is running!" });
});

// app.listen(PORT, () => {
//     console.log(`Server is running on port http://localhost:${PORT}`)
// })
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Error:', err);
    res.status(500).json({ message: "Something went wrong!" });
});


export default app;