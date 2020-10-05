import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Axios from "axios";

import cache from "./lib/cache";
import Pokedex from "./PokedexClass";

jest.mock("axios");

const bulbasaur = {
  name: "bulbasaur",
};

const ivysaur = {
  name: "ivysaur",
};

const random = {
  name: "random",
};

beforeAll(() => {
  Axios.get.mockImplementation((url) => {
    const idMap = {
      "https://pokeapi.co/api/v2/pokemon/1": bulbasaur,
      "https://pokeapi.co/api/v2/pokemon/2": ivysaur,
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
  render(<Pokedex />);

  const bulbasaur = await screen.findByText(/bulbasaur/);

  expect(bulbasaur).toBeInTheDocument();
});

test("user can click to see the next pokemon", async () => {
  render(<Pokedex />);

  const nextButton = await screen.findByText("Next");

  userEvent.click(nextButton);

  const ivysaur = await screen.findByText(/ivysaur/);

  expect(ivysaur).toBeInTheDocument();
});

test("user can click to see the previous pokemon", async () => {
  render(<Pokedex />);

  const nextButton = await screen.findByText("Next");

  userEvent.click(nextButton);

  const ivysaur = await screen.findByText(/ivysaur/);

  expect(ivysaur).toBeInTheDocument();

  userEvent.click(screen.getByText("Prev"));

  const bulbasaur = await screen.findByText(/bulbasaur/);

  expect(bulbasaur).toBeInTheDocument();
});

// This test is Flaky because if #1 or #2 get's randomly generated,
// it shows bulbasaur or ivysaur
test("user can click to see a random pokemon", async () => {
  render(<Pokedex />);

  const randomButton = await screen.findByText("Random");

  userEvent.click(randomButton);

  const random = await screen.findByText(/random/);

  expect(random).toBeInTheDocument();
});

test("requests get cached after they run", async () => {
  render(<Pokedex />);

  const nextButton = await screen.findByText("Next");

  userEvent.click(nextButton);

  const ivysaur = await screen.findByText(/ivysaur/);

  expect(ivysaur).toBeInTheDocument();

  userEvent.click(screen.getByText("Prev"));

  expect(screen.getByText(/bulbasaur/)).toBeInTheDocument();

  userEvent.click(screen.getByText("Next"));

  expect(screen.getByText(/ivysaur/)).toBeInTheDocument();

  userEvent.click(screen.getByText("Prev"));

  expect(screen.getByText(/bulbasaur/)).toBeInTheDocument();
});
