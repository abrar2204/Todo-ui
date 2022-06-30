import React from 'react';
import "@testing-library/jest-dom";
import TodoList from "./TodoList";
import {render, screen} from '@testing-library/react';

describe("TodoList",()=>{

  it("should render a todo list",()=>{
    const {asFragment} = render(<TodoList/>);

    expect(screen.getByText("Welcome to your TodoList")).toBeInTheDocument();
    expect(asFragment).toMatchSnapshot();
  })


})