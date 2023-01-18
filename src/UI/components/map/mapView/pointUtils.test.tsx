import { updateOccurrencePoints, buildPointLayer } from './pointUtils';
import { responseToGEOJSON } from '../utils/map.utils';

jest.mock('../utils/map.utils', () => ({
  responseToGEOJSON: jest.fn().mockReturnValue(['test-feature']),
}));
jest.mock('ol/format/GeoJSON', () =>
  jest.fn().mockReturnValue({
    readFeatures: jest.fn((f) => f),
  })
);
jest.mock('ol/source/Vector', () => jest.fn((s) => s));
jest.mock('ol/layer/Vector', () =>
  jest.fn((l) => {
    return {
      ...l,
      set: jest.fn(),
    };
  })
);
jest.mock('ol/style', () => ({
  Circle: jest.fn((s) => s),
  Style: jest.fn((s) => s),
  Fill: jest.fn((s) => s),
  Stroke: jest.fn((s) => s),
  Icon: jest.fn((s) => s),
}));

describe('pointUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateOccurrencePoints', () => {
    it('updates source features with new points', () => {
      const newOccurrenceData = ['new-data'];
      const pointLayer = {
        get: jest.fn().mockReturnValue(true),
        setSource: jest.fn(),
      };

      const map = {
        getAllLayers: () => [pointLayer],
      };
      updateOccurrencePoints(map, newOccurrenceData);

      expect(responseToGEOJSON).toHaveBeenCalledWith(newOccurrenceData);
      expect(pointLayer.setSource).toHaveBeenCalledWith({
        features: ['test-feature'],
      });
    });
  });

  describe('buildPointLayer', () => {
    it('builds the correct initial point layer', () => {
      const newLayer = buildPointLayer(['occurrence-data']);

      expect(responseToGEOJSON).toHaveBeenCalledWith(['occurrence-data']);
      expect((newLayer as any).source).toEqual({
        features: ['test-feature'],
      });
      expect((newLayer as any).style()).toEqual({
        image: {
          radius: 7,
          fill: {
            color: '#038543',
          },
        },
      });
      expect(newLayer.set).toHaveBeenCalledWith('occurrence-data', true);
    });
  });
});
