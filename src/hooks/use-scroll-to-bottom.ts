import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollToBottom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior | false>(
    false,
  );

  useEffect(() => {
    if (scrollBehavior) {
      endRef.current?.scrollIntoView({ behavior: scrollBehavior });
      setScrollBehavior(false);
    }
  }, [scrollBehavior]);

  const scrollToBottom = useCallback(
    (scrollBehavior: ScrollBehavior = "smooth") => {
      setScrollBehavior(scrollBehavior);
    },
    [],
  );

  return {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter: () => setIsAtBottom(true),
    onViewportLeave: () => setIsAtBottom(false),
  };
}
