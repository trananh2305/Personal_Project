import express from 'express';
import connectDB from './config/database';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from "./routes/index"

dotenv.config();

connectDB();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', 
  credentials: true, // Cho phép gửi cookie qua cross-origin
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

console.log('PORT:', process.env.PORT);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
