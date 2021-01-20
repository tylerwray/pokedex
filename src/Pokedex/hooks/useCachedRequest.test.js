import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import Axios from "axios";

import cache from "../lib/cache";
import useCachedRequest from "./useCachedRequest";

jest.mock("axios");

// Example Component using the useCachedRequest hook
function Person({ id }) {
  const { data, loading } = useCachedRequest(
    `https://review-rocket.podium.com/api/v1/users/${id}`
  );

  if (loading) return <div>loading</div>;

  return (
    <>
      <div>{data.name}</div>
      <div>{data.email}</div>
    </>
  );
}

const arthur = {
  id: "1",
  name: "Arthur",
  email: "adog@factsaboutme.com",
};

const eric = {
  id: "2",
  name: "Eric",
  email: "i-am-ceo@podium.com",
};

beforeAll(() => {
  Axios.get.mockImplementation((url) => {
    const idMap = {
      "https://review-rocket.podium.com/api/v1/users/1": arthur,
      "https://review-rocket.podium.com/api/v1/users/2": eric,
    };

    const data = idMap[url];

    return Promise.resolve({ data });
  });
});

afterEach(() => {
  cleanup();
  cache.clear();
});

test("requests get cached after they run", async () => {
  const { rerender } = render(<Person id="1" />);

  expect(screen.getByText("loading")).toBeInTheDocument();
  await screen.findByText(arthur.name);
  expect(screen.getByText(arthur.email)).toBeInTheDocument();

  rerender(<Person id="2" />);
  expect(screen.getByText("loading")).toBeInTheDocument();
  await screen.findByText(eric.name);
  expect(screen.getByText(eric.email)).toBeInTheDocument();

  rerender(<Person id="1" />);
  expect(screen.queryByText("loading")).not.toBeInTheDocument();
  expect(screen.getByText(arthur.name)).toBeInTheDocument();
  expect(screen.getByText(arthur.email)).toBeInTheDocument();

  rerender(<Person id="2" />);
  expect(screen.queryByText("loading")).not.toBeInTheDocument();
  expect(screen.getByText(eric.name)).toBeInTheDocument();
  expect(screen.getByText(eric.email)).toBeInTheDocument();
});
