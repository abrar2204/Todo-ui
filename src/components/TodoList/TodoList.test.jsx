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

jest.mock('axios');

describe("TodoList",()=>{

  it("should render a todo list",()=>{
    const {asFragment} = render(<TodoList/>);

    expect(screen.getByText("Welcome to your TodoList")).toBeInTheDocument();
    expect(asFragment).toMatchSnapshot();
  })

  it("should render a list of todos",async ()=>{
    axios.get.mockResolvedValueOnce({ data: getAllTodosResponse });
    const {asFragment} = render(<TodoList/>);

    expect(screen.getByText("Welcome to your TodoList")).toBeInTheDocument();

    await waitFor(()=>{
      expect(screen.queryByTestId("todo-1")).toBeInTheDocument();
      expect(screen.queryByTestId("todo-2")).toBeInTheDocument();
      expect(screen.queryByTestId("todo-3")).toBeInTheDocument();
    })

    expect(asFragment).toMatchSnapshot();
  })

  it("should delete a todo",async()=>{
    const user = userEvent.setup();
    axios.get.mockResolvedValueOnce({ data: getAllTodosResponse });
    axios.delete.mockResolvedValueOnce({data: {
        "success": "Successfully deleted 1 todo",
        "error": null
    }})
    const {asFragment} = render(<TodoList/>);

    expect(screen.getByText("Welcome to your TodoList")).toBeInTheDocument();
    await waitFor(()=>{
      expect(screen.getByTestId("todo-1")).toBeInTheDocument();
    })
    await user.click(screen.getByTestId('delete-button-1'));
    await waitFor(()=>{
      expect(screen.queryByTestId("todo-1")).not.toBeInTheDocument();
    })

    expect(asFragment).toMatchSnapshot();
  })


})