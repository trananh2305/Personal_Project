import express from 'express';
import http from 'http';
import connectDB from './config/database';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from "./routes/index";
import { setupSocket } from './socket';


dotenv.config();

connectDB();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

const server = http.createServer(app);

//  Gắn socket vào server
setupSocket(server);

//  Chạy server
server.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
