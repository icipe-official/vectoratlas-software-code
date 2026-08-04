import { createAsyncThunk } from '@reduxjs/toolkit';
import { WMTSWorkspacesEnum } from '../../state.types';

export interface WMTSLayerInfo {
  name: string;
  title: string;
  abstract?: string;
  isVisible: boolean;
  workspace: WMTSWorkspacesEnum;
  wmsUrl: string;
  wmsParams: string;
}

const GEOSERVER_BASE = 'https://test-dmmg.icipe.org/geoserver';

interface GetWMTSOverlaysProps {
  workspace: WMTSWorkspacesEnum;
}

export interface GetWMTSOverlaysResut {
  layers: WMTSLayerInfo[];
  workspace: WMTSWorkspacesEnum;
}

export const getWMTSOverlays = createAsyncThunk<
  GetWMTSOverlaysResut,
  GetWMTSOverlaysProps
>('map/getWMTSOverlays', async (props, { rejectWithValue }) => {
  try {
    const url = `${GEOSERVER_BASE}/${props.workspace}/wms?SERVICE=WMS&REQUEST=GetCapabilities`;
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
    const layerNodes = xml.querySelectorAll('Layer[queryable="1"]');

    console.log('[WMS] Found queryable layers:', layerNodes.length);

    layerNodes.forEach((layerNode) => {
      // ★ CHANGE: scope to direct children only. A plain `querySelector('Name')`
      // searches the entire subtree, so a group <Layer> that also has nested
      // child <Layer> elements could pick up a child's <Name>/<Title>/<Abstract>
      // instead of its own, depending on document order. `:scope >` removes
      // that dependency on how GeoServer happens to order its XML.
      const name =
        layerNode.querySelector(':scope > Name')?.textContent?.trim() ?? '';
      const title =
        layerNode.querySelector(':scope > Title')?.textContent?.trim() ?? name;
      const abstract = layerNode
        .querySelector(':scope > Abstract')
        ?.textContent?.trim();

      if (!name) return;

      console.log('[WMS] Including layer:', name);

      layers.push({
        name,
        title,
        abstract,
        isVisible: false,
        wmsUrl: `${GEOSERVER_BASE}/${props.workspace}/wms`,
        workspace: props.workspace,
        wmsParams: JSON.stringify({
          LAYERS: name,
          TILED: true,
          FORMAT: 'image/png',
          TRANSPARENT: true,
        }),
      });
    });

    return { layers, workspace: props.workspace };
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error fetching WMS layers');
  }
});
