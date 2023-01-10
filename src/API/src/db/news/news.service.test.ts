import { getRepositoryToken } from '@nestjs/typeorm';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';
import { buildTestingModule } from '../../testHelpers';

describe('News service', () => {
  let service: NewsService;
  let newsRepositoryMock;

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get<NewsService>(NewsService);
    newsRepositoryMock = module.get(getRepositoryToken(News));
  });

  it('newsById finds one by ID from the repository', async () => {
    const expectedNews = new News();
    newsRepositoryMock.findOne = jest.fn().mockResolvedValue(expectedNews);

    const result = await service.newsById('123');
    expect(result).toEqual(expectedNews);
    expect(newsRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('allNews returns all news', async () => {
    const expectedNews = [new News(), new News(), new News()];

    newsRepositoryMock.find = jest.fn().mockResolvedValue(expectedNews);
    const mockQueryBuilder = {
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValue(expectedNews),
    };
    newsRepositoryMock.createQueryBuilder = jest
      .fn()
      .mockReturnValue(mockQueryBuilder);

    const result = await service.allNews();
    expect(result).toEqual(expectedNews);
    expect(mockQueryBuilder.getMany).toHaveBeenCalled();
  });

  it('upsertNews calls save on the repository to do an upsert', async () => {
    const expectedNews = new News();
    newsRepositoryMock.save = jest.fn().mockResolvedValue(expectedNews);

    const result = await service.upsertNews(expectedNews);
    expect(result).toEqual(expectedNews);
    expect(newsRepositoryMock.save).toHaveBeenCalledWith(expectedNews);
  });
});
