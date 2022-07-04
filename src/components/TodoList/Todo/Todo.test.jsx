import React from 'react';
import "@testing-library/jest-dom";
import Todo from "./Todo.jsx";
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import TodoList from "../TodoList";

let deleteTodoMockFn;
let checkOrUnCheckTodoMockFn;
let showUpdateTodoFormMockFn;
const todoData = {
  "id": 1,
  "title": "Download Game",
  "description": "Install Monster Hunter Rise Sunbreak",
  "completed": true,
  "createdAt": "2022-06-30"
};

describe("Todo", () => {

  beforeEach(() => {
    deleteTodoMockFn = jest.fn();
    checkOrUnCheckTodoMockFn = jest.fn();
    showUpdateTodoFormMockFn = jest.fn();
  })

  it('should render a todo', () => {
    render(<Todo
      todo={todoData}
      checkOrUnCheckTodo={checkOrUnCheckTodoMockFn}
      deleteTodo={deleteTodoMockFn}
      showUpdateTodoForm={showUpdateTodoFormMockFn}
    />)

    expect(screen.getByText('Download Game')).toBeInTheDocument();
    expect(screen.getByText('Install Monster Hunter Rise Sunbreak')).toBeInTheDocument();
  })

  it('should call delete todo when delete button is clicked', async () => {
    const user = await userEvent.setup()
    render(<Todo
      todo={todoData}
      checkOrUnCheckTodo={checkOrUnCheckTodoMockFn}
      deleteTodo={deleteTodoMockFn}
      showUpdateTodoForm={showUpdateTodoFormMockFn}
    />)

    await user.click(screen.getByTestId('delete-button-1'));

    expect(deleteTodoMockFn).toHaveBeenCalled();
  })

  it("should call show update form when update button is clicked", async () => {
    const user = await userEvent.setup()
    render(<Todo
      todo={todoData}
      checkOrUnCheckTodo={checkOrUnCheckTodoMockFn}
      deleteTodo={deleteTodoMockFn}
      showUpdateTodoForm={showUpdateTodoFormMockFn}
    />)

    await user.click(screen.getByTestId('show-update-todo-1'));

    expect(showUpdateTodoFormMockFn).toHaveBeenCalled();
  })

})
