import React, {useEffect, useState} from 'react';
import axios from "axios";
import "./TodoList.scss";
import Todo from "./Todo/Todo.jsx";
import Form from "./Form/Form.jsx";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [defaultFormData, setDefaultFormData] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    axios.get('/api/todo').then(res => {
      if (res.data.success) {
        setTodos(res.data.success);
      }
    })
  }, []);

  const deleteTodo = (todoId) => {
    axios.delete(`/api/todo/${todoId}`).then(res => {
      if (res.data.success) {
        setTodos(prevTodos => prevTodos.filter(({id}) => id !== todoId));
      }
    })
  }

  const toggleCreateTodoForm = () => {
    if (isUpdateForm) {
      resetForm();
      return;
    }
    setIsFormVisible(prev => !prev);
  }


  const updateTodo = (formData) => {
    axios.put(`/api/todo/${formData.id}`, formData).then(res => {
      if (res.data.success) {
        setTodos(prev => prev.map(todo => todo.id === formData.id ? res.data.success : todo));
        resetForm();
      }
    })
  }

  const resetForm = () => {
    setDefaultFormData({title: "", description: ""});
    setIsFormVisible(false);
    setIsUpdateForm(false);
  }

  const submitForm = (formData) => {
    if (isUpdateForm) {
      updateTodo(formData);
      return;
    }
    createTodo(formData)
  }

  const createTodo = (formData) => {
    axios.post("/api/todo", {
      ...formData,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    }).then(res => {
      if (res.data.success) {
        setTodos(prev => [...prev, res.data.success]);
        resetForm();
      }
    })
  }

  const showUpdateTodoForm = (todo) => {
    setIsFormVisible(true);
    setIsUpdateForm(true);
    setDefaultFormData(todo);
  }

  const checkOrUnCheckTodo = (oldTodo) => {
    const newTodo = {...oldTodo, completed: !oldTodo.completed};
    setTodos(prevTodos => prevTodos.map(todo => todo.id === oldTodo.id ? newTodo : todo));
    axios.put(`/api/todo/${oldTodo.id}`, newTodo).then(res => {
      if (res.data.error) {
        setTodos(prev => prev.map(todo => todo.id === oldTodo.id ? oldTodo : todo));
      }
    })
  }

  return (
    <div className='container'>
      <h1>Welcome to your TodoList</h1>
      <Form defaultFormData={defaultFormData} isFormVisible={isFormVisible} isUpdateForm={isUpdateForm}
            submitForm={submitForm} toggleCreateTodoForm={toggleCreateTodoForm}/>
      <div className='todos'>
        {
          todos.map(todo =>
            <Todo key={todo.id} todo={todo} showUpdateTodoForm={showUpdateTodoForm} deleteTodo={deleteTodo}
                  checkOrUnCheckTodo={checkOrUnCheckTodo}/>
          )
        }
      </div>
    </div>
  );
};

export default TodoList;