import { useEffect, useRef } from 'react';

export default function FocusInput() {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  });

  return <input type='text' ref={inputRef} />;
}
