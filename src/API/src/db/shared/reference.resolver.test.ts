import { Reference } from './entities/reference.entity';
import { CreateReferenceInput, ReferenceResolver } from './reference.resolver';
import { v4 as uuidv4 } from 'uuid';
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('id123')
}))

describe('Reference resolver', () => {
  let resolver: ReferenceResolver;
  let referenceService;

  beforeEach(() => {
    referenceService = {
      findOneById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn()
    };

    resolver = new ReferenceResolver(referenceService);
  });

  it('referenceData delegates finding one by id to reference service', () => {
    resolver.referenceData('123');

    expect(referenceService.findOneById).toHaveBeenCalledWith('123');
  });

  it('allReferenceData delegates finding all to reference service', () => {
    resolver.allReferenceData();

    expect(referenceService.findAll).toHaveBeenCalled();
  });

  it('createReference delegates creation to service', () => {
    const input: CreateReferenceInput = {
      author: 'Author a',
      citation: 'Title b',
      journal_title: 'Journal c',
      report_type: 'Report d',
      published: true,
      v_data: false,
      year: 1909
    }
    resolver.createReference(input);

    const expectedRef: Partial<Reference> = {
      author: 'Author a',
      citation: 'Title b',
      journal_title: 'Journal c',
      report_type: 'Report d',
      published: true,
      v_data: false,
      year: 1909,
      article_title: 'Title b',
      id: 'id123'
    }
    expect(referenceService.save).toHaveBeenCalledWith(expectedRef)
  })
});
