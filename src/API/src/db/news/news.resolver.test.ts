import { CreateNewsInput, NewsResolver } from './news.resolver';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('id123'),
}));

jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));

describe('NewsResolver', () => {
  let resolver: NewsResolver;
  let mockNewsService;

  beforeEach(async () => {
    mockNewsService = {
      newsById: jest.fn(),
      allNews: jest.fn(),
      upsertNews: jest.fn(),
    };

    resolver = new NewsResolver(mockNewsService);
  });

  it('newsById function calls on newsById from news service', () => {
    const id = '123';
    resolver.newsById(id);
    expect(mockNewsService.newsById).toHaveBeenCalledWith(id);
  });

  it('allNews function calls on allNews from news service', () => {
    resolver.allNews();
    expect(mockNewsService.allNews).toHaveBeenCalled();
  });

  describe('createEditNews', () => {
    it('generates an ID for new items', () => {
      const input = new CreateNewsInput();
      input.title = 'test title';

      resolver.createEditNews(input);

      expect(mockNewsService.upsertNews).toHaveBeenCalledWith({
        id: 'id123',
        title: 'test title',
        lastUpdated: new Date(2022, 0, 1),
      });
    });
  });
});
