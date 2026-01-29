import { useState } from 'react';
import { toast } from 'sonner';

const useFetch = (cb) => {
  console.log('useFetch initialized');
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fn = async (...args) => {
    setLoading(true);
    setError('');
    console.log('args', args);
    try {
      const response = await cb(...args);

      setData(response);
      setError('');
    } catch (error) {
      console.log(error);
      setError(JSON.stringify(error));
      toast.error(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
