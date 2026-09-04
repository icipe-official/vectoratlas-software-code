import { useAppSelector } from '../state/hooks';
// import ClientOnly from '../components/shared/clientOnly';
import { is_flag_on } from '../utils/utils';
import MapWrapper from '../components/map/mapView/map-v3';
import { useRouter } from 'next/router';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';
// import AuthWrapper from '../components/shared/AuthWrapper';
import { useEffect, useState } from 'react';
function Map(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);
  const { query } = useRouter();
  const { code } = query;
  const doiToPass =
    typeof code === 'string' ? code : Array.isArray(code) ? code[0] : undefined;

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div></div>;
  }

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: '100vh' }}>
      {is_flag_on(feature_flags, 'MAP') && (
        <MapWrapper {...(doiToPass ? { doiResolverId: doiToPass } : {})} />
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default Map;
