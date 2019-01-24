const express = require('express'),
    router = express.Router(), // router will hold all routes declared throughout the app
    db = require('../models'), // db will be the index.js file inside models folder
    helpers = require('../helpers/todos');

/* INDEX and CREATE routes */
router.route('/')
.get(helpers.getTodos) /* INDEX */
.post(helpers.createTodo); /* CREATE */

/* SHOW, UPDATE and DELETE routes */
router.route('/:todo_id')
.get(helpers.getTodo) /* SHOW */
.put(helpers.updateTodo) /* UPDATE */
.delete(helpers.deleteTodo); /* DELETE */

// Export all routes
module.exports = router;
