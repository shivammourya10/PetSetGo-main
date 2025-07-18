import express from 'express';
import mongoose from 'mongoose';
import authRoutes from "./routes/authRoutes.js"
import communityRoutes from "./routes/CommunityFourmRoutes.js"
import MedRouter from "./routes/MedRouter.js"
import petRoutes from "./routes/petRoutes.js"
import petMateRoutes from "./routes/petMateRoutes.js"
import VetArticleRoute from "./routes/VetArticleRoute.js"
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from 'cors';

const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());
// Enable CORS for all routes
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
dotenv.config({
    path: './.env',
});
app.use(bodyParser.urlencoded({ extended: true }));
console.log('MongoDB URI:', process.env.MONGO_URI);

const mongooseConnection = async ()=>{
    try{
       await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    }
    catch(err){
        console.error('Failed to connect to MongoDB', err);
    }
}
mongooseConnection();
app.use("/api/auth", authRoutes);
app.use("/api/community", communityRoutes); // Added proper prefix
app.use("/api/pets", petRoutes); // Added proper prefix
app.use("/api/medical", MedRouter); // Added proper prefix
app.use("/api/articles", VetArticleRoute); // Added proper prefix
app.use("/api/petmate", petMateRoutes); // Added proper prefix

app.listen(process.env.PORT,()=>{
    console.log('Server is running Now');
});