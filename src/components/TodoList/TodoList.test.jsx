import React from 'react';
import "@testing-library/jest-dom";
import TodoList from "./TodoList";
import {render, screen, waitFor} from '@testing-library/react';
import axios from 'axios';
import userEvent from "@testing-library/user-event";

const getAllTodosResponse = {
  "success": [
    {
      "id": 1,
      "title": "Download Game",
      "description": "Install Monster Hunter Rise Sunbreak",
      "completed": true,
      "createdAt": "2022-06-30"
    },
    {
      "id": 2,
      "title": "Pay Bills",
      "description": "Pay Internet and Electricity Bill",
      "completed": false,
      "createdAt": "2020-06-01"
    },
    {
      "id": 3,
      "title": "Fill Petrol",
      "description": "Fill Petrol in Bike",
      "completed": true,
      "createdAt": "2020-06-27"
    },
  ],
  "error": null
}

const deleteTodoResponse = {
  "success": "Successfully deleted 1 todo",
  "error": null
}

jest.mock('axios');

describe("TodoList", () => {

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({data: getAllTodosResponse});
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it("should render a todo list", () => {
    render(<TodoList/>);

    expect(screen.getByText("Welcome to your TodoList")).toBeInTheDocument();
  })

  it("should render a list of todos", async () => {
    render(<TodoList/>);

    expect(screen.getByText("Welcome to your TodoList")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("todo-1")).toBeInTheDocument();
      expect(screen.queryByTestId("todo-2")).toBeInTheDocument();
      expect(screen.queryByTestId("todo-3")).toBeInTheDocument();
    })
  })

  it("should delete a todo", async () => {
    const user = userEvent.setup();
    axios.delete.mockResolvedValueOnce({data: deleteTodoResponse})
    render(<TodoList/>);

    expect(screen.getByText("Welcome to your TodoList")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("todo-1")).toBeInTheDocument();
    })
    await user.click(screen.getByTestId('delete-button-1'));
    await waitFor(() => {
      expect(screen.queryByTestId("todo-1")).not.toBeInTheDocument();
    })
  })

  it("should create a new todo", async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValueOnce({
      data: {
        success: {
          "title": "Get Pizza",
          "description": "Order Pizza from Dominos",
          "completed": false,
          "createdAt": "2020-01-03"
        },
        error: null
      }
    });
    render(<TodoList/>);

    await user.click(screen.getByTestId('show-create-todo'));
    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
    })
    await user.type(screen.getByLabelText("Title"), "Get Pizza");
    await user.type(screen.getByLabelText("Description"), "Order Pizza from Dominos");
    await user.click(screen.getByTestId('submit-form-button'));

    await waitFor(() => {
      expect(screen.queryByText("Get Pizza")).toBeInTheDocument();
    })
  })

  it("should show warning if title or description field is empty and the create form is submitted", async () => {
    const user = userEvent.setup();
    render(<TodoList/>);

    await user.click(screen.getByTestId('show-create-todo'));
    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
    })
    await user.click(screen.getByTestId('submit-form-button'));

    await waitFor(() => {
      expect(screen.queryByText("Invalid Title")).toBeInTheDocument();
      expect(screen.queryByText("Invalid Description")).toBeInTheDocument();
    })
  })

  it('should show update form for todo when update button is clicked', async () => {
    const user = userEvent.setup();
    axios.put.mockResolvedValueOnce({
      data: {
        success: {
          "id": 1,
          "title": "Download Video Game",
          "description": "Install Monster Hunter Rise Sunbreak",
          "completed": false,
          "createdAt": "2020-01-03"
        },
        error: null
      }
    });
    render(<TodoList/>);
    await waitFor(() => {
      expect(screen.getByText("Download Game")).toBeInTheDocument();
      expect(screen.getByText("Install Monster Hunter Rise Sunbreak")).toBeInTheDocument();
    })

    await user.click(screen.getByTestId('show-update-todo-1'));
    await waitFor(() => {
      expect(screen.getByDisplayValue("Download Game")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Install Monster Hunter Rise Sunbreak")).toBeInTheDocument();
    })
    await userEvent.type(screen.getByDisplayValue("Download Game"), "Download Video Game");
    await user.click(screen.getByTestId('submit-form-button'));

    await waitFor(() => {
      expect(screen.getByText("Download Video Game")).toBeInTheDocument();
      expect(screen.getByText("Install Monster Hunter Rise Sunbreak")).toBeInTheDocument();
    })
  })

  it('should show warning when invalid title and description is given and update button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoList/>);
    await waitFor(() => {
      expect(screen.getByText("Download Game")).toBeInTheDocument();
      expect(screen.getByText("Install Monster Hunter Rise Sunbreak")).toBeInTheDocument();
    })

    await user.click(screen.getByTestId('show-update-todo-1'));
    await waitFor(() => {
      expect(screen.getByDisplayValue("Download Game")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Install Monster Hunter Rise Sunbreak")).toBeInTheDocument();
    })
    await userEvent.clear(screen.getByDisplayValue("Download Game"));
    await userEvent.clear(screen.getByDisplayValue("Install Monster Hunter Rise Sunbreak"));
    await user.click(screen.getByTestId('submit-form-button'));

    await waitFor(() => {
      expect(screen.queryByText("Invalid Title")).toBeInTheDocument();
      expect(screen.queryByText("Invalid Description")).toBeInTheDocument();
    })
  })

})