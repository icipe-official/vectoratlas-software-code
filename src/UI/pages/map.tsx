import { useAppSelector } from '../state/hooks';
// import ClientOnly from '../components/shared/clientOnly';
import { is_flag_on } from '../utils/utils';
import MapWrapperV3 from '../components/map/mapView/map-v2';
import { useRouter } from 'next/router';
import { getMessages } from '../utils/localization';
import { GetServerSidePropsContext } from 'next';
import AuthWrapper from '../components/shared/AuthWrapper';
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
    <div style={{ display: 'flex', flex: 1,overflow: 'hidden' }}>
      {is_flag_on(feature_flags, 'MAP') && (
        <AuthWrapper role="admin">
          <MapWrapperV3
            {...(doiToPass ? { doiResolverId: doiToPass } : {})}
          />
        </AuthWrapper>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getMessages(context);
}

export default Map;
