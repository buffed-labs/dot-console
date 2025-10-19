import { useCallback, useEffect, useEffectEvent, useRef } from "react";

export function useStateRef<T>(value: T, listener: (state: T) => void) {
  const ref = useRef(value);

  const onMount = useEffectEvent(() => listener(ref.current));

  useEffect(() => {
    onMount();
  }, []);

  return useCallback(
    (value: React.SetStateAction<T>) => {
      ref.current = value instanceof Function ? value(ref.current) : value;
      listener(ref.current);
    },
    [listener],
  );
}
