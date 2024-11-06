import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CityCard from "./CityCard";

test("renders city name", () => {
  const city = { name: "Paris", weatherData: { temperature: 15, condition: "Clear" } };
  const { getByText } = render(<CityCard city={city} onDelete={() => {}} />);
  expect(getByText(/paris/i)).toBeInTheDocument();
});

test("deletes city on delete button click", () => {
  const city = { _id: "1", name: "Paris", weatherData: { temperature: 15, condition: "Clear" } };
  const onDelete = jest.fn();
  const { getByRole } = render(<CityCard city={city} onDelete={onDelete} />);
  fireEvent.click(getByRole("button", { name: /delete/i }));
  expect(onDelete).toHaveBeenCalledWith("1");
});
