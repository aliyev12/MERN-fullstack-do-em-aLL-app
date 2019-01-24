$(document).ready(() => {
    $.getJSON('/api/todos')
        .then(addTodos)
        .catch(err => console.log(err));

    $('#todoInput').keypress(event => {
        if (event.which == 13) {
            createTodo();
        }
    });

    $('.list').on('click', 'li', function(e) {
        updateTodo($(this));
    });

    $('.list').on('click', 'span', function(e) {
        e.stopPropagation();
        removeTodo($(this).parent());
    });
});

// Display all todos currently in the database
const addTodos = todos => {
    // Add todos to page here
    todos.forEach(todo => {
        addTodo(todo);
    });
}

// Create request to create a new todo
const createTodo = () => {
    const userInput = $('#todoInput').val();
    $.post('api/todos', {
            name: userInput
        })
        .then(newTodo => {
            $('#todoInput').val('');
            addTodo(newTodo);
        })
        .catch(err => {
            $('#todoInput').val('');
            console.log(err);
        });
}

// Insert new todo into UI
const addTodo = todo => {
    // const newTodo = $(`
    // <li class="task">
    //     ${todo.name}
    //     <span>X</span>
    // </li>`);
    
    const li = document.createElement('li');
    const span = document.createElement('span');
    li.classList.add('task');
    const todoName = document.createTextNode(todo.name);
    const xx = document.createTextNode('X');
    li.appendChild(todoName);
    span.appendChild(xx);
    li.appendChild(span);
    const newTodo = $(li);


    newTodo.data('id', todo._id);
    newTodo.data('completed', todo.completed);
    if (todo.completed) {
        newTodo.addClass('done');
    }
     $('.list').append(newTodo);
}


const removeTodo = todo => {
    const clickedId = todo.data('id');
    const deleteUrl = `/api/todos/${clickedId}`;
    
    $.ajax({
        method: 'DELETE',
        url: deleteUrl
    })
    .then(data => {
        todo.remove();
    })
    .catch(err => console.log(err));
}

const updateTodo = todo => {
    const updateUrl = `/api/todos/${todo.data('id')}`;
    const isDone = !todo.data('completed');
    const updateData = {completed: isDone};
    $.ajax({
        method: 'PUT',
        url: updateUrl,
        data: updateData
    })
    .then(updatedTodo => {
        todo.toggleClass('done');
        todo.data('completed', isDone);
    })
    .catch(err => console.log(err));
}


