import React, {useEffect, useState} from 'react';
import axios from "axios";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  })
  const [errors, setErrors] = useState({
    title: false,
    description: false
  })

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
    setIsFormVisible(prev => !prev);
  }

  const handleChange = (event) => {
    const {name, value} = event.target;
    if (!value) {
      setErrors(prev => ({...prev, [name]: true}));
    } else {
      setErrors(prev => ({...prev, [name]: false}));
    }
    setFormData(prev => ({...prev, [name]: value}));
  }

  const submitForm = (event) => {
    event.preventDefault();
    if (isUpdateForm) {
      updateTodo();
      return;
    }
    createTodo()
  }

  const updateTodo = () => {
    if (isFormDataInValid()) {
      return;
    }
    axios.put(`/api/todo/${formData.id}`, formData).then(res => {
      if (res.data.success) {
        setTodos(prev => prev.map(todo => todo.id === formData.id ? res.data.success : todo));
        resetForm();
      }
    })
  }

  const resetForm = () => {
    setFormData({title: "", description: ""});
    setIsFormVisible(false);
    setIsUpdateForm(false);
  }

  const isFormDataInValid = () => {
    if (errors.title || errors.description) {
      return true;
    }
    if (!formData.title || !formData.description) {
      setErrors({
        title: !formData.title,
        description: !formData.description
      });
      return true;
    }
    return false;
  }

  const createTodo = () => {

    if (isFormDataInValid()) {
      return
    }

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
    setFormData(todo);
  }

  const checkOrUnCheckTodo = (oldTodo) => (event) => {
    const newTodo = {...oldTodo, completed: event.target.checked};
    setTodos(prevTodos => prevTodos.map(todo => todo.id === oldTodo.id ? newTodo : todo));
    axios.put(`/api/todo/${oldTodo.id}`,newTodo).then(res => {
      if (res.data.error) {
        setTodos(prev => prev.map(todo => todo.id === oldTodo.id ? oldTodo : todo));
      }
    })
  }

  return (
    <div>
      <h1>Welcome to your TodoList</h1>
      <button data-testid="show-create-todo" onClick={toggleCreateTodoForm}>Create New Todo</button>
      {
        isFormVisible && <form onSubmit={submitForm}>
          <div>
            <label htmlFor='title'>Title</label>
            <input id='title' name='title' value={formData.title} onChange={handleChange}/>
            {errors['title'] && <p>Invalid Title</p>}
          </div>
          <div>
            <label htmlFor='description'>Description</label>
            <input id='description' name='description' value={formData.description} onChange={handleChange}/>
            {errors['description'] && <p>Invalid Description</p>}
          </div>
          <button type='submit' data-testid="submit-form-button">{isUpdateForm ? 'Update' : 'Create'}</button>
        </form>
      }
      {
        todos.map(todo =>
          <div data-testid={`todo-${todo.id}`} key={todo.id}>
            <input
              type='checkbox'
              name={`todo-checkbox-${todo.id}`}
              data-testid={`todo-checkbox-${todo.id}`}
              checked={todo.completed}
              onChange={checkOrUnCheckTodo(todo)}
            />
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>{todo.createdAt}</p>
            <button data-testid={`delete-button-${todo.id}`} onClick={() => deleteTodo(todo.id)}>Delete</button>
            <button data-testid={`show-update-todo-${todo.id}`} onClick={() => showUpdateTodoForm(todo)}>Update</button>
          </div>
        )
      }
    </div>
  );
};

export default TodoList;