import React, { useEffect, useRef } from "react";

const PersistValuesBetweenRenders = () => {
  const hasMounted = useRef(false);

  useEffect(() => {
    const id = setTimeout(() => {
      hasMounted.current = true;
    }, 2000);

    if (hasMounted.current) {
      console.log("component mounted successfully");
    } else {
      // do something...
      console.log("component not yet mounted");
    }

    return () => clearTimeout(id);
  }, []);

  return <h1>Persist Values Between Renders</h1>;
};

export default PersistValuesBetweenRenders;
