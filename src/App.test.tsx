import React from "react";
import App from "./App";
import { mount } from "enzyme";
import { flushPromises } from "./tests/util";
const data = require("../public/data.json");
describe("App Tests", () => {
  afterEach(() => {
    fetchMock.resetMocks();
  })
  it("renders without crashing", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(data));

    const wrapper = await mount(<App></App>);
    expect(wrapper).toMatchSnapshot();
    await flushPromises();
    wrapper.unmount();
  });
});
