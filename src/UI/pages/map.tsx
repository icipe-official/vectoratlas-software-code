import dynamic from 'next/dynamic';
import { useAppSelector } from "../state/hooks";
import ClientOnly from '../components/shared/clientOnly';

const MapComponent = dynamic(() => import("../components/map"), { ssr: false });

function Map(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);

  const is_flag_on = (name: string) => {
    return feature_flags.some(x => x.flag === name && x.on);
  };

  return (
    <div>
      <main >
        <>
          <br />
          <ClientOnly>
            {is_flag_on("MAP") && <MapComponent/>}
          </ClientOnly>
        </>
      </main>
    </div>
  );
}

export default Map;
