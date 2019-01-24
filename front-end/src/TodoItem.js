import React from 'react';

const TodoItem = ({name, completed, onDelete, onToggle}) => (
  <li>
    <span 
        onClick={onToggle}
        style={{
            textDecoration: completed ? 'line-through' : 'none',
          }}
    >{name}</span>
    <span onClick={onDelete}> X </span>
  </li>
);

export default TodoItem;
