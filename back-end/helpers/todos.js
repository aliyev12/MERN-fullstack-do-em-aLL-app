const db = require('../models');

// const entityMap = {
//     '&': '&amp;',
//     '<': '&lt;',
//     '>': '&gt;',
//     '"': '&quot;',
//     "'": '&#39;',
//     '/': '&#x2F;',
//     '`': '&#x60;',
//     '=': '&#x3D;'
//   };

const entityMap = {
    '&': ' and ',
    '<': ' (greater than) ',
    '>': ' (less than) ',
    '"': '',
    "'": ' (quote) ',
    '/': ' (slash) ',
    '`': '',
    '=': ' (equal to) ',
    '{': '',
    '}': ''
};

const escapeHtml = string => {
    return String(string).replace(/[&<>"'`=\/{}]/g, s => entityMap[s]);
}

/*=== GET INDEX ROUTE - list all todos '/api/todos' ===*/
exports.getTodos = (req, res) => {
    // Find all todos using mongoose and Todo model stored in db variable
    db.Todo.find()
        .then(todos => res.json(todos)) // send all todos in json format to the requestor
        .catch(err => res.send(err));
}

/*=== POST CREATE ROUTE - create new todo '/api/todos' ===*/
exports.createTodo = (req, res) => {
    req.body.name = req.sanitize( escapeHtml (JSON.stringify(req.body.name) ) );
    //req.body.name = req.sanitize(req.body.name);
    //req.body.name = escapeHtml(req.body.name);
    if (req.body.name.length > 0 && typeof req.body.name === 'string') {
        if (req.body.completed || req.body.created_date || req.body._id) {
            return res.status(500).json({
                message: 'Something went wrong.'
            });
        }
        db.Todo.create(req.body)
            .then(newTodo => {
                res.status(201).json(newTodo);
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Something went wrong.'
                });
            });
    } else {
        res.status(500).json({
            message: 'Something went wrong.'
        });
    }
}
// <script>alert('boo')</script>
/*=== GET SHOW ROUTE - retrieve a single todo '/api/todos/:todo_id' ===*/
exports.getTodo = (req, res) => {
    db.Todo.findById(req.params.todo_id)
        .then(foundTodo => res.json(foundTodo))
        .catch(err => {
            res.send(err);
        });
}

/*=== PUT UPDATE ONE TODO ROUTE - update a single todo '/api/todos/:todo_id' ===*/
exports.updateTodo = (req, res) => {
    // Sanitize the name of todo that comes with request
    // Escape all html for the name of todo that comes with the request
    req.body.name = req.sanitize( escapeHtml (JSON.stringify(req.body.name) ) );
    //req.body.name = req.sanitize(req.body.name);
    //req.body.name = escapeHtml(req.body.name);
    // Check if name if not blank and it is of type string
    if (req.body.name.length > 0 && typeof req.body.name === 'string') {
        // If a request is trying to hard code a created date or an id for new todo, throw an error
        // This could only be happening if the request is being modified by someone using something like postman - not good!
        if (req.body.created_date || req.body._id) {
            return res.status(400).json({
                message: 'Error: Do not try modifying date or an id of todo that needs to be updated!'
            });
        }

        // Find the todo in mongo database based on id that comes in as a param
        db.Todo.findOneAndUpdate({
                _id: req.params.todo_id
            }, req.body, {
                // Setting new to true makes sure that a newly created todo goes back to the user
                new: true
            })
            // Send a new todo stringified as json back to the user
            .then(todo => res.json(todo))
            .catch(err => res.status(500).json({
                // Send a custom message to the user notifying that something went wrong while updating todo
                customMessage: 'Something went wrong while updating todo.',
                // Check and see if the err object contains the message and send it to the user as well
                // if not, then just say that there is no message...
                message: err.message || '- Error object does not contain a message -'
            }));

    } else {
        // If an updated todo came in blank or came in in a format other than string, throw an error message
        res.status(400).json({
            message: 'Todo name should not be blank and should consist of letters and numbers'
        });
    }
}

/*=== DELETE DESTROY ROUTE - delete a single todo '/api/todos/:todo_id' ===*/
exports.deleteTodo = (req, res) => {
    db.Todo.remove({
            _id: req.params.todo_id
        })
        .then(() => res.json({
            message: 'Todo has been deleted'
        }))
        .catch(err => {
            err.customMessage = 'This is a custom message from developer from the server. Seems like the id that was passed on to the server was not found in the database';
            return res.status(404).send(err);
        });
}

module.exports = exports;