import React from "react";
import { mount } from "enzyme";
import Axios from "axios";

import cache from "./lib/cache";
import Increment from "./IncrementClass";

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

const wait = () => new Promise(setImmediate);

beforeAll(() => {
  Axios.get.mockImplementation(url => {
    const idMap = {
      "https://pokeapi.co/api/v2/pokemon/1": bulbasaur,
      "https://pokeapi.co/api/v2/pokemon/2": ivysaur
    };

    const value = idMap[url] || random;

    return Promise.resolve(value);
  });
});

afterEach(() => {
  cache.clear();
});

test("user can see the first pokemon", async () => {
  const wrapper = mount(<Increment />);

  await wait();

  expect(wrapper.text()).toContain("bulbasaur");

  wrapper.unmount();
});

test("user can click to see the next pokemon", async () => {
  const wrapper = mount(<Increment />);

  await wait();
  wrapper.update();
  await wait();

  wrapper
    .find("button")
    .at(1)
    .simulate("click");

  await wait();
  wrapper.update();
  await wait();

  expect(wrapper.text()).toContain("ivysaur");

  wrapper.unmount();
});

test("user can click to see the previous pokemon", async () => {
  const wrapper = mount(<Increment />);

  await wait();
  wrapper.update();
  await wait();

  wrapper
    .find("button")
    .at(1)
    .simulate("click");

  await wait();
  wrapper.update();
  await wait();

  expect(wrapper.text()).toContain("ivysaur");

  await wait();
  wrapper.update();
  await wait();

  wrapper
    .find("button")
    .at(0)
    .simulate("click");

  await wait();
  wrapper.update();
  await wait();

  expect(wrapper.text()).toContain("bulbasaur");

  wrapper.unmount();
});

test("user can click to see a random pokemon", async () => {
  const wrapper = mount(<Increment />);

  await wait();
  wrapper.update();
  await wait();

  wrapper
    .find("button")
    .at(2)
    .simulate("click");

  await wait();

  expect(wrapper.text()).toContain("random");

  wrapper.unmount();
});

test("requests get cached after they run", async () => {
  const wrapper = mount(<Increment />);

  await wait();
  wrapper.update();
  await wait();

  wrapper
    .find("button")
    .at(1)
    .simulate("click");

  await wait();
  wrapper.update();
  await wait();

  expect(wrapper.text()).toContain("ivysaur");

  wrapper
    .find("button")
    .at(0)
    .simulate("click");

  expect(wrapper.text()).toContain("bulbasaur");

  wrapper
    .find("button")
    .at(1)
    .simulate("click");

  expect(wrapper.text()).toContain("ivysaur");

  wrapper
    .find("button")
    .at(0)
    .simulate("click");

  expect(wrapper.text()).toContain("bulbasaur");
});
