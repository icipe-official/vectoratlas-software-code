import dynamic from 'next/dynamic';
import { useAppSelector } from "../state/hooks";
import ClientOnly from '../components/shared/clientOnly';
import { is_flag_on } from '../utils/utils';

const MapComponent = dynamic(() => import("../components/map"), { ssr: false });

function Map(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);

  return (
    <div>
      <main >
        <>
          <br />
          <ClientOnly>
            {is_flag_on(feature_flags, "MAP") && <MapComponent/>}
          </ClientOnly>
        </>
      </main>
    </div>
  );
}

export default Map;
