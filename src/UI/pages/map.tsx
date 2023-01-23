import { useAppSelector } from '../state/hooks';
import ClientOnly from '../components/shared/clientOnly';
import { is_flag_on } from '../utils/utils';
import { MapWrapperV2 } from '../components/map/mapView/map-v2';

function Map(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <main style={{ width: '100%' }}>
        <ClientOnly>
          {is_flag_on(feature_flags, 'MAP') && <MapWrapperV2 />}
        </ClientOnly>
      </main>
    </div>
  );
}

export default Map;
