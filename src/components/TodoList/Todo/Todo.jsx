import React from "react";

const Todo = ({todo, deleteTodo, checkOrUnCheckTodo, showUpdateTodoForm}) => {

  return (<div className='todo' data-testid={`todo-${todo.id}`}>
    <label className='todo-checkbox'>
      <input type='checkbox' data-testid={`todo-checkbox-${todo.id}`} checked={todo.completed}
             onChange={() => checkOrUnCheckTodo(todo)}/>
      <span className={`checkmark ${todo.completed ? 'checked' : ''}`}></span>
    </label>
    <div className='todo-data'>
      <h3>{todo.title}</h3>
      <p>{todo.description}</p>
    </div>
    <div className='todo-button-group'>
      <button data-testid={`delete-button-${todo.id}`} onClick={() => deleteTodo(todo.id)}>
        <img
          alt="Delete Button"
          src="https://img.icons8.com/material-outlined/24/E35B88/filled-trash.png"
        />
      </button>
      <button data-testid={`show-update-todo-${todo.id}`} onClick={() => showUpdateTodoForm(todo)}>
        <img
          alt="Edit button"
          src="https://img.icons8.com/material-outlined/24/DCE0E3/edit--v1.png"
        />
      </button>
    </div>
  </div>)
}
export default Todo;