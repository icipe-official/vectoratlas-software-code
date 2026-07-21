import { useState, useEffect } from 'react';

export interface DBRecordedSpecies {
  id: string;
  species: string;
  display_name: string;
  category: string;
}

// Global cache so it only hits the database ONCE for the whole application lifetime
let cachedDbOptions: DBRecordedSpecies[] | null = null;
let listeners: Array<(data: DBRecordedSpecies[]) => void> = [];

export const useSpeciesDb = (isEnabled: boolean) => {
  const [data, setData] = useState<DBRecordedSpecies[]>(cachedDbOptions || []);

  useEffect(() => {
    if (!isEnabled) return;
    if (cachedDbOptions) {
      setData(cachedDbOptions);
      return;
    }

    listeners.push(setData);

    // Only run the actual fetch if it's the first hook mounting
    if (listeners.length === 1) {
      fetch('/vector-api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetAllRecordedSpecies {
              allRecordedSpecies {
                id
                species
                display_name
                category
              }
            }
          `,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          const records = json.data?.allRecordedSpecies || [];
          cachedDbOptions = records;
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