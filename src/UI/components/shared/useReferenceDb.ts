import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../state/store';

let cachedDbOptions: any[] | null = null;
let listeners: any[] = [];

export const useReferenceDb = (isEnabled: boolean = true) => {
  const [data, setData] = useState<any[]>(cachedDbOptions || []);
  const token = useSelector((state: AppState) => state.auth.token);

  useEffect(() => {
    if (!isEnabled) return;
    if (cachedDbOptions) {
      setData(cachedDbOptions);
      return;
    }

    listeners.push(setData);

    if (listeners.length === 1) {
      fetch('/vector-api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          query: `
            query GetAllReferences {
              allReferenceData(take: 100, skip: 0, order: "ASC") {
                items {
                  id
                  author
                  article_title
                  citation
                  year
                }
              }
            }
          `,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          const records = json.data?.allReferenceData?.items || [];
          cachedDbOptions = records;
          listeners.forEach((l) => l(records));
          listeners = [];
        })
        .catch((err) => {
          console.error('REFERENCE FETCH ERROR:', err);
          listeners.forEach((l) => l([]));
          listeners = [];
        });
    }
  }, [isEnabled, token]);

  return data;
};
