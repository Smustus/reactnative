import { useEffect, useState } from "react";

const useFetch = <T>(fetchFunc: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedData = await fetchFunc();
      setData(fetchedData);
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error("Error fetching data")
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  return { data, error, loading, refetch: fetchData, reset };
};

export default useFetch;
