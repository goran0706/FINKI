import { useLayoutEffect, useRef } from "react";

function useMounted() {
  const mountedRef = useRef(false);

  // to make this even more generic you should use the useLayoutEffect hook to
  // make sure that you are correctly setting the mountedRef.current immediately
  // after React updates the DOM. Even though this effect does not interact
  // with the dom another side effect inside a useLayoutEffect which does
  // interact with the dom may depend on the value being set
  useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef.current;
}

export default useMounted;
