// server.js
const express = require('express');
const app = express();
const connectDB = require('./config/db'); // Import the database connection function
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
require('dotenv').config();

// Connect to the database and then start the server
const startServer = async () => {
    try {
        await connectDB(); // Wait for the database connection to complete

        // Middleware
        app.use(express.json());

        // Routes
        app.use('/api/users', userRoutes);
        app.use('/api/transactions', transactionRoutes);
        app.use('/api/categories', categoryRoutes);


        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is now running and connected to MongoDB on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);xq
        process.exit(1); // Exit the process with an error code
    }
};

startServer();