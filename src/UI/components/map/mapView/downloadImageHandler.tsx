import Map from 'ol/Map';
import { MapFilter } from '../../../state/state.types';

function loadImage(url: string): Promise<CanvasImageSource> {
  return new Promise((r) => {
    let i = new Image();
    i.onload = () => r(i);
    i.src = url;
  });
}

export const registerDownloadHandler = (
  map: Map | null,
  species: MapFilter<string[]>,
  speciesColours: string[]
) => {
  function downloadHandler() {
    map?.once('rendercomplete', async function () {
      const mapCanvas = document.createElement('canvas');
      const size = map.getSize();
      if (!size || size.length < 2) {
        return;
      }
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext('2d');
      if (!mapContext) {
        return;
      }

      Array.prototype.forEach.call(
        map
          .getViewport()
          .querySelectorAll(
            '.ol-layer canvas, canvas.ol-layer, .ol-attribution'
          ),
        function (canvas) {
          if (canvas.width > 0) {
            const opacity =
              canvas.parentNode.style.opacity || canvas.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            let matrix;
            const transform = canvas.style.transform;

            if (transform) {
              matrix = transform
                .match(/^matrix\(([^\(]*)\)$/)[1]
                .split(',')
                .map(Number);
            } else {
              matrix = [
                parseFloat(canvas.style.width) / canvas.width,
                0,
                0,
                parseFloat(canvas.style.height) / canvas.height,
                0,
                0,
              ];
            }
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            const backgroundColor = canvas.parentNode.style.backgroundColor;
            if (backgroundColor) {
              mapContext.fillStyle = backgroundColor;
              mapContext.fillRect(0, 0, canvas.width, canvas.height);
            }

            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );
      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);

      // add the attribution
      mapContext.font = '10pt Segoe UI';
      mapContext.fillStyle = 'white';
      mapContext.fillRect(
        mapCanvas.width - 165,
        mapCanvas.height - 60,
        160,
        55
      );
      mapContext.textAlign = 'right';
      mapContext.fillStyle = 'black';
      mapContext.fillText(
        'Made using Natural Earth',
        mapCanvas.width - 10,
        mapCanvas.height - 10
      );
      const img = await loadImage('vector-atlas-logo.svg');
      mapContext.drawImage(
        img,
        mapCanvas.width - 132,
        mapCanvas.height - 55,
        123,
        30
      );

      if (species.value.length > 0) {
        // add the legend
        mapContext.fillStyle = 'rgba(255,255,255,0.5)';
        mapContext.fillRect(
          mapCanvas.width - 145,
          mapCanvas.height - (species.value.length * 20 + 35) - 75,
          140,
          species.value.length * 20 + 35
        );
        mapContext.fillStyle = 'black';

        mapContext.textAlign = 'left';
        mapContext.fillText(
          'Species',
          mapCanvas.width - 138,
          mapCanvas.height - (90 + species.value.length * 20)
        );

        mapContext.font = 'italic 10pt Segoe UI';
        species.value.forEach((s, i) => {
          console.log(speciesColours[i]);
          mapContext.fillStyle = speciesColours[i];
          mapContext.fillText(
            'an. ' + s,
            mapCanvas.width - 130,
            mapCanvas.height - 90 - (species.value.length - 1) * 20 + i * 20
          );
        });
      }

      const link = document.getElementById(
        'image-download'
      ) as HTMLAnchorElement | null;

      if (link != null) {
        link.href = mapCanvas.toDataURL();
        link.click();
      }
    });

    if (map?.getRenderer()) {
      map?.renderSync();
    }
  }

  document
    .getElementById('export-png-draw')
    ?.addEventListener('click', downloadHandler);

  return () => {
    document
      .getElementById('export-png-draw')
      ?.removeEventListener('click', downloadHandler);
  };
};
