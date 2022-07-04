import React from 'react';
import "@testing-library/jest-dom";
import Form from "./Form";
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from "@testing-library/user-event";

let submitFormMockFn;
let toggleCreateTodoFormMockFn;
describe("Form", () => {

  beforeEach(() => {
    submitFormMockFn = jest.fn();
    toggleCreateTodoFormMockFn = jest.fn();
  });

  it('should render a form', async () => {
    render(<Form
      submitForm={submitFormMockFn}
      isFormVisible={true}
      isUpdateForm={false}
      defaultFormData={{}}
      toggleCreateTodoForm={toggleCreateTodoFormMockFn}
    />)

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
    })
  })

  it('should toggle form when show form button is clicked', async () => {
    const user = await userEvent.setup();
    render(<Form
      submitForm={submitFormMockFn}
      isFormVisible={false}
      isUpdateForm={false}
      defaultFormData={{}}
      toggleCreateTodoForm={toggleCreateTodoFormMockFn}
    />)

    await user.click(screen.getByTestId('show-form-button'));

    expect(toggleCreateTodoFormMockFn).toHaveBeenCalled();
  })

  it('should call submitform when valid data is entered', async () => {
    const user = await userEvent.setup();
    render(<Form
      submitForm={submitFormMockFn}
      isFormVisible={false}
      isUpdateForm={false}
      defaultFormData={{}}
      toggleCreateTodoForm={toggleCreateTodoFormMockFn}
    />)
    await user.click(screen.getByTestId('show-form-button'));

    await user.type(screen.getByLabelText("Title"), "Get Pizza");
    await user.type(screen.getByLabelText("Description"), "Order Pizza from Dominos");
    await user.click(screen.getByTestId('submit-form-button'));

    expect(submitFormMockFn).toHaveBeenCalled();
  })

  it('should not call submitform when invalid data is entered', async () => {
    const user = await userEvent.setup();
    render(<Form
      submitForm={submitFormMockFn}
      isFormVisible={false}
      isUpdateForm={false}
      defaultFormData={{}}
      toggleCreateTodoForm={toggleCreateTodoFormMockFn}
    />)
    await user.click(screen.getByTestId('show-form-button'));

    await user.click(screen.getByTestId('submit-form-button'));

    expect(submitFormMockFn).toHaveBeenCalledTimes(0);
  })

  it('should show given form data', async () => {
    const user = await userEvent.setup();
    render(<Form
      submitForm={submitFormMockFn}
      isFormVisible={true}
      isUpdateForm={true}
      defaultFormData={{
        title: "Get Pizza",
        description: "Order Pizza from Dominos"
      }}
      toggleCreateTodoForm={toggleCreateTodoFormMockFn}
    />)

    expect(screen.getByDisplayValue("Get Pizza")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Order Pizza from Dominos")).toBeInTheDocument();
  })

})