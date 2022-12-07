import reducer, {
  initialState,
  setCurrentNewsForEditing,
  newsLoading,
  setNewsItems,
  setTopNewsItems,
} from './newsSlice';

describe('newsSlice', () => {
  let state;

  beforeEach(() => {
    state = initialState();
  });

  it('sets current news for editing correctly', () => {
    const newNews = {
      title: 'test news',
    };

    expect(state.currentNewsForEditing).toBeNull();
    const updatedState = reducer(state, setCurrentNewsForEditing(newNews));

    expect(updatedState.currentNewsForEditing).toEqual(newNews);
  });

  it('updates loading state correctly', () => {
    expect(state.loading).toBeFalsy();
    const updatedState = reducer(state, newsLoading(true));
    expect(updatedState.loading).toBeTruthy();
  });

  it('set news item list correctly', () => {
    const newsItems = [
      {
        title: 'test news 1',
      },
      {
        title: 'test news 2',
      },
    ];
    const updatedState = reducer(state, setNewsItems(newsItems));
    expect(updatedState.news).toEqual(newsItems);
  });

  it('sets top news items correctly', () => {
    const topNewsItems = [{ title: 'top 1' }, { title: 'top 2' }];
    const updatedState = reducer(state, setTopNewsItems(topNewsItems));
    expect(updatedState.topNews).toEqual(topNewsItems);
  });
});
