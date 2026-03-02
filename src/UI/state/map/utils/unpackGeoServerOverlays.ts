import { MapOverlay } from '../../state.types';

const GEOSERVER_WMS_URL = 'https://test-dmmg.icipe.org/geoserver/wms';

export const unpackGeoServerOverlays = (
  data: Record<string, string[]>
): MapOverlay[] =>
  Object.entries(data).flatMap(([groupName, layers]) =>
    layers.map((layer) => ({
      name: layer,
      displayName: layer.replace(/_/g, ' '),
      sourceType: 'external-wms',
      sourceLayer: layer,
      isVisible: false,
      layerGroup: groupName,

      wms: {
        url: GEOSERVER_WMS_URL,
        layers: `ir:${layer}`,
        serverType: 'geoserver',
        params: {
          FORMAT: 'image/png',
          TRANSPARENT: true,
          TILED: true,
        },
      },
    }))
  );
