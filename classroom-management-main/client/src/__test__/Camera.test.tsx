import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Camera from "../pages/Camera";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { BrowserRouter } from "react-router-dom";
test("renders learn react link", () => {
  const { getByText } = render(
    <Provider store={store}>
      <BrowserRouter>
        <Camera ></Camera>
      </BrowserRouter>
    </Provider>
  );

  expect(getByText("Danh Sách")).toBeInTheDocument();
});
