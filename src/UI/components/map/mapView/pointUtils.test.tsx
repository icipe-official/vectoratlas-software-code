import {
  updateOccurrencePoints,
  buildPointLayer,
  buildAreaSelectionLayer,
  removeAreaInteractions,
  updateLegendForSpecies,
} from './pointUtils';
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
jest.mock('ol/control/Control', () =>
  jest.fn(() => ({ setProperties: jest.fn() }))
);
jest.mock('ol/interaction.js', () => ({
  Draw: jest.fn(),
  Modify: jest.fn(),
  Snap: jest.fn(),
}));
jest.mock('ol/geom', () => ({
  Polygon: jest.fn(),
  SimpleGeometry: jest.fn(),
}));
jest.mock('ol/proj', () => ({
  transform: jest.fn(),
}));
jest.mock('ol/events/condition', () => ({
  never: jest.fn(),
}));
jest.mock('ol/Feature', () => ({
  Feature: jest.fn(),
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

  describe('buildAreaSelectionLayer', () => {
    it('builds the correct initial area layer', () => {
      const newLayer = buildAreaSelectionLayer();

      expect((newLayer as any).style()).toEqual({
        fill: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        stroke: {
          color: '#ffcc33',
          width: 2,
        },
        image: {
          radius: 7,
          fill: {
            color: '#ffcc33',
          },
        },
      });
      expect(newLayer.set).toHaveBeenCalledWith('area-select', true);
    });
  });

  describe('removeAreaInteractions', () => {
    const map = {
      removeInteraction: jest.fn(),
    };
    removeAreaInteractions(map);

    expect(map.removeInteraction).toHaveBeenCalledTimes(3);
  });

  describe('updateLegendForSpecies', () => {
    beforeEach(() => {});

    it('sets the right style on the point layer for multiple species', () => {
      const filters = {
        value: ['speciesA', 'speciesB'],
      };
      const colorArray = ['red', 'green'];

      const specified = {
        value: ['gambiae', 'arabiensis', 'funestus'],
      };

      const pointLayer = {
        get: jest.fn().mockReturnValue(true),
        setSource: jest.fn(),
        setStyle: jest.fn(),
      };

      const map = {
        getAllLayers: () => [pointLayer],
        getControls: () => [],
        addControl: jest.fn(),
      };

      updateLegendForSpecies(filters, specified, colorArray, [], map);

      const styleFn = pointLayer.setStyle.mock.calls[0][0];

      const specstyle = styleFn({ get: () => 'arabiensis' });
      expect(specstyle).toEqual({
        image: {
          fill: {
            color: 'yellow',
          },
          radius: 5,
          stroke: {
            color: 'black',
            width: 0.5,
          },
        },
      });

      const outputStyle = styleFn({ get: () => 'speciesA' });
      expect(outputStyle).toEqual({
        image: {
          fill: {
            color: 'red',
          },
          radius: 5,
          stroke: {
            color: 'black',
            width: 0.5,
          },
        },
      });
    });
  });
});
