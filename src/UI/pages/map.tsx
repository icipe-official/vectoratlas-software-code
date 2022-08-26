// import dynamic from 'next/dynamic';
import { useAppSelector } from '../state/hooks';
import ClientOnly from '../components/shared/clientOnly';
import { is_flag_on } from '../utils/utils';
import {MapWrapper} from '../components/map';
import { borderColor, flexbox } from '@mui/system';

// const MapComponent = dynamic(() => import('../components/map'), { ssr: false });

function Map(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);

  return (
    <div style={{display:'flex', justifyContent:'center', padding:'10px'}}>
      <main >
        <>
          <br />
          <ClientOnly>
            {is_flag_on(feature_flags, 'MAP') && <MapWrapper/>}
          </ClientOnly>
        </>
      </main>
    </div>
  );
}

export default Map;
