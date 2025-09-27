// controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Category = require('../models/Category'); // Might be needed for validation

// --- CREATE (Add a Transaction) ---
exports.addTransaction = async (req, res) => {
    try {
        const { amount, description, category_id, type, date } = req.body;

        // The user ID is retrieved from the JWT token via the auth middleware
        const user_id = req.user;

        // 1. Optional: Validate that the category exists and belongs to the user
        const category = await Category.findOne({ _id: category_id, user_id });
        if (!category) {
            return res.status(404).json({ message: 'Category not found or does not belong to user.' });
        }

        // 2. Create the transaction
        const newTransaction = new Transaction({
            user_id,
            amount,
            description,
            category_id,
            type,
            date: new Date(date), // Ensure date is correctly parsed
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);

    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ message: 'Server error adding transaction.' });
    }
};

// --- READ (Retrieve All Transactions for a User) ---
exports.getTransactions = async (req, res) => {
    try {
        const user_id = req.user;

        // Find all transactions for the authenticated user and sort by date
        const transactions = await Transaction.find({ user_id })
            .sort({ date: -1 })
            .populate('category_id', 'name icon_url'); // Join with category data

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server error fetching transactions.' });
    }
};

// --- UPDATE (Modify a Single Transaction) ---
exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params; // Transaction ID from URL
        const user_id = req.user; // User ID from JWT

        // Find and update the transaction, ensuring it belongs to the user (user_id)
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: id, user_id },
            req.body,
            { new: true, runValidators: true } // {new: true} returns the updated document
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized.' });
        }

        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Server error updating transaction.' });
    }
};

// --- DELETE (Remove a Single Transaction) ---
exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user;

        // Find and delete the transaction, ensuring it belongs to the user
        const result = await Transaction.findOneAndDelete({ _id: id, user_id });

        if (!result) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized.' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully.' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Server error deleting transaction.' });
    }
};