import React from "react";
import App from "./App.js";

import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { act } from "react-dom/test-utils";

import { mockdata1, applySuccessMsg } from "./mockData/mockData.js";

jest.mock("axios", () => ({
  post: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

describe("App component", () => {
  it("router check", async () => {
    const mockData = [{}, {}];
    axios.get.mockResolvedValue({ data: mockData });

    await act(async () => {
      render(<App />);
    });

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8001/courses/get"
    );
  });

  it("data map check", async () => {
    const mockData = mockdata1;
    axios.get.mockResolvedValue({ data: mockData });

    await act(async () => {
      render(<App />);
    });

    const courseNames = screen.getAllByTestId("course-name");
    const courseDepts = screen.getAllByTestId("course-dept");
    const courseDescriptions = screen.getAllByTestId(
      "course-description"
    );

    expect(courseNames[0].textContent).toBe(mockData[0].courseName);
    expect(courseNames[1].textContent).toBe(mockData[1].courseName);
    expect(courseNames[2].textContent).toBe(mockData[2].courseName);

    expect(courseDepts[0].textContent).toBe(mockData[0].courseDept);
    expect(courseDepts[1].textContent).toBe(mockData[1].courseDept);
    expect(courseDepts[2].textContent).toBe(mockData[2].courseDept);

    expect(courseDescriptions[0].textContent).toBe(
      mockData[0].description
    );
    expect(courseDescriptions[1].textContent).toBe(
      mockData[1].description
    );
    expect(courseDescriptions[2].textContent).toBe(
      mockData[2].description
    );
  });

  it("Add rating check", async () => {
    const mockData = mockdata1;

    axios.get.mockResolvedValue({ data: [mockData[0]] });
    axios.patch.mockResolvedValue({ message: "rated" });

    await act(async () => {
      render(<App />);
    });

    const select = screen.getByTestId("select-box");

    await act(async () => {
      fireEvent.change(select, {
        target: { name: "rating", value: 5 },
      });
    });

    const addRateBtn = screen.getByTestId("add-rate");

    await act(async () => {
      fireEvent.click(addRateBtn);
    });

    expect(axios.patch).toHaveBeenCalledWith(
      `http://localhost:8001/courses/rating/${mockData[0]._id}`,
      { rating: 5 }
    );
  });

  it("Apply check", async () => {
    const mockData = mockdata1;

    window.alert = jest.fn();

    axios.get.mockResolvedValue({ data: [mockData[2]] });
    axios.post.mockResolvedValue({
      message: applySuccessMsg,
    });

    await act(async () => {
      render(<App />);
    });

    const apply = screen.getByTestId("apply");

    await act(async () => {
      fireEvent.click(apply);
    });

    expect(window.alert).toHaveBeenCalledWith(applySuccessMsg);

    expect(axios.post).toHaveBeenCalledWith(
      `http://localhost:8001/courses/enroll/${mockData[2]._id}`
    );
  });

  it("Drop check", async () => {
    const mockData = mockdata1;

    axios.get.mockResolvedValue({ data: [mockData[0]] });
    axios.delete.mockResolvedValue({ message: "dropped" });

    await act(async () => {
      render(<App />);
    });

    const dropBtn = screen.getByTestId("drop");

    await act(async () => {
      fireEvent.click(dropBtn);
    });

    expect(axios.delete).toHaveBeenCalledWith(
      `http://localhost:8001/courses/drop/${mockData[0]._id}`
    );
  });
});