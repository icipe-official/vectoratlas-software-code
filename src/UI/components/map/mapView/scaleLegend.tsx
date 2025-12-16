import { useAppSelector } from '../../../state/hooks';
import {
  linearGradientColorMap,
  maxMinUnitsScaleValues,
} from './layerUtils';

type ScaleLegendProps = {
  overlayName: string;
  title?: string;
};

export default function ScaleLegend({
  overlayName,
  title,
}: ScaleLegendProps) {
  const mapStyles = useAppSelector((state) => state.map.map_styles);

  // ✅ pass overlayName as an object (matches util function signature)
  const scaleValues = maxMinUnitsScaleValues(
    { overlayName },
    mapStyles
  );

  const gradient = linearGradientColorMap(
    { overlayName },
    mapStyles
  );

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        marginLeft: 20,
      }}
    >
      {title && (
        <div
          style={{
            fontWeight: 'bold',
            marginBottom: 5,
            textAlign: 'center',
          }}
        >
          {title}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            background: 'black',
            color: 'white',
            borderRadius: '5px',
            padding: 2,
            justifyContent: 'center',
          }}
        >
          {scaleValues.max}
          {scaleValues.unit}
        </div>

        <div
          style={{
            display: 'flex',
            background: 'black',
            color: 'white',
            borderRadius: '5px',
            padding: 2,
            justifyContent: 'center',
          }}
        >
          {scaleValues.min}
          {scaleValues.unit}
        </div>
      </div>

      <div
        style={{
          borderRadius: '5px',
          background: gradient,
          boxShadow: '0 0 10px black',
          padding: '4px',
          marginLeft: '5px',
        }}
      />
    </div>
  );
}
