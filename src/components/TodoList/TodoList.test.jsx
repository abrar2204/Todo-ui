import React from 'react';
import "@testing-library/jest-dom";
import TodoList from "./TodoList";
import {render, screen, waitFor} from '@testing-library/react';
import axios from 'axios';

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
})