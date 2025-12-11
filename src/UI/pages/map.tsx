import { useAppSelector } from '../state/hooks';
import ClientOnly from '../components/shared/clientOnly';
import { is_flag_on } from '../utils/utils';
import MapWrapperV3 from '../components/map/mapView/map-v2';
import { useRouter } from 'next/router';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';
function Map(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);
  const { query } = useRouter();
  const { code } = query;
  const doiToPass =
    typeof code === 'string' ? code : Array.isArray(code) ? code[0] : undefined;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <main style={{ width: '100%' }}>
        <ClientOnly>
          {is_flag_on(feature_flags, 'MAP') && (
            <MapWrapperV3
              {...(doiToPass ? { doiResolverId: doiToPass } : {})}
            />
          )}
        </ClientOnly>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default Map;
