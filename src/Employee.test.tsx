import React from "react";
import { mount } from "enzyme";
import Employee from "./Employee";
const data = require("../public/data.json")
import {flushPromises} from "./tests/util";

describe("Employee Component Tests", () => {
  afterEach(() => {
    fetchMock.resetMocks();
  })
  it("renders without crashing", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(data))

    const component = await mount(<Employee></Employee>);
    expect(component).toMatchSnapshot();
  });
  it("renders hierarchy table with 6 row x 3 columns", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(data))

    const component = await mount(<Employee></Employee>);
    expect(component).toMatchSnapshot();
    await flushPromises();
    component.update();

    //should have 6 row
    expect(component.find(".item-row").length).toEqual(6)
    const row = component.find(".item-row").hostNodes().at(0);
    //should have 3 column
    expect(row.find("td").length).toBe(3);
    expect(component.find("table").html()).toEqual(`<table class="Org-Chart"><tbody><tr class="item-row"><td>Jamie</td><td></td><td></td></tr><tr class="item-row"><td></td><td>Alan</td><td></td></tr><tr class="item-row"><td></td><td></td><td>Martin</td></tr><tr class="item-row"><td></td><td></td><td>Alex</td></tr><tr class="item-row"><td></td><td>Steve</td><td></td></tr><tr class="item-row"><td></td><td></td><td>David</td></tr></tbody></table>`);
    component.unmount();
  });
  it("renders hierarchy table with 9 row x 5 columns", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(require("../public/data2.json")));

    const component = await mount(<Employee></Employee>);
    expect(component).toMatchSnapshot();
    await flushPromises();
    component.update();

    //should have 7 row
    expect(component.find(".item-row").length).toEqual(9)
    const row = component.find(".item-row").hostNodes().at(0);
    //should have 5u column
    expect(row.find("td").length).toBe(5);
    component.unmount();
  });

  it("renders error message when data is not valid", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(require("../public/data3.json")))

    const component = await mount(<Employee></Employee>);
    expect(component).toMatchSnapshot();
    await flushPromises();
    component.update();
    expect(component.find(".Error").length).toEqual(1)
    expect(component.find("table").length).toEqual(0)
    console.log(component.find(".Error").html())
    expect(component.find(".Error").html()).toEqual(`<div class="Error">Error: Bad data: with more than 1 employee without managerId</div>`);
    component.unmount();
  });
});
