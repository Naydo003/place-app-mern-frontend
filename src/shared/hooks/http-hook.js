import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);         // needed to keep track of sent requests that are current so they can be aborted if clicked off of page, ie component unmounts.

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);                               // Note this state update will re-render immediately and not batch with other state updates because it is not in a synchronous function. React does this automatically.
      const httpAbortCtrl = new AbortController();              // we need to abort any http requests made in a component if we unmount the component.
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {              // could use axios or similar if want
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(        // this removes any controllers once they have completed the fetch
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {                        // if the fetch() responds with a 400 or 500 status code this will not be treated as errors. We have to manually throw error.
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  // Calls the abort method upon unmount on all current http requests
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);                 // having a return in useEffect means it executes on unmount.

  return { isLoading, error, sendRequest, clearError };
};
