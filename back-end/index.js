const express = require('express'),
    app = express(), // Run express
    env = require('dotenv').config(), // Get environmental variables using dotenv
    port = process.env.PORT || 3000,
    ip = process.env.IP || '127.0.0.1',
    bodyParser = require('body-parser'); // make it possible to retrieve information from body of request

// Routes imports
const todoRoutes = require('./routes/todos'); // Import todo routes

const expressSanitizer = require('express-sanitizer');


// Implement and config body parser allowing to access the request body that comes in PUT or POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Mount express-sanitizer here
app.use(expressSanitizer()); // this line follows bodyParser() instantiations

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));


/*=== GET LANDING PAGE ROUTE ===*/
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.use('/api/todos', todoRoutes); // Use Todo routes

app.listen(port, ip, () => console.log(`Server running on port ${process.env.PORT}`));