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

  return(
    <div>
      <h1>Welcome to your TodoList</h1>
      {
        todos.map(todo =>
          <div data-testid={`todo-${todo.id}`} key={todo.id}>
            <h3>{todo.title}</h3>
          </div>
        )
      }
    </div>
  );
};

export default TodoList;