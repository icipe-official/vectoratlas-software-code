import {
  referenceQuery,
  occurrenceQuery,
  speciesInformationById,
  upsertSpeciesInformationMutation,
  newsById,
  upsertNewsMutation,
  getAllNews,
} from './queries';

describe('occurrenceQuery', () => {
  let filters;

  beforeEach(() => {
    filters = {
      country: { value: null },
      species: { value: null },
      isLarval: { value: null },
      isAdult: { value: null },
      control: { value: null },
      season: { value: null },
      timeRange: {
        value: {
          start: null,
          end: null,
        },
      },
    };
  });

  it('returns the correct query without any filters', () => {
    expect(occurrenceQuery(0, 100, filters)).toMatchSnapshot();
  });

  it('includes countries if in filters', () => {
    filters.country.value = ['Kenya', 'Uganda'];
    expect(occurrenceQuery(0, 100, filters)).toMatchSnapshot();
  });

  it('converts time range if in filters', () => {
    filters.timeRange.value = {
      start: 1001,
      end: 2002,
    };
    expect(occurrenceQuery(0, 100, filters)).toMatchSnapshot();
  });
});

describe('referenceQuery', () => {
  it('returns the correct query', () => {
    expect(
      referenceQuery(10, 50, 'num_id', 'asc', 10, 100, 'filter')
    ).toMatchSnapshot();
  });
});

describe('species information', () => {
  it('speciesInformationById queries with the right id', () => {
    expect(speciesInformationById('123-ABC')).toContain(
      'speciesInformationById(id: "123-ABC")'
    );
    expect(speciesInformationById('123-ABC')).toMatchSnapshot();
  });

  it('upsertSpeciesInformationMutation builds the correct mutation if creating', () => {
    const speciesInformation = {
      name: 'test species',
      shortDescription: 'short description test',
      description: '# full description\n\nsome content',
      speciesImage: 'base64-image-ABCDEF',
    };

    const query = upsertSpeciesInformationMutation(speciesInformation);
    expect(query).not.toContain('id:');
    expect(query).toContain(`createEditSpeciesInformation(input: {
         
         name: "test species"
         shortDescription: "short description test"
         description: """# full description

some content"""
         speciesImage: "base64-image-ABCDEF"
      })`);
    expect(query).toMatchSnapshot();
  });

  it('upsertSpeciesInformationMutation builds the correct mutation if editing', () => {
    const speciesInformation = {
      id: '12345678',
      name: 'test species',
      shortDescription: 'short description test',
      description: '# full description\n\nsome content',
      speciesImage: 'base64-image-ABCDEF',
    };

    const query = upsertSpeciesInformationMutation(speciesInformation);
    expect(query).toContain(`createEditSpeciesInformation(input: {
         id: "12345678"
         name: "test species"
         shortDescription: "short description test"
         description: """# full description

some content"""
         speciesImage: "base64-image-ABCDEF"
      })`);
    expect(query).toMatchSnapshot();
  });
});

describe('news', () => {
  it('newsById queries with the right id', () => {
    expect(newsById('123-ABC')).toContain('newsById(id: "123-ABC")');
    expect(newsById('123-ABC')).toMatchSnapshot();
  });

  it('getAllNews does not ask for the full article', () => {
    expect(getAllNews()).not.toContain('article');
    expect(getAllNews()).toMatchSnapshot();
  });

  it('upsertNewsMutation builds the correct mutation if creating', () => {
    const news = {
      title: 'test news',
      summary: 'summary test',
      article: '# full article\n\nsome content',
      image: 'base64-image-ABCDEF',
    };

    const query = upsertNewsMutation(news);
    expect(query).not.toContain('id:');
    expect(query).toContain(`createEditNews(input: {
          
          title: "test news"
          summary: "summary test"
          article: """# full article

some content"""
          image: "base64-image-ABCDEF"
       })`);
    expect(query).toMatchSnapshot();
  });

  it('upsertNewsMutation builds the correct mutation if editing', () => {
    const news = {
      id: '12345678',
      title: 'test news',
      summary: 'summary test',
      article: '# full article\n\nsome content',
      image: 'base64-image-ABCDEF',
    };

    const query = upsertNewsMutation(news);
    expect(query).toContain(`createEditNews(input: {
          id: "12345678"
          title: "test news"
          summary: "summary test"
          article: """# full article

some content"""
          image: "base64-image-ABCDEF"
       })`);
    expect(query).toMatchSnapshot();
  });
});
