import { useEffect } from "react";

const AsyncXhrFunction = () => {
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "https://example.com/data", true);
      xhr.signal = controller.signal;

      xhr.onload = () => {
        if (!controller.signal.aborted) {
          // Process the response
        }
      };

      xhr.send();
    };

    fetchData();

    return () => {
      controller.abort;
    };
  });

  return <div>Async Xhr Function</div>;
};

export default AsyncXhrFunction;
