import express from 'express';
import mongoose from 'mongoose';
import authRoutes from "./routes/authRoutes.js"
import communityRoutes from "./routes/CommunityFourmRoutes.js"
import MedRouter from "./routes/MedRouter.js"
import petRoutes from "./routes/petRoutes.js"
import petMateRoutes from "./routes/petMateRoutes.js"
import VetArticleRoute from "./routes/VetArticleRoute.js"
import healthRoutes from "./routes/healthRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
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

const mongooseConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log('Connected to MongoDB');
        
        // Listen for connection errors after initial connection
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });
    }
    catch (err) {
        console.error('Failed to connect to MongoDB', err);
        // If in production, we might want to exit and let the process manager restart
        if (process.env.NODE_ENV === 'production') {
            console.error('Exiting due to database connection failure');
            process.exit(1);
        }
    }
}
mongooseConnection();
app.use("/api/auth", authRoutes);
app.use("/api/community", communityRoutes); // Added proper prefix
app.use("/api/pets", petRoutes); // Added proper prefix
app.use("/api/medical", MedRouter); // Added proper prefix
app.use("/api/articles", VetArticleRoute); // Added proper prefix
app.use("/api/petmate", petMateRoutes); // Added proper prefix
app.use("/api/health", healthRoutes); // Health check endpoint
app.use("/api/upload", uploadRoutes); // File upload endpoint

app.listen(process.env.PORT,()=>{
    console.log('Server is running Now');
});