import React, {Component} from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import * as apiCalls from './api';

const APIURL = '/api/todos/';

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: []
        };
        this.addTodo = this.addTodo.bind(this);
    }

    componentWillMount() {
        this.loadTodos();
    }

    loadTodos() {
        // Fetch json data from the url
        fetch(APIURL)
        .then(resp => {
            // Check if there was anything wrong with the response before json parsing it
            if (!resp.ok) {
                // At this point it has been identified that there is an issue.
                // Check if the response status code is betweek 400 and 500.
                if (resp.status >= 400 && resp.status < 500) {
                    // It it is, then stop execution of all the code and throw an error with message that comes from the server
                    return resp.json().then(data => {
                        let err = {errorMessage: data.message};
                        throw err;
                    })
                // If the code is not between 400 and 500, then you won't really know what went wrong
                // In that case, stop everything and throw an error with some generic message
                } else {
                    let err = {errorMessage: 'Please try again later, server is not responding'};
                    throw err;
                }
            }
            // If everything is ok with the response, then go ahead and return parsed json to the next .then() block
            return resp.json();
        })
        .then(todos => this.setState({todos}));
    }

    addTodo(val) {
        fetch(APIURL, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({name: val})
        })
        .then(resp => {
            /*=== ERROR HANDLE ===*/
            if(!resp.ok) {
                if (resp.status >= 400 && resp.status < 500 && typeof resp === 'string') {
                    return resp.json()
                    .then(data => {
                        let err = {errorMessage: data.message};
                        throw err;
                    })
                } else {
                    let err = 'Please try again later, server is not responding';
                    throw err;
                }
            }
            /*=== END OF ERROR HANDLE ===*/
            return resp.json();
        })
        .then(newTodo => this.setState({
            todos: [
                ...this.state.todos,
                newTodo
            ]
        }));
    }

    deleteTodo(id) {
        // const deleteUrl = `${APIURL}${id}`;
        const deleteUrl = `${APIURL}${id}`;
        fetch(deleteUrl, {
            method: 'DELETE'
        })
        .then(resp => {
            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500 && typeof resp === 'string') {
                    return resp.json()
                    .then(data => {
                        let err = {errorMessage: data.message, messageFromServerDeveloper: data.customMessage};
                        throw err;
                    })
                } else {
                    let err = 'Please try again later, server is not responding';
                    throw err;
                }
            }
            console.log(`Successfully deleted with status ${resp.status}`);
            return resp.json();
        })
        .then(() => {
            const todos = this.state.todos.filter(todo => todo._id !== id);
            this.setState({todos});
        })
    }

    toggleTodo(todo) {
        const updateUrl = `${APIURL}${todo._id}`;
        fetch(updateUrl, {
            method: 'PUT',
            headers: new Headers({
                'Content-Type' : 'application/json'
            }),
            body: JSON.stringify({completed: !todo.completed})
        })
        .then(resp => {
            // Check if there are any errors
            if (!resp.ok) {
                // Check if error codes are known, aka between 400 and 499
                if (resp.status >= 400 && resp.status < 500 && typeof resp === 'string') {
                    // Parse the data to extract the error message that is coming from the server
                    return resp.json()
                    .then(data => {
                        // Construct an error message using error message that comes from the back end
                        let err = {errorMessage: data.message};
                        // Terminate current method/function by logging the error to the user
                        throw err;
                    })
                } else {
                    // In this case, you have no idea what the error is, so go ahead and throw a generic error message to the user - at least something!
                    let err = 'Please try again later, server is not responding :(';
                    throw err;
                }
            }
            // If there are no errors, then return parsed data to the next .then() block
            return resp.json();
        })
        .then(updatedTodo => {
            const todos = this.state.todos.map(t => (
                (t._id === updatedTodo._id)
                ? {...t, completed: !t.completed}
                : t
            ));
            this.setState({todos});
        })
    }

    render() {
        const todos = this.state.todos.map(t => (
            <TodoItem 
                key={t._id}
                {...t}
                onDelete={this.deleteTodo.bind(this, t._id)}
                onToggle={this.toggleTodo.bind(this, t)}
            />
        ));
        return (
            <>
                <h1>Todo List</h1>
                <TodoForm addTodo={this.addTodo} />
                <ul>
                    {todos}
                </ul>
            </>
        )
    }
}

export default TodoList;