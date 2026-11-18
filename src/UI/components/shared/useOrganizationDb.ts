import { useState, useEffect } from 'react';

export interface DBOrganization {
  id: string;
  name: string;
}

// Global cache variables
let cachedOrganizations: DBOrganization[] | null = null;
let listeners: Array<(data: DBOrganization[]) => void> = [];
let isFetching = false;

export const useOrganizationDb = (isEnabled: boolean, token: string | null) => {
  const [data, setData] = useState<DBOrganization[]>(cachedOrganizations || []);

  useEffect(() => {
    if (!isEnabled) return;

    if (cachedOrganizations) {
      setData(cachedOrganizations);
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
            query AllOrganizations {
              allOrganizations {
                id
                name
              }
            }
          `,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.errors) {
            console.error('GraphQL errors:', json.errors);
          }

          const records: DBOrganization[] = json.data?.allOrganizations || [];

          cachedOrganizations = records;
          listeners.forEach((listener) => listener(records));
          listeners = [];
          isFetching = false;
        })
        .catch((err) => {
          console.error('Failed to fetch organizations:', err);
          listeners.forEach((listener) => listener([]));
          listeners = [];
          isFetching = false;
        });
    }
  }, [isEnabled, token]);

  return data;
};
