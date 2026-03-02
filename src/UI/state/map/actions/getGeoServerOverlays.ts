// getWMTSOverlays.ts — rename to getIROverlays.ts ideally
import { createAsyncThunk } from '@reduxjs/toolkit';

export interface WMTSLayerInfo {
  name: string;
  title: string;
  abstract?: string;
  isVisible: boolean;
  // WMS specific
  wmsUrl: string;
  wmsParams: string;
}

const GEOSERVER_BASE = 'https://test-dmmg.icipe.org/geoserver';
const TARGET_WORKSPACE = 'ir_maps';

export const getWMTSOverlays = createAsyncThunk<WMTSLayerInfo[]>(
  'map/getWMTSOverlays',
  async (_, { rejectWithValue }) => {
    try {
      // Hit the WMS GetCapabilities instead
      const url = `${GEOSERVER_BASE}/${TARGET_WORKSPACE}/wms?SERVICE=WMS&REQUEST=GetCapabilities`;
      const res = await fetch(url);

      if (!res.ok) {
        return rejectWithValue(`GeoServer responded with status ${res.status}`);
      }

      const xmlText = await res.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, 'application/xml');

      const parseError = xml.querySelector('parsererror');
      if (parseError) {
        return rejectWithValue('Failed to parse WMS GetCapabilities XML');
      }

      const layers: WMTSLayerInfo[] = [];

      // WMS capabilities lists layers under <Layer><Layer>...
      // Queryable layers are the actual data layers (not the root group)
      const layerNodes = xml.querySelectorAll('Layer[queryable="1"]');

      console.log('[WMS] Found queryable layers:', layerNodes.length);

      layerNodes.forEach((layerNode) => {
        const name = layerNode.querySelector('Name')?.textContent?.trim() ?? '';
        const title =
          layerNode.querySelector('Title')?.textContent?.trim() ?? name;
        const abstract = layerNode
          .querySelector('Abstract')
          ?.textContent?.trim();

        if (!name) return;

        console.log('[WMS] Including layer:', name);

        layers.push({
          name,
          title,
          abstract,
          isVisible: false,
          wmsUrl: `${GEOSERVER_BASE}/${TARGET_WORKSPACE}/wms`,
          wmsParams: JSON.stringify({
            LAYERS: name,
            TILED: true,
            FORMAT: 'image/png',
            TRANSPARENT: true,
          }),
        });
      });

      return layers;
    } catch (err: any) {
      return rejectWithValue(
        err.message ?? 'Unknown error fetching WMS layers'
      );
    }
  }
);
