// import dynamic from 'next/dynamic';
import { useAppSelector } from '../src/state/hooks';
import ClientOnly from '../src/components/shared/clientOnly';
import { is_flag_on } from '../src/utils/utils';
import { MapWrapper } from '../src/components/map/map';

function Map(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <main style={{ width: '100%' }}>
        <ClientOnly>
          {is_flag_on(feature_flags, 'MAP') && <MapWrapper />}
        </ClientOnly>
      </main>
    </div>
  );
}

export default Map;
