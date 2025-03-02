import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './types/index';
import { registerUser } from './controllers/authController';
import connectDB from './config/db'; // Import the function

dotenv.config();
connectDB(); // Call the function here ✅

const app = express();
app.use(express.json());
app.use("/api", router);
app.post('/register', registerUser);

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
