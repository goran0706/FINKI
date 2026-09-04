import axios from "axios";
import { useEffect } from "react";

const AsyncAxiosFunction = () => {
  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const url = "https://example.com/data";
        const response = await axios.get(url, {
          cancelToken: source.token,
        });
        // Process the response
        console.log(response);
      } catch (error) {
        if (axios.isCancel(error)) {
          // Request was canceled
          return;
        }
        // Handle other errors
      }
    };

    fetchData();

    return () => {
      source.cancel;
    };
  });

  return <div>Async Axios Function</div>;
};

export default AsyncAxiosFunction;
