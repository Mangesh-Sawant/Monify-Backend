// controllers/categoryController.js
const Category = require('../models/Category');
const Transaction = require('../models/Transaction'); // Needed for deletion checks

// --- CREATE (Add a Category) ---
exports.addCategory = async (req, res) => {
    try {
        const { name, icon_url } = req.body;
        const user_id = req.user; // From auth middleware

        // Optional: Check if a category with this name already exists for the user
        const existingCategory = await Category.findOne({ user_id, name: name.trim() });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category with this name already exists for your account.' });
        }

        const newCategory = new Category({
            user_id,
            name: name.trim(), // Trim whitespace
            icon_url,
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);

    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Server error adding category.' });
    }
};

// --- READ (Retrieve All Categories for a User) ---
exports.getCategories = async (req, res) => {
    try {
        const user_id = req.user;
        const categories = await Category.find({ user_id }).sort({ name: 1 }); // Sort alphabetically
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error fetching categories.' });
    }
};

// --- UPDATE (Modify a Single Category) ---
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params; // Category ID from URL
        const user_id = req.user; // User ID from JWT
        const { name, icon_url } = req.body;

        // Optional: Check if new name already exists for another category for this user
        const existingCategory = await Category.findOne({ user_id, name: name.trim(), _id: { $ne: id } });
        if (existingCategory) {
            return res.status(400).json({ message: 'Another category with this name already exists for your account.' });
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: id, user_id }, // Find by ID and ensure it belongs to the user
            { name: name.trim(), icon_url }, // Update with new data
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found or unauthorized.' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Server error updating category.' });
    }
};

// --- DELETE (Remove a Single Category) ---
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user;

        // IMPORTANT: Check if there are any transactions associated with this category
        const transactionsCount = await Transaction.countDocuments({ category_id: id, user_id });
        if (transactionsCount > 0) {
            return res.status(400).json({ message: `Cannot delete category: ${transactionsCount} transactions are linked to it. Please reassign or delete linked transactions first.` });
        }

        const result = await Category.findOneAndDelete({ _id: id, user_id });

        if (!result) {
            return res.status(404).json({ message: 'Category not found or unauthorized.' });
        }

        res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error deleting category.' });
    }
};