import { RefCallback, RefObject, useCallback, useRef } from "react";

export function useRefCallback(): [RefObject<any>, RefCallback<any>] {
  const ref = useRef(null)
  const setRef = useCallback(node => {

    if (node) {
      node.scrollTo(0, node.scrollHeight);
    }

    ref.current = node;
  }, []);

  return [ref, setRef];
}
