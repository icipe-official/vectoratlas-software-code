
import { useAppSelector, useAppDispatch } from '../state/hooks';
import ClientOnly from '../components/shared/clientOnly';
import { is_flag_on } from '../utils/utils';
import { MapWrapperV2 } from '../components/map/mapView/map-v2';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getOccurrenceData } from '../state/map/actions/getOccurrenceData';

function Map(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);
  const dispatch = useAppDispatch(); // Initialize dispatch
  const { query } = useRouter();
  const { doi } = query;

  useEffect(() => {
    // Fetch data from the endpoint only when `doi` exists
    if (doi) {
      const fetchFilters = async () => {
        try {
          const response = await fetch(`http://localhost:3001/doi?doi=${doi}`);
          const data = await response.json();

          // Access the first element's "filters" in "meta_data"
          const filtersData = data[0]?.meta_data?.filters;
          console.log(filtersData);
          // Dispatch filters data to Redux state
          if (filtersData) {
            dispatch(getOccurrenceData(filtersData));
          }
        } catch (error) {
          console.error('Failed to fetch filters:', error);
        }
      };

      fetchFilters();
    }
  }, [doi, dispatch]); // Re-run the effect if `doi` changes

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

