import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "react-testing-library";
import Axios from "axios";

import cache from "./lib/cache";
import Pokedex from "./PokedexClass";

// Annoying Warning FIX PR: https://github.com/facebook/react/pull/14853

jest.mock("axios");

const bulbasaur = {
  name: "bulbasaur"
};

const ivysaur = {
  name: "ivysaur"
};

const random = {
  name: "random"
};

beforeAll(() => {
  Axios.get.mockImplementation(url => {
    const idMap = {
      "https://pokeapi.co/api/v2/pokemon/1": bulbasaur,
      "https://pokeapi.co/api/v2/pokemon/2": ivysaur
    };

    const data = idMap[url] || random;

    return Promise.resolve({ data });
  });
});

afterEach(() => {
  cleanup();
  cache.clear();
});

test("user can see the first pokemon", async () => {
  const { getByText } = render(<Pokedex />);

  const bulbasaur = await waitForElement(() => getByText(/bulbasaur/));

  expect(bulbasaur).toBeInTheDocument();
});

test("user can click to see the next pokemon", async () => {
  const { getByText } = render(<Pokedex />);

  const nextButton = await waitForElement(() => getByText("Next"));

  fireEvent.click(nextButton);

  const ivysaur = await waitForElement(() => getByText(/ivysaur/));

  expect(ivysaur).toBeInTheDocument();
});

test("user can click to see the previous pokemon", async () => {
  const { getByText } = render(<Pokedex />);

  const nextButton = await waitForElement(() => getByText("Next"));

  fireEvent.click(nextButton);

  const ivysaur = await waitForElement(() => getByText(/ivysaur/));

  expect(ivysaur).toBeInTheDocument();

  fireEvent.click(getByText("Prev"));

  const bulbasaur = await waitForElement(() => getByText(/bulbasaur/));

  expect(bulbasaur).toBeInTheDocument();
});

// This test is Flaky because if #1 or #2 get's randomly generated,
// it shows bulbasaur or ivysaur
test("user can click to see a random pokemon", async () => {
  const { getByText } = render(<Pokedex />);

  const randomButton = await waitForElement(() => getByText("Random"));

  fireEvent.click(randomButton);

  const random = await waitForElement(() => getByText(/random/));

  expect(random).toBeInTheDocument();
});

test("requests get cached after they run", async () => {
  const { getByText } = render(<Pokedex />);

  const nextButton = await waitForElement(() => getByText("Next"));

  fireEvent.click(nextButton);

  const ivysaur = await waitForElement(() => getByText(/ivysaur/));

  expect(ivysaur).toBeInTheDocument();

  fireEvent.click(getByText("Prev"));

  expect(getByText(/bulbasaur/)).toBeInTheDocument();

  fireEvent.click(getByText("Next"));

  expect(getByText(/ivysaur/)).toBeInTheDocument();

  fireEvent.click(getByText("Prev"));

  expect(getByText(/bulbasaur/)).toBeInTheDocument();
});
