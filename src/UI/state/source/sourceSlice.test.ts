import reducer, { initialState } from './sourceSlice';

it('returns initial state when given undefined previous state', () => {
  expect(reducer(undefined, { type: 'nop' })).toEqual(initialState);
});
