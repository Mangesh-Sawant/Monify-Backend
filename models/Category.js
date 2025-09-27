const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    // Link this category to a user, ensuring they only see their own categories
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    icon_url: {
        type: String,
        default: null,
    },
}, { timestamps: true }); // Mongoose adds createdAt and updatedAt fields

module.exports = mongoose.model('Category', CategorySchema);