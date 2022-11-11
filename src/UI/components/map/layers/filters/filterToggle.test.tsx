import React from 'react';
import { filterHandler, initialState } from "../../../../state/map/mapSlice";
import { fireEvent, render } from "../../../../test_config/render";
import FilterToggle from './filterToggle';

describe("FilterToggle", () => {
  let state;

  beforeEach(() => {
    state = { map: initialState() };
  })

  it('renders correctly for a given filter', () => {
    state.map.filterValues.country = ["Kenya", "Uganda", "Tanzania"]

    const { wrapper } = render(
      <FilterToggle 
        filterTitle={'Season'} 
        filterName="season"
        filterToggleType={'string'}
        filterOptionsArray={[
          { name: 'rainy', optionIcon: <div>Rainy icon</div> },
          { name: 'dry', optionIcon: <div>Dry icon</div> },
          { name: 'empty', optionIcon: <div>Empty icon</div> },
        ]}
      />,
      state
    );

    expect(wrapper.container).toMatchSnapshot();
  })

  it('dispatches the correct filter update when the value changes', async () => {
    state.map.filters.season.value = ["dry"]

    const { wrapper, store } = render(
      <FilterToggle 
        filterTitle={'Season'} 
        filterName="season"
        filterToggleType={'string'}
        filterOptionsArray={[
          { name: 'rainy', optionIcon: <div>Rainy icon</div> },
          { name: 'dry', optionIcon: <div>Dry icon</div> },
          { name: 'empty', optionIcon: <div>Empty icon</div> },
        ]}
      />,
      state
    );

    const rainyButton = await wrapper.getByText('rainy')
    fireEvent.click(rainyButton)

    expect(store.getActions()[0]).toEqual(filterHandler({
      filterName: 'season',
      filterOptions: ["dry", "rainy"]
    }))
  })

  it('dispatches the correct filter update when the value changes for boolean filter', async () => {
    state.map.filters.isAdult.value = ["empty"]

    const { wrapper, store } = render(
      <FilterToggle 
        filterTitle={'Adult'} 
        filterName="isAdult"
        filterToggleType={'boolean'}
        filterOptionsArray={[
          { name: 'true', optionIcon: <div>True icon</div> },
          { name: 'false', optionIcon: <div>False icon</div> },
          { name: 'empty', optionIcon: <div>Empty icon</div> },
        ]}
      />,
      state
    );

    const trueButton = await wrapper.getByText('true')
    fireEvent.click(trueButton)

    expect(store.getActions()[0]).toEqual(filterHandler({
      filterName: 'isAdult',
      filterOptions: ["empty", true]
    }))
  })
})