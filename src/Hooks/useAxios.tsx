import axios, { Method, AxiosError } from 'axios';
import { useState, useEffect } from 'react';

interface UseAxiosProps {
  method: Method;
  url: string;
}

interface AxiosState {
  response?: object | undefined;
  loading: boolean;
  error?: AxiosError | undefined | unknown;
}

type UseAxiosReturn = [response?: object, loading?: boolean, error?: AxiosError | unknown];

export const useAxios = ({ method, url }: UseAxiosProps): UseAxiosReturn => {
  const [data, setData] = useState<AxiosState>({
    response: undefined,
    loading: true,
    error: undefined,
  });

  const fetchData = async () => {
    setData({ response: undefined, loading: true, error: undefined });

    try {
      const res = await axios.request({ method, url });

      setData({ response: res.data, loading: false, error: undefined });
    } catch (error) {
      console.error('🚀 ~ Axios Error:', error); // Log any errors
      setData({ response: undefined, loading: false, error });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, url]);


  const { response, loading, error } = data;
  return [response, loading, error];
};
