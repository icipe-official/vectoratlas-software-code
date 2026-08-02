import { useState, useEffect } from 'react';

export interface DBCountry {
  id: string;
  name: string;
  alternative_names: string[];
}

// Global cache variables
let cachedCountries: DBCountry[] | null = null;
let listeners: Array<(data: DBCountry[]) => void> = [];
let isFetching = false; // Prevents race conditions

export const useCountryDb = (isEnabled: boolean, token: string | null) => {
  const [data, setData] = useState<DBCountry[]>(cachedCountries || []);

  useEffect(() => {
    if (!isEnabled) return;
    if (cachedCountries) {
      setData(cachedCountries);
      return;
    }

    listeners.push(setData);

    if (!isFetching) {
      isFetching = true;
      fetch('/vector-api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          query: `
            query AllCountries {
              allCountries {
                id
                name
                alternative_names
              }
            }
          `,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.errors) console.error('GraphQL errors:', json.errors);

          const records = json.data?.allCountries || [];
          cachedCountries = records;
          listeners.forEach((l) => l(records));
          listeners = [];
          isFetching = false;
        })
        .catch((err) => {
          console.error('Failed to fetch countries:', err);
          listeners.forEach((l) => l([]));
          listeners = [];
          isFetching = false;
        });
    }
  }, [isEnabled, token]);

  return data;
};
