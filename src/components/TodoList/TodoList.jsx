import React, {useEffect, useState} from 'react';
import axios from "axios";

const TodoList = () => {
  const [todos,setTodos]=useState([]);

  useEffect(()=>{
    axios.get('/api/todo').then( res =>{
      if(res.data.success){
        setTodos(res.data.success);
      }
    })
  },[]);

  const deleteTodo = (todoId)=>{
    axios.delete(`/api/todo/${todoId}`).then(res=>{
      if(res.data.success){
        setTodos(prevTodos=>prevTodos.filter(({id})=>id!==todoId));
      }
    })
  }

  return(
    <div>
      <h1>Welcome to your TodoList</h1>
      {
        todos.map(todo =>
          <div data-testid={`todo-${todo.id}`} key={todo.id}>
            <h3>{todo.title}</h3>
            <button data-testid={`delete-button-${todo.id}`} onClick={()=>deleteTodo(todo.id)}>Delete</button>
          </div>
        )
      }
    </div>
  );
};

export default TodoList;