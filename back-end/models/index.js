const mongoose = require('mongoose');
const env = require('dotenv').config();

// Allow debugging for mongoose (optional)
mongoose.set('debug', true);

// Connect to database
mongoose.connect(process.env.DATABASE_CONNECTION, { useNewUrlParser: true });

// Make it so that you can use .then and .catch insteach of callback functions (optional)
mongoose.Promise = Promise;

// Link to Todo Schema and model
module.exports.Todo = require('./todo');