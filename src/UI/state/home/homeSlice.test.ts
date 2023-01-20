import reducer, {
    initialState,
    isMoreToggle
  } from './homeSlice';
  
  describe('homeSlice', () => {
    let state;
  
    beforeEach(() => {
      state = initialState();
    });
  
    it('toggles isMore property correctly', () => {
  
      expect(state.isMore).toEqual(false);
      const updatedState = reducer(state, isMoreToggle());
  
      expect(updatedState.isMore).toEqual(true);
    });
  });
  