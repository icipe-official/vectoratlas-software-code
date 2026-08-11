import Map from 'ol/Map';
import { MapFilter } from '../../../state/state.types';
import { speciesStyle } from './types';

function loadImage(url: string): Promise<CanvasImageSource> {
  return new Promise((r) => {
    let i = new Image();
    i.onload = () => r(i);
    i.onerror = () => r(i);
    i.src = url;
  });
}

interface ExportFilters {
  species?: MapFilter<string[]> | any;
  overlay?: string;
  year?: string | number;
}

export const registerDownloadHandler = (
  map: Map | null,
  speciesOrFilters: MapFilter<string[]> | ExportFilters | any,
  speciesStyles: speciesStyle[],
  dbPrimarySpecies?: string[]
) => {
  function downloadHandler() {
    if (!map) return;

    map.once('rendercomplete', async function () {
     const size = map.getSize();
      if (!size || size.length < 2) return;

      const [mapWidth, mapHeight] = size;
      const scale = mapWidth > 1920 ? 1.4 : 1.0;
      const rightPanelWidth = 210 * scale;

      // Extract filter params safely
      let speciesInput = speciesOrFilters;
      let activeOverlay = '';
      let activeYear: string | number = '';

      if (
        speciesOrFilters &&
        typeof speciesOrFilters === 'object' &&
        !Array.isArray(speciesOrFilters)
      ) {
        speciesInput = speciesOrFilters.species;
        activeOverlay = speciesOrFilters.overlay || '';
        activeYear = speciesOrFilters.year ?? '';
      }

      // Extract active species list safely
      let rawSpeciesList: any[] = [];

      if (Array.isArray(speciesInput)) {
        rawSpeciesList = speciesInput;
      } else if (speciesInput && Array.isArray(speciesInput.value)) {
        rawSpeciesList = speciesInput.value;
      } else if (speciesInput && typeof speciesInput === 'object') {
        rawSpeciesList =
          speciesInput.selected || speciesInput.data || Object.values(speciesInput).flat();
      }

      // Fallback: Extract directly from map features if empty
      if (rawSpeciesList.length === 0 && map) {
        const extracted = new Set<string>();
        map.getLayers().forEach((layer) => {
          const source = (layer as any).getSource?.();
          if (source && typeof source.getFeatures === 'function') {
            source.getFeatures().forEach((feature: any) => {
              const spec = feature.get('species');
              if (spec) extracted.add(spec);
            });
          }
        });
        rawSpeciesList = Array.from(extracted);
      }

      // Filter out 'Other Anopheles' and empty strings
      const activeSpeciesList = rawSpeciesList.filter((s) => {
        const str = typeof s === 'string' ? s : s?.name || s?.species || '';
        return str && !str.toLowerCase().includes('other anopheles');
      });

      // Grouping logic: Primary species (from useSpeciesDb) + 'other species'
      // Falls back to a small hardcoded list only if the caller didn't supply
      // the db-driven list, to avoid ever silently losing all grouping.
      const FALLBACK_PRIMARY_SPECIES = [
        'gambiae',
        'arabiensis',
        'funestus',
        'coluzzii',
        'stephensi',
        'moucheti',
      ];

      const primarySpeciesNames = (
        dbPrimarySpecies && dbPrimarySpecies.length > 0
          ? dbPrimarySpecies
          : FALLBACK_PRIMARY_SPECIES
      ).map((p) => p.replace(/^(Anopheles|An\.)\s+/i, '').trim().toLowerCase());

      const primarySpeciesList: any[] = [];
      let hasOtherSpecies = false;

      activeSpeciesList.forEach((s) => {
        const str = typeof s === 'string' ? s : s?.name || s?.species || '';
        const clean = str.replace(/^(Anopheles|An\.)\s+/i, '').trim().toLowerCase();
        // Exact match against the known species list, not a substring match -
        // substring matching previously misclassified hybrids/variants (e.g.
        // "hybrid_funestus_rivulorum-like") as primary species.
        if (primarySpeciesNames.includes(clean)) {
          primarySpeciesList.push(s);
        } else {
          hasOtherSpecies = true;
        }
      });

      const displaySpeciesList = [...primarySpeciesList];
      if (hasOtherSpecies) {
        displaySpeciesList.push('other species');
      }

      const overlayUpper = activeOverlay ? activeOverlay.trim().toUpperCase() : '';
      const isInsecticideActive = overlayUpper.startsWith('INSECTICIDE');
      const isSpeciesOverlayActive =
        overlayUpper.startsWith('SPECIES') ||
        (overlayUpper.length > 0 && overlayUpper !== 'SPECIES DISTRIBUTION');

      const hasOverlay = overlayUpper !== '' && (isInsecticideActive || isSpeciesOverlayActive);
      const bottomBarHeight = hasOverlay ? (isInsecticideActive ? 68 * scale : 60 * scale) : 0;

      // Size the export canvas to fit the full map PLUS separate space for the
      // legend/overlay panels, instead of overwriting map pixels with them.
      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = mapWidth + rightPanelWidth;
      mapCanvas.height = mapHeight + bottomBarHeight;
      const mapContext = mapCanvas.getContext('2d');
      if (!mapContext) return;

      // Fill base canvas background
      mapContext.fillStyle = '#FFFFFF';
      mapContext.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

      // COMPOSITE OPENLAYERS CANVAS LAYERS
      const mapCanvases = Array.from(
        map.getViewport().querySelectorAll<HTMLCanvasElement>('.ol-layer canvas, canvas.ol-layer')
      );

      mapCanvases.forEach((canvas) => {
        if (canvas.width > 0) {
          const parent = canvas.parentNode as HTMLElement;
          const opacity = parent?.style?.opacity || canvas.style.opacity;
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

          const transform = canvas.style.transform;

          if (transform && transform !== 'none' && transform.includes('matrix')) {
            const match = transform.match(/^matrix\((.+)\)$/);
            if (match && match[1]) {
              const matrix = match[1].split(',').map(Number);
              mapContext.setTransform(
                matrix[0],
                matrix[1],
                matrix[2],
                matrix[3],
                matrix[4],
                matrix[5]
              );
              mapContext.drawImage(canvas, 0, 0);
            } else {
              mapContext.setTransform(1, 0, 0, 1, 0, 0);
              mapContext.drawImage(canvas, 0, 0, mapWidth, mapHeight);
            }
          } else {
            // Un-transformed WebGL layers: draw at native map size, not
            // stretched into the larger export canvas.
            mapContext.setTransform(1, 0, 0, 1, 0, 0);
            mapContext.drawImage(canvas, 0, 0, mapWidth, mapHeight);
          }
        }
      });

      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);

      // PAINT PANEL BACKGROUNDS
      // Paint Reserved Right Sidebar Background
      mapContext.fillStyle = '#F8FAFC';
      mapContext.fillRect(mapCanvas.width - rightPanelWidth, 0, rightPanelWidth, mapCanvas.height);

      // Paint Reserved Bottom Overlay Bar Background (If overlay is active)
      if (hasOverlay) {
        mapContext.fillStyle = '#FFFFFF';
        mapContext.fillRect(
          0,
          mapCanvas.height - bottomBarHeight,
          mapCanvas.width - rightPanelWidth,
          bottomBarHeight
        );
        mapContext.strokeStyle = '#CBD5E0';
        mapContext.lineWidth = 1 * scale;
        mapContext.strokeRect(
          0,
          mapCanvas.height - bottomBarHeight,
          mapCanvas.width - rightPanelWidth,
          bottomBarHeight
        );
      }

      // -------------------------------------------------------------
      // 1. VECTORS ON MAP LEGEND (Top Right)
      // -------------------------------------------------------------
      if (displaySpeciesList.length > 0) {
        const sidebarX = mapCanvas.width - rightPanelWidth + 10 * scale;
        const sidebarWidth = rightPanelWidth - 20 * scale;
        const itemHeight = 18 * scale;
        const padding = 10 * scale;
        const headerHeight = 26 * scale;
        const totalHeight = headerHeight + displaySpeciesList.length * itemHeight + padding;

        mapContext.fillStyle = '#FFFFFF';
        mapContext.fillRect(sidebarX, 10 * scale, sidebarWidth, totalHeight);

        mapContext.strokeStyle = '#CBD5E0';
        mapContext.lineWidth = 1 * scale;
        mapContext.strokeRect(sidebarX, 10 * scale, sidebarWidth, totalHeight);

        mapContext.font = `bold ${Math.round(8.5 * scale)}pt Segoe UI, sans-serif`;
        mapContext.fillStyle = '#1E293B';
        mapContext.textAlign = 'left';
        mapContext.fillText('VECTORS ON MAP', sidebarX + padding, 10 * scale + padding + 6 * scale);

        mapContext.strokeStyle = '#E2E8F0';
        mapContext.lineWidth = 1 * scale;
        mapContext.beginPath();
        mapContext.moveTo(sidebarX + padding, 10 * scale + headerHeight);
        mapContext.lineTo(sidebarX + sidebarWidth - padding, 10 * scale + headerHeight);
        mapContext.stroke();

        mapContext.font = `italic ${Math.round(8 * scale)}pt Segoe UI, sans-serif`;
        mapContext.textBaseline = 'middle';

        displaySpeciesList.forEach((s: any, i: number) => {
          const itemX = sidebarX + padding;
          const itemY = 10 * scale + headerHeight + padding / 2 + i * itemHeight + itemHeight / 2;

          const rawName = typeof s === 'string' ? s : s?.name || s?.species || String(s);
          const isOther = rawName.toLowerCase() === 'other species';

          const cleanName = rawName.replace(/^(Anopheles|An\.)\s+/i, '');
          const style = speciesStyles?.find(
            (x) =>
              x.species.toLowerCase() === cleanName.toLowerCase() ||
              x.species.toLowerCase() === rawName.toLowerCase()
          );

          const bulletColor = isOther ? '#7EEFA8' : (style?.color ?? '#7EEFA8');

          mapContext.fillStyle = bulletColor;
          mapContext.beginPath();
          mapContext.arc(itemX + 3 * scale, itemY, 3 * scale, 0, 2 * Math.PI);
          mapContext.fill();

          mapContext.fillStyle = '#1E293B';
          mapContext.textAlign = 'left';
          const displayName = isOther
            ? 'other species'
            : (rawName.startsWith('An.') || rawName.startsWith('Anopheles')
                ? rawName
                : `An. ${rawName}`);

          mapContext.fillText(displayName, itemX + 11 * scale, itemY);
        });

        mapContext.textBaseline = 'alphabetic';
      }

      // -------------------------------------------------------------
      // 2. HORIZONTAL IR / SPECIES OVERLAY LEGEND (Bottom Bar)
      // -------------------------------------------------------------
      if (hasOverlay) {
        const bottomX = 15 * scale;
        const bottomBarY = mapCanvas.height - bottomBarHeight;

        let titleText = overlayUpper;
        if (activeYear && !titleText.includes(String(activeYear))) {
          titleText += ` (${activeYear})`;
        }

        // Row 1: Main Title + Subheader above the ramp
        mapContext.font = `bold ${Math.round(8 * scale)}pt Segoe UI, sans-serif`;
        mapContext.fillStyle = '#0F766E';
        mapContext.textAlign = 'left';
        mapContext.fillText(titleText, bottomX, bottomBarY + 16 * scale);

        const subheaderText = isInsecticideActive
          ? 'BIOASSAY MORTALITY (0–100%)'
          : 'DETECTION PROBABILITY (0–1)';

        const titleWidth = mapContext.measureText(titleText).width;
        mapContext.font = `bold ${Math.round(7 * scale)}pt Segoe UI, sans-serif`;
        mapContext.fillStyle = '#475569';
        mapContext.fillText(
          subheaderText,
          bottomX + titleWidth + 15 * scale,
          bottomBarY + 16 * scale
        );

        // Row 2: Full-Width Horizontal Color Ramp
        const availableBarWidth = mapCanvas.width - rightPanelWidth - 30 * scale;
        const rampWidth = availableBarWidth;
        const rampHeight = 12 * scale;
        const barX = bottomX;
        const barY = bottomBarY + 24 * scale;

        const gradient = mapContext.createLinearGradient(barX, 0, barX + rampWidth, 0);
        if (isInsecticideActive) {
          gradient.addColorStop(0, '#B8530D');
          gradient.addColorStop(0.5, '#E09F5A');
          gradient.addColorStop(1, '#FDF0D5');
        } else {
          gradient.addColorStop(0, '#EAE4F2');
          gradient.addColorStop(0.5, '#A855F7');
          gradient.addColorStop(1, '#581C87');
        }

        mapContext.fillStyle = gradient;
        mapContext.fillRect(barX, barY, rampWidth, rampHeight);

        mapContext.strokeStyle = 'rgba(0,0,0,0.2)';
        mapContext.strokeRect(barX, barY, rampWidth, rampHeight);

        // Ramp Tick Labels (Dynamic based on overlay type)
        mapContext.font = `${Math.round(6.5 * scale)}pt Segoe UI, sans-serif`;
        mapContext.fillStyle = '#475569';

        if (isInsecticideActive) {
          // Left tick: 0% + (Resistance)
          mapContext.textAlign = 'left';
          mapContext.fillText('0%', barX, barY + rampHeight + 11 * scale);
          mapContext.fillText('(Resistance)', barX, barY + rampHeight + 21 * scale);

          // Middle tick: 50%
          mapContext.textAlign = 'center';
          mapContext.fillText('50%', barX + rampWidth / 2, barY + rampHeight + 11 * scale);

          // Right tick: 100% + (Susceptible)
          mapContext.textAlign = 'right';
          mapContext.fillText('100%', barX + rampWidth, barY + rampHeight + 11 * scale);
          mapContext.fillText('(Susceptible)', barX + rampWidth, barY + rampHeight + 21 * scale);
        } else {
          // Species distribution probability ticks (0, 0.5, 1)
          mapContext.textAlign = 'left';
          mapContext.fillText('0', barX, barY + rampHeight + 11 * scale);

          mapContext.textAlign = 'center';
          mapContext.fillText('0.5', barX + rampWidth / 2, barY + rampHeight + 11 * scale);

          mapContext.textAlign = 'right';
          mapContext.fillText('1', barX + rampWidth, barY + rampHeight + 11 * scale);
        }
      } // <-- THIS CLOSING BRACE WAS MISSING

      // -------------------------------------------------------------
      // 3. VECTOR ATLAS LOGO BLOCK (Bottom Right)
      // -------------------------------------------------------------
      const attrWidth = rightPanelWidth - 20 * scale;
      const attrHeight = 48 * scale;
      const attrX = mapCanvas.width - rightPanelWidth + 10 * scale;
      const attrY = mapCanvas.height - attrHeight - 10 * scale;

      mapContext.fillStyle = '#FFFFFF';
      mapContext.fillRect(attrX, attrY, attrWidth, attrHeight);

      mapContext.strokeStyle = '#CBD5E0';
      mapContext.lineWidth = 1 * scale;
      mapContext.strokeRect(attrX, attrY, attrWidth, attrHeight);

      try {
        const img = await loadImage('vector-atlas-logo.svg');
        if (img) {
          mapContext.drawImage(
            img,
            attrX + 10 * scale,
            attrY + 4 * scale,
            130 * scale,
            24 * scale
          );
        }
      } catch (e) {}

      mapContext.font = `${Math.round(7.5 * scale)}pt Segoe UI, sans-serif`;
      mapContext.textAlign = 'center';
      mapContext.fillStyle = '#4A5568';
      mapContext.fillText('Made using Natural Earth', attrX + attrWidth / 2, attrY + 38 * scale);

      // Trigger JPEG Export
      const link = document.getElementById('image-download') as HTMLAnchorElement | null;
      if (link) {
        link.download = 'vector-atlas-map.jpg';
        link.href = mapCanvas.toDataURL('image/jpeg', 0.92);
        link.click();
      }
    });

    if (map.getRenderer()) {
      map.renderSync();
    }
  }

  function handleClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest('#export-png-draw')) {
      downloadHandler();
    }
  }

  document.addEventListener('click', handleClick);

  return () => {
    document.removeEventListener('click', handleClick);
  };
};