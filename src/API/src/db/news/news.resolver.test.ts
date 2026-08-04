import { CreateNewsInput, NewsResolver } from './news.resolver';
import { News } from './entities/news.entity';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('id123'),
}));

jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));

describe('NewsResolver', () => {
  let resolver: NewsResolver;
  let mockNewsService;
  let mockNewsTranslationService;

  beforeEach(async () => {
    mockNewsService = {
      newsById: jest.fn(),
      allNews: jest.fn(),
      upsertNews: jest.fn(),
    };

    mockNewsTranslationService = {
      find: jest.fn(),
      upsert: jest.fn(),
    };

    resolver = new NewsResolver(mockNewsService, mockNewsTranslationService);
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

  describe('translation field resolvers', () => {
    const news: News = {
      id: 'news-1',
      title: 'title',
      summary: 'summary',
      article: 'article',
      image: 'image',
      lastUpdated: new Date(2022, 0, 1),
    };

    it('titleFr looks up the fr translation and returns its title', async () => {
      mockNewsTranslationService.find.mockResolvedValue({ title: 'titre fr' });

      const result = await resolver.titleFr(news);

      expect(mockNewsTranslationService.find).toHaveBeenCalledWith(
        'news-1',
        'fr',
      );
      expect(result).toBe('titre fr');
    });

    it('titleFr returns undefined when no translation exists', async () => {
      mockNewsTranslationService.find.mockResolvedValue(null);

      const result = await resolver.titleFr(news);

      expect(result).toBeUndefined();
    });

    it('summaryPt looks up the pt translation and returns its summary', async () => {
      mockNewsTranslationService.find.mockResolvedValue({
        summary: 'resumo pt',
      });

      const result = await resolver.summaryPt(news);

      expect(mockNewsTranslationService.find).toHaveBeenCalledWith(
        'news-1',
        'pt',
      );
      expect(result).toBe('resumo pt');
    });
  });
});
