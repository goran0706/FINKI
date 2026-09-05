import { useEffect } from "react";

const AsyncFetchFunction = () => {
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const url = "https://example.com/data";
        const response = await fetch(url, { signal: controller.signal });
        if (!controller.signal.aborted) {
          const data = await response.json();
          // Process the data
          console.log(data);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          // Request was aborted
          return;
        }
        // Handle other errors
      }
    };

    fetchData();

    return () => {
      controller.abort;
    };
  });

  return <div>Async Fetch Function</div>;
};

export default AsyncFetchFunction;
