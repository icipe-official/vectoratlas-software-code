import { useState, useEffect } from 'react';

export interface DBSpecies {
  id: string;
  name: string;
  /** alias of name, kept for existing consumers */
  species: string;
  display_name: string;
  category: string;
  color: string;
}

// Back-compat alias (older consumers import this name)
export type DBRecordedSpecies = DBSpecies;

// Global cache so it only hits the database ONCE for the whole application lifetime
let cachedDbOptions: DBSpecies[] | null = null;
let listeners: Array<(data: DBSpecies[]) => void> = [];

export const useSpeciesDb = (isEnabled: boolean) => {
  const [data, setData] = useState<DBSpecies[]>(cachedDbOptions || []);

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
            query GetAllSpecies {
              allSpecies {
                id
                name
                display_name
                category
                color
              }
            }
          `,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          const records: DBSpecies[] = (json.data?.allSpecies || []).map(
            (r: any) => ({ ...r, species: r.name })
          );
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
