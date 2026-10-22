import { useEffect, useState } from 'react';
import { searchMedia } from '../api/nasaApi';

export function useMediaSearch({ query, page, mediaType, yearStart, yearEnd }) {
  const [data, setData] = useState({ items: [], totalHits: 0, hasNext: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    searchMedia({ query, page, mediaType, yearStart, yearEnd })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, page, mediaType, yearStart, yearEnd]);

  return { data, loading, error };
}