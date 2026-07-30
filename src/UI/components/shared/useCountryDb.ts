import { useState, useEffect } from 'react';

export interface DBCountry {
  id: string;
  name: string;
  alternative_names: string[];
}

// Global cache variables
let cachedCountries: DBCountry[] | null = null;
let listeners: Array<(data: DBCountry[]) => void> = [];

export const useCountryDb = (isEnabled: boolean) => {
  const [data, setData] = useState<DBCountry[]>(cachedCountries || []);

  useEffect(() => {
    if (!isEnabled) return;
    if (cachedCountries) {
      setData(cachedCountries);
      return;
    }

    listeners.push(setData);

    if (listeners.length === 1) {
      fetch('/vector-api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          const records = json.data?.allCountries || [];
          cachedCountries = records;
          listeners.forEach((l) => l(records));
          listeners = [];
        })
        .catch(() => {
          listeners.forEach((l) => l([]));
          listeners = [];
        });
    }
  }, [isEnabled]);

  return data;
};
