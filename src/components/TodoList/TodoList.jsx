import React, {useEffect, useState} from 'react';
import axios from "axios";
import "./TodoList.scss";

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
    if(isUpdateForm){
      resetForm();
      return;
    }
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
      <button className={`show-form-button ${isFormVisible ? 'open':''}`} data-testid="show-create-todo" onClick={toggleCreateTodoForm}>
        <img alt='show-form-plus-icon' src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/DCE0E3/external-plus-user-interface-tanah-basah-glyph-tanah-basah-2.png"/>
      </button>
       <form className={`form ${isFormVisible ? 'open':''}`} onSubmit={submitForm}>
          <div className='form-control'>
            <label htmlFor='title'>Title</label>
            <input id='title' name='title' value={formData.title} onChange={handleChange}/>
            {errors['title'] && <p>Invalid Title</p>}
          </div>
          <div className='form-control'>
            <label htmlFor='description'>Description</label>
            <input id='description' name='description' value={formData.description} onChange={handleChange}/>
            {errors['description'] && <p>Invalid Description</p>}
          </div>
          <button type='submit' data-testid="submit-form-button">{isUpdateForm ? 'Update' : 'Create'}</button>
       </form>

      <div className='todos'>
        {
          todos.map(todo =>
            <div className='todo' data-testid={`todo-${todo.id}`} key={todo.id}>
              <label className='todo-checkbox'>
                <input type='checkbox' data-testid={`todo-checkbox-${todo.id}`} checked={todo.completed} onChange={()=> checkOrUnCheckTodo(todo)} />
                <span className={`checkmark ${todo.completed ? 'checked':''}`}></span>
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
            </div>
          )
        }
      </div>
    </div>
  );
};

export default TodoList;