const mongoose = require('mongoose');

// Create a todo schema
const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name cannot be blank' // Error message in case if name is ommited
    },
    completed: {
        type: Boolean,
        default: false // Default value when completed is not explicitly specified
    },
    created_date: {
        type: Date,
        default: Date.now // Default is current date
    }
});

// Export a Todo model using the todoSchema
module.exports = mongoose.model('Todo', todoSchema);