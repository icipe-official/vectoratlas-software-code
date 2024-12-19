import { useAppSelector } from '../state/hooks';
import ClientOnly from '../components/shared/clientOnly';
import { is_flag_on } from '../utils/utils';
import { MapWrapperV2 } from '../components/map/mapView/map-v2';
import { useRouter } from 'next/router';
import { getOccurrenceData } from '../state/map/actions/getOccurrenceData';
import MapState from '../state/map/mapSlice'
import { VectorAtlasFilters } from '../state/state.types';
function Map(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);
  const mapfilters = useAppSelector((state) => state.map.filters); // Get current filters from Redux state
  const mapState = useAppSelector((state) => state.map); // Get current filters from Redux state
  const { query } = useRouter();
  const { doi } = query;

  // Define a variable for the updated filters
  let updatedMapState: any | undefined;

  // Fetch data from the endpoint only when `doi` exists
  if (doi) {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`http://localhost:3001/doi?doi=${doi}`);
        const data = await response.json();

        // Access the first element's "filters" in "meta_data"
        const filtersData = data[0]?.meta_data?.filters;
        console.log(filtersData);
        // Only update filters if new filters are available
        if (filtersData) {
          const updatedmapfilters: VectorAtlasFilters = {
            ...mapfilters, ...filtersData, // Override with new filters data
          };
          updatedMapState = {
            ...mapState, ...{ filters: updatedmapfilters, }, // Copy existing filters

          };
          console.log("updated filters: ", updatedMapState);
          // Dispatch updated filters to Redux state
        }
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      }
    };

    fetchFilters();
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <main style={{ width: '100%' }}>
        <ClientOnly>
          {is_flag_on(feature_flags, 'MAP') && (
            <MapWrapperV2 {...(updatedMapState != null && updatedMapState != undefined ? { updatedfilters: updatedMapState } : {})} />
          )}
        </ClientOnly>
      </main>
    </div>
  );
}

export default Map;

