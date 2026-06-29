import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// DB config
import { connectDB } from './config/db.js';

// Route imports
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import { dashboardRoutes, logsRouter } from './routes/dashboardRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Error Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json()); // Built-in body parser for JSON

// Initial route
app.get('/', (req, res) => {
  res.send('InventoryX API is running...');
});

// Define sub-routes
app.use('/api/products', productRoutes);


app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/logs', logsRouter);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/users', authRoutes);


// Error Handling Middlewares (Must be at the very bottom)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
