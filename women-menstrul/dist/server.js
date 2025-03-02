import express from 'express';
import dotenv from 'dotenv';
import router from './routes/adminRoutes.js'; // Note the .js extension
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api", router);
app.get('/', (req, res) => {
    res.send('Server is running...');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
