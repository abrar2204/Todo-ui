import React, {useEffect, useState} from "react";

const Form = ({defaultFormData, isFormVisible, submitForm, isUpdateForm, toggleCreateTodoForm}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  })
  const [errors, setErrors] = useState({
    title: false,
    description: false
  });

  useEffect(() => {
    setFormData(defaultFormData)
  }, [defaultFormData]);

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

  const handleChange = (event) => {
    const {name, value} = event.target;
    if (!value) {
      setErrors(prev => ({...prev, [name]: true}));
    } else {
      setErrors(prev => ({...prev, [name]: false}));
    }
    setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isFormDataInValid()) {
      return;
    }
    submitForm(formData);
  }

  return (<>
    <button className={`show-form-button ${isFormVisible ? 'open' : ''}`} data-testid="show-form-button"
            onClick={toggleCreateTodoForm}>
      <img alt='show-form-plus-icon'
           src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/DCE0E3/external-plus-user-interface-tanah-basah-glyph-tanah-basah-2.png"/>
    </button>
    <form className={`form ${isFormVisible ? 'open' : ''}`} onSubmit={handleSubmit}>
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
  </>);
}

export default Form;